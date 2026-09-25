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
    workspace_dir = Path(os.getenv("GUARD_WORKSPACE", script_dir.parent.parent)).resolve()

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
            from src.core.feedback_formatter import format_ast_rejection_reason

            response = {
                "decision": "continue",
                "reason": format_ast_rejection_reason(
                    "Robin — QA / Guardião JEZ",
                    [v.to_dict() for v in relevant_violations],
                ),
            }
            print(json.dumps(response))
            sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"[Robin - AST Guardrail]: Aviso na verificação de AST: {e}\n")

    # 5. Camada 2: Avaliação de Conformidade via Daemon MCP/IPC (Laya na GPU)
    import time
    from src.decision.ipc_service import is_ipc_available

    def ensure_ipc_daemon() -> bool:
        if is_ipc_available():
            return True
        try:
            subprocess.run(
                ["systemctl", "--user", "start", "openjev.service"],
                capture_output=True,
                timeout=5,
            )
            for _ in range(6):
                time.sleep(0.5)
                if is_ipc_available():
                    return True
        except Exception as e:
            sys.stderr.write(f"[Robin - Daemon Recovery]: Falha ao tentar acordar daemon: {e}\n")
        return is_ipc_available()

    daemon_ready = ensure_ipc_daemon()
    from src.core.feedback_formatter import (
        format_score_rejection_reason,
        format_infrastructure_error_reason,
        format_circuit_breaker_guidance,
    )

    daemon_ready = ensure_ipc_daemon()
    if not daemon_ready:
        response = {
            "decision": "continue",
            "reason": format_infrastructure_error_reason(
                "Robin — QA / Guardião JEZ",
                "Daemon Open JEV está offline em /tmp/openjev_ipc.sock e não respondeu após tentativa de inicialização.",
            ),
        }
        print(json.dumps(response))
        sys.exit(0)

    try:
        from src.client.jev_ipc_client import request_score_and_diagnose
        from src.core.transcript_sniffer import build_factual_premise

        premise = build_factual_premise(
            workspace=str(workspace_dir),
            payload=payload,
        )
        res = request_score_and_diagnose(
            premise=premise,
            workspace=str(workspace_dir),
            threshold=3.40,
        )

        # Trata Saída de Emergência (Circuit Breaker Central)
        if res.get("emergency_exit_unlocked"):
            guidance = format_circuit_breaker_guidance(
                "Robin — QA / Guardião JEZ",
                attempts=res.get("attempts", MAX_ATTEMPTS),
                max_attempts=MAX_ATTEMPTS,
            )
            sys.stderr.write(f"\n{guidance}\n")
            print(json.dumps({}))
            sys.exit(0)

        # Trata Aprovação (Normal ou Borderline Mass Gate)
        if res.get("passed") or res.get("approved_as_borderline"):
            print(json.dumps({}))
            sys.exit(0)

        # Trata Bloqueio Determinístico de AST reportado pelo motor central
        if res.get("ast_blocked"):
            violations = res.get("ast_violations") or []
            response = {
                "decision": "continue",
                "reason": format_ast_rejection_reason("Robin — QA / Guardião JEZ", violations),
            }
            print(json.dumps(response))
            sys.exit(0)

        # Reprovação de Score (< 3.40): reporta diagnóstico estruturado com diretiva
        max_attempts = res.get("max_attempts", MAX_ATTEMPTS)
        response = {
            "decision": "continue",
            "reason": format_score_rejection_reason(
                "Robin — QA / Guardião JEZ",
                res,
                max_attempts=max_attempts,
            ),
        }
        print(json.dumps(response))
        sys.exit(0)

    except Exception as e:
        sys.stderr.write(f"[Robin - Camada 2 Score IPC]: Erro durante avaliação: {e}\n")
        response = {
            "decision": "continue",
            "reason": format_infrastructure_error_reason(
                "Robin — QA / Guardião JEZ",
                f"Erro na comunicação com o daemon Open JEV: {e}",
            ),
        }
        print(json.dumps(response))
        sys.exit(0)


if __name__ == "__main__":
    main()
