# Prioridade Mandatória do Needle 3 na Inspeção de Código

## 1. Diretriz de Contenção de Contexto (Anti-Context Dumping)
Para qualquer arquivo de código com mais de 300 linhas (em especial `site/admin.js`, `site/app.js`, `site/styles.css`):
* É **terminantemente proibido** utilizar `view_file` de forma cega, abrangente (>100 linhas) ou no arquivo completo.
* É **mandatório** executar `needle3_search` (servidor MCP `open-jev`) antes de qualquer leitura para recortar cirurgicamente o trecho via AST.
* O uso de `view_file` só é admitido após a obtenção do intervalo exato de linhas (`start_line` e `end_line`) retornado pelo `needle3_search`.

## 2. Parâmetros Mandatórios do `needle3_search`
* `workspace`: Sempre o caminho absoluto da raiz do repositório (`/mnt/94CCB337CCB3130A/JEZ collections`).
* `scope`: Subdiretório pertinente relativo à raiz (ex: `site`, `site/js`).
* `max_tokens`: Intervalo estrito entre 500 e 1500 tokens (padrão: 1000).
* `query`: Termos identificadores reais (nomes literais de funções, classes, métodos ou constantes). Proibida prosa descritiva genérica.

## 3. Fallback Restrito
Ferramentas de busca textual (`grep_search`) e leituras diretas só são permitidas para:
* Arquivos não-código (`*.md`, `hooks.json`, configs curtas).
* Situações em que o `needle3_search` foi executado e retornou ausência comprovada de snippets.

## 4. Política Estrita de Conformidade
* Proibição absoluta de emojis em código, documentação e mensagens.
* Proibição absoluta de mocks ou stubs em código de produção e suíte de testes.
