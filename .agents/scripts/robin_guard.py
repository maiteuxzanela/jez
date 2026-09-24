#!/usr/bin/env python3
"""Stop Hook de Governança do JEZ Collections (@Robin - QA & Guardião de Marca).

Executa interceptação física no encerramento de turno do agente:
1. Fast-path de Escopo: Se não houver arquivos de código de produção modificados
   (ex.: apenas documentação .md, configurações .json ou dados),
   libera o encerramento imediatamente (<5ms) sem consumir tentativas.
2. Regra de Marca JEZ: Detecção de emojis proibidos em arquivos da UI/site.
3. Camada 1: Needle 3 AST Guardrail (Fail-Fast determinístico para exceptions engolidas, mocks, etc.).
4. Camada 2: Avaliação de Conformidade via Socket IPC (/tmp/openjev_ipc.sock)
   delegando ao motor oficial openjev_score_and_diagnose com persistência atômica,
   Borderline Mass Gate e Circuit Breaker de 5 tentativas.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

MAX_ATTEMPTS = 5
JEV_CORE_DIR = Path("/home/maiteuxzanela/projeto JEV").resolve()
CODE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css"}

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


def is_production_code(file_path: str) -> bool:
    """Identifica se o arquivo é código executável de produção."""
    p = Path(file_path)
    if p.suffix.lower() not in CODE_EXTENSIONS:
        return False
    if p.name.startswith("test_") or p.name.endswith("_test.py") or p.name.endswith(".test.js") or "/tests/" in file_path:
        return False
    if file_path.startswith(".agents/") or "/.agents/" in file_path:
        return False
    return True


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

    # Injeta JEV Core no sys.path para os clientes leves e Needle 3
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

    # 2. Fast-path de Escopo: verifica se há código de produção a avaliar
    code_files = [f for f in modified_files if is_production_code(f)]
    if not code_files:
        # Tarefa puramente documental, de configuração ou dados:
        # Libera encerramento imediato (<5ms) sem consumir tentativas
        print(json.dumps({}))
        sys.exit(0)

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
        reasons = "\n".join(emoji_violations[:5])
        response = {
            "decision": "continue",
            "reason": (
                f"🚨 [Robin - QA / Guardião JEZ]:\n"
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
        relevant_violations = [
            v for v in ast_violations
            if any(f in v.file_path for f in code_files)
        ]
        if relevant_violations:
            violations_summary = "\n".join(
                f"- [{v.rule_id}] {v.file_path}:{v.line_number}: {v.message}"
                for v in relevant_violations[:5]
            )
            response = {
                "decision": "continue",
                "reason": (
                    f"🚨 [Robin - QA / Guardião JEZ]:\n"
                    f"A entrega foi bloqueada por violações determinísticas de AST detectadas pelo Needle 3:\n\n"
                    f"{violations_summary}\n\n"
                    "O agente deve consertar essas violações no disco antes de encerrar o turno."
                ),
            }
            print(json.dumps(response))
            sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"[Robin - AST Guardrail]: Aviso na verificação de AST: {e}\n")

    # 5. Camada 2: Avaliação de Conformidade via Daemon MCP/IPC
    try:
        from src.client.jev_ipc_client import request_score_and_diagnose

        premise = (
            f"Pedido do Prompt: Validação de conformidade de código no JEZ | "
            f"Resultado Executado: {len(code_files)} arquivos de produção modificados ({', '.join(code_files[:3])})"
        )
        res = request_score_and_diagnose(
            premise=premise,
            workspace=str(workspace_dir),
            threshold=3.40,
        )

        # Trata Saída de Emergência (Circuit Breaker Central)
        if res.get("emergency_exit_unlocked"):
            sys.stderr.write(
                f"[Robin - Circuit Breaker]: Limite de {res.get('max_attempts', MAX_ATTEMPTS)} tentativas atingido no JEZ. "
                "Liberando encerramento da resposta para emissão do Laudo Técnico pelo agente.\n"
            )
            print(json.dumps({}))
            sys.exit(0)

        # Trata Aprovação (Normal ou Borderline Mass Gate)
        if res.get("passed") or res.get("approved_as_borderline"):
            print(json.dumps({}))
            sys.exit(0)

        # Trata Bloqueio Determinístico de AST reportado pelo motor central
        if res.get("ast_blocked"):
            violations = res.get("ast_violations") or []
            violations_summary = "\n".join(
                f"- [{v.get('rule_id')}] {v.get('file_path')}:{v.get('line_number')}: {v.get('message')}"
                for v in violations[:5]
            )
            response = {
                "decision": "continue",
                "reason": (
                    f"🚨 [Robin - QA / Guardião JEZ] (Tentativa {res.get('attempts', 1)}/{res.get('max_attempts', MAX_ATTEMPTS)}):\n"
                    f"A entrega foi bloqueada por violações determinísticas de AST detectadas pelo Needle 3:\n\n"
                    f"{violations_summary}\n\n"
                    "O agente deve consertar essas violações no disco antes de encerrar o turno."
                ),
            }
            print(json.dumps(response))
            sys.exit(0)

        # Reprovação de Score (< 3.40): reporta diagnóstico estruturado
        score = res.get("score", 0.0)
        attempts = res.get("attempts", 1)
        max_attempts = res.get("max_attempts", MAX_ATTEMPTS)
        diag = res.get("diagnosis") or {}
        selected = diag.get("selected", "sem_defeito_identificavel")
        description = diag.get("description", "")
        stages = res.get("stages") or []

        failed_stages_info = [
            f"{st.get('file_path')} (Bloco {st.get('part_index')}/{st.get('total_parts')}): Score {st.get('score', 0):.2f} < 3.40"
            for st in stages if not st.get("passed")
        ]
        failed_summary = "\n".join(failed_stages_info[:5]) if failed_stages_info else f"Diagnóstico: {selected} ({description})"

        response = {
            "decision": "continue",
            "reason": (
                f"🚨 [Robin - QA / Guardião JEZ] (Tentativa {attempts}/{max_attempts}):\n"
                f"A entrega obteve nota de conformidade {score:.2f} < 3.40 na Camada 2:\n\n"
                f"{failed_summary}\n\n"
                f"Defeito identificado: {selected} — {description}\n"
                "Conserte os blocos com defeitos identificáveis no disco antes de encerrar o turno."
            ),
        }
        print(json.dumps(response))
        sys.exit(0)

    except Exception as e:
        sys.stderr.write(f"[Robin - Camada 2 Score IPC]: Erro ao conectar ao daemon JEV: {e}\n")
        # Se o daemon MCP estiver offline, libera para não travar a IDE
        print(json.dumps({}))
        sys.exit(0)


if __name__ == "__main__":
    main()
