#!/usr/bin/env python3
"""Stop Hook de Governança do JEZ Collections (@Robin - QA & Guardião de Marca).

Executa interceptação física no encerramento de turno do agente:
1. Fast-path: Se nenhum arquivo foi modificado no git, sai em < 10ms com {}.
2. Circuit Breaker: Permite até 5 tentativas consecutivas de auto-correção.
   Após 5 tentativas (attempts >= 5), libera o encerramento com {} para emissão do Laudo Técnico.
3. Regra de Marca JEZ: Detecção de emojis proibidos em arquivos da UI/site.
4. Camada 1: Needle 3 AST Guardrail (Fail-Fast determinístico para exceptions engolidas, mocks, etc.).
5. Camada 2: Avaliação de Conformidade Open Jev Score & Diagnose (corte >= 3.40 / 5.0).
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

MAX_ATTEMPTS = 5
STATE_FILE = Path("/tmp/jez_robin_guard_state.json")
JEV_CORE_DIR = Path("/home/maiteuxzanela/projeto JEV")

# Regex para detectar emojis (Unicode blocks comuns para emojis)
EMOJI_PATTERN = re.compile(
    r'[\U0001F300-\U0001F64F'
    r'\U0001F680-\U0001F6FF'
    r'\U0001F700-\U0001F77F'
    r'\U0001F780-\U0001F7FF'
    r'\U0001F800-\U0001F8FF'
    r'\U0001F900-\U0001F9FF'
    r'\U0001FA00-\U0001FA6F'
    r'\U0001FA70-\U0001FAFF'
    r'\U00002702-\U000027B0'
    r'\U000024C2-\U0001F251]+',
    flags=re.UNICODE,
)


def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except Exception as e:
            sys.stderr.write(f"[Robin - State]: Aviso ao carregar estado: {e}\n")
    return {"attempts": 0}


def save_state(state: dict) -> None:
    try:
        STATE_FILE.write_text(json.dumps(state), encoding="utf-8")
    except Exception as e:
        sys.stderr.write(f"[Robin - State]: Falha ao salvar estado: {e}\n")


def clear_state() -> None:
    if STATE_FILE.exists():
        try:
            STATE_FILE.unlink()
        except OSError as e:
            sys.stderr.write(f"[Robin - State]: Falha ao remover estado: {e}\n")


def main():
    try:
        if not sys.stdin.isatty():
            payload = json.load(sys.stdin)
        else:
            payload = {}
    except Exception:
        payload = {}

    script_dir = Path(__file__).parent.resolve()
    workspace_dir = (script_dir.parent.parent).resolve()

    # Injeta JEV Core no sys.path para os motores Needle 3 e Laya
    if str(JEV_CORE_DIR) not in sys.path:
        sys.path.insert(0, str(JEV_CORE_DIR))

    # 1. No-op fast path: verifica alterações no git
    check_git = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(workspace_dir),
        capture_output=True,
        text=True,
    )
    modified_raw = check_git.stdout.strip()
    if not modified_raw:
        clear_state()
        print(json.dumps({}))
        sys.exit(0)

    state = load_state()
    current_attempts = state.get("attempts", 0)

    # 2. Circuit Breaker de 5 tentativas
    if current_attempts >= MAX_ATTEMPTS:
        clear_state()
        sys.stderr.write(
            f"[Robin - Circuit Breaker]: Limite de {MAX_ATTEMPTS} tentativas atingido no JEZ. "
            "Liberando encerramento da resposta para emissão do Laudo Técnico pelo agente.\n"
        )
        print(json.dumps({}))
        sys.exit(0)

    # Coleta arquivos modificados
    modified_files = []
    for line in modified_raw.splitlines():
        line = line.strip()
        if not line:
            continue
        parts = line.split(maxsplit=1)
        if len(parts) == 2:
            modified_files.append(parts[1])

    # 3. Regra de Marca JEZ: Anti-Emoji em arquivos da UI
    emoji_violations = []
    for rel_path in modified_files:
        abs_path = workspace_dir / rel_path
        if not abs_path.is_file():
            continue
        if not any(rel_path.endswith(ext) for ext in [".js", ".html", ".css", ".json"]):
            continue
        if "site/tests/" in rel_path:
            continue
        try:
            with open(abs_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_no, line_content in enumerate(f, 1):
                    match = EMOJI_PATTERN.search(line_content)
                    if match:
                        emoji_violations.append(f"{rel_path}:{line_no} -> emoji '{match.group(0)}' encontrado")
                        if len(emoji_violations) >= 5:
                            break
        except Exception as read_err:
            sys.stderr.write(f"[Robin - Emojis]: Erro ao ler {rel_path}: {read_err}\n")

    if emoji_violations:
        new_attempts = current_attempts + 1
        state["attempts"] = new_attempts
        save_state(state)
        if new_attempts >= MAX_ATTEMPTS:
            clear_state()
            print(json.dumps({}))
            sys.exit(0)

        reasons = "\n".join(emoji_violations[:5])
        response = {
            "decision": "continue",
            "reason": (
                f"🚨 [Robin - QA / Guardião JEZ] (Tentativa {new_attempts}/{MAX_ATTEMPTS}):\n"
                f"Violação da diretriz ZERO EMOJIS detectada nos arquivos modificados:\n\n"
                f"{reasons}\n\n"
                "A marca JEZ Collections proíbe estritamente o uso de emojis na UI e no código. Remova-os antes de concluir."
            ),
        }
        print(json.dumps(response))
        sys.exit(0)

    # 4. Camada 1: Needle 3 AST Guardrail (Fail-Fast determinístico)
    try:
        from src.memory.needle_ast_guard import NeedleASTGuard
        ast_violations = NeedleASTGuard.scan_workspace(str(workspace_dir))
        if ast_violations:
            new_attempts = current_attempts + 1
            state["attempts"] = new_attempts
            save_state(state)
            if new_attempts >= MAX_ATTEMPTS:
                clear_state()
                print(json.dumps({}))
                sys.exit(0)

            violations_summary = "\n".join(
                f"- [{v.rule_id}] {v.file_path}:{v.line_number}: {v.message}"
                for v in ast_violations[:5]
            )
            response = {
                "decision": "continue",
                "reason": (
                    f"🚨 [Robin - QA / Guardião JEZ] (Tentativa {new_attempts}/{MAX_ATTEMPTS}):\n"
                    f"A entrega foi bloqueada por violações determinísticas de AST detectadas pelo Needle 3:\n\n"
                    f"{violations_summary}\n\n"
                    "O agente deve consertar essas violações no disco antes de encerrar o turno."
                ),
            }
            print(json.dumps(response))
            sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"[Robin - AST Guardrail]: Aviso na verificação de AST: {e}\n")

    # 5. Camada 2: Avaliação de Conformidade Open Jev Score & Diagnose
    try:
        from src.core.diff_inspector import extract_workspace_stages
        from src.core.schemas import ScoreRequest, RUBRIC_CATALOG
        from src.decision.engine import OpenJevEngine

        engine = OpenJevEngine(allow_cpu_fallback=True)
        stages = extract_workspace_stages(str(workspace_dir))
        if stages:
            import asyncio
            async def evaluate_stages():
                scores = []
                failed_diags = []
                for st in stages:
                    req = ScoreRequest(
                        premise=f"Validação de código no JEZ ({st.file_path}):\n{st.content[:1000]}",
                        rubric=RUBRIC_CATALOG["entrega"],
                        threshold=3.40,
                    )
                    resp = await engine.evaluate_score(req)
                    scores.append(resp.score)
                    if not resp.passed and not getattr(resp, "borderline", False):
                        failed_diags.append(f"{st.file_path} (Part {st.part_index}): Score {resp.score:.2f} < 3.40")
                avg_score = round(sum(scores) / len(scores), 2) if scores else 4.0
                return avg_score, failed_diags

            avg_score, failed_diags = asyncio.run(evaluate_stages())
            if avg_score < 3.40 and failed_diags:
                new_attempts = current_attempts + 1
                state["attempts"] = new_attempts
                save_state(state)
                if new_attempts >= MAX_ATTEMPTS:
                    clear_state()
                    print(json.dumps({}))
                    sys.exit(0)

                diags_summary = "\n".join(failed_diags[:5])
                response = {
                    "decision": "continue",
                    "reason": (
                        f"🚨 [Robin - QA / Guardião JEZ] (Tentativa {new_attempts}/{MAX_ATTEMPTS}):\n"
                        f"A entrega obteve nota de conformidade {avg_score:.2f} < 3.40 na Camada 2:\n\n"
                        f"{diags_summary}\n\n"
                        "Conserte os blocos com defeitos identificáveis no disco antes de encerrar o turno."
                    ),
                }
                print(json.dumps(response))
                sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"[Robin - Camada 2 Score]: Aviso na avaliação de conformidade: {e}\n")

    # Sucesso completo
    clear_state()
    print(json.dumps({}))
    sys.exit(0)


if __name__ == "__main__":
    main()
