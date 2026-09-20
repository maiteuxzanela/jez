#!/usr/bin/env python3
import sys
import json
import os
import subprocess
import re

# Regex para detectar emojis (Unicode blocks comuns para emojis)
EMOJI_PATTERN = re.compile(
    r'[\U0001F300-\U0001F64F'  # Misc Symbols and Pictographs
    r'\U0001F680-\U0001F6FF'  # Transport and Map
    r'\U0001F700-\U0001F77F'  # Alchemical Symbols
    r'\U0001F780-\U0001F7FF'  # Geometric Shapes Extended
    r'\U0001F800-\U0001F8FF'  # Supplemental Arrows-C
    r'\U0001F900-\U0001F9FF'  # Supplemental Symbols and Pictographs
    r'\U0001FA00-\U0001FA6F'  # Chess Symbols
    r'\U0001FA70-\U0001FAFF'  # Symbols and Pictographs Extended-A
    r'\U00002702-\U000027B0'  # Dingbats
    r'\U000024C2-\U0001F251'
    r']+',
    flags=re.UNICODE
)

def main():
    try:
        if not sys.stdin.isatty():
            payload = json.load(sys.stdin)
        else:
            payload = {}
    except Exception:
        payload = {}

    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.abspath(os.path.join(script_dir, "..", ".."))

    # 1. Verifica arquivos modificados no git
    check_git = subprocess.run(
        ["git", "status", "--porcelain", "site/"],
        cwd=workspace_dir,
        capture_output=True,
        text=True
    )
    
    modified_raw = check_git.stdout.strip()
    if not modified_raw:
        # Nenhum arquivo do site foi modificado
        print(json.dumps({}))
        sys.exit(0)

    modified_files = []
    for line in modified_raw.split("\n"):
        line = line.strip()
        if not line:
            continue
        parts = line.split(maxsplit=1)
        if len(parts) == 2:
            modified_files.append(parts[1])

    # 2. Guardrail Anti-Emoji em arquivos modificados
    emoji_violations = []
    for rel_path in modified_files:
        abs_path = os.path.join(workspace_dir, rel_path)
        if not os.path.isfile(abs_path):
            continue
        if not any(rel_path.endswith(ext) for ext in [".js", ".html", ".css", ".json"]):
            continue
        # Nao aplica restricao de UI a scripts de teste do terminal
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
        except Exception:
            pass

    if emoji_violations:
        reasons = "\n".join(emoji_violations[:5])
        response = {
            "decision": "continue",
            "reason": (
                f"[Robin - QA / Guardiao]: Violacao da diretriz ZERO EMOJIS detectada nos arquivos modificados:\n\n"
                f"{reasons}\n\n"
                f"A marca JEZ Collections proibe estritamente o uso de emojis na UI e no codigo. Remova-os antes de concluir."
            )
        }
        print(json.dumps(response))
        sys.exit(0)

    # 3. Verificacao de sintaxe JS (node -c)
    syntax_errors = []
    for rel_path in modified_files:
        if rel_path.endswith(".js"):
            abs_path = os.path.join(workspace_dir, rel_path)
            if os.path.isfile(abs_path):
                res = subprocess.run(["node", "-c", abs_path], capture_output=True, text=True)
                if res.returncode != 0:
                    syntax_errors.append(f"{rel_path}: {res.stderr.strip()}")

    if syntax_errors:
        reasons = "\n".join(syntax_errors)
        response = {
            "decision": "continue",
            "reason": (
                f"[Robin - QA / Guardiao]: Erro de sintaxe JavaScript detectado:\n\n"
                f"{reasons}\n\n"
                f"Corrija a sintaxe antes de concluir a tarefa."
            )
        }
        print(json.dumps(response))
        sys.exit(0)

    # 4. Executa bateria de testes de regressao (smoke_test.js)
    smoke_test_path = os.path.join(workspace_dir, "site", "tests", "smoke_test.js")
    if os.path.isfile(smoke_test_path):
        test_run = subprocess.run(
            ["node", smoke_test_path],
            cwd=workspace_dir,
            capture_output=True,
            text=True,
            timeout=60
        )
        if test_run.returncode != 0:
            output = test_run.stderr.strip() or test_run.stdout.strip()
            lines = output.split("\n")
            if len(lines) > 30:
                output = "\n".join(lines[-30:])
            response = {
                "decision": "continue",
                "reason": (
                    f"[Robin - QA / Guardiao]: A suite de testes de regressao (smoke_test.js) detectou falhas:\n\n"
                    f"{output}\n\n"
                    f"Nenhuma tarefa pode ser concluida com testes quebrando. Corrija o codigo ou os testes."
                )
            }
            print(json.dumps(response))
            sys.exit(0)

    # Tudo OK
    print(json.dumps({}))

if __name__ == "__main__":
    main()
