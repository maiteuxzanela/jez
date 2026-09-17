# Guia de Apresentação para Entrevista: Metodologia de IA & Engenharia de Agentes
> **Case Study Oficial:** JEZ Collections ([https://jez-collection.web.app](https://jez-collection.web.app))  
> **Tema:** Orquestração de Agentes Especialistas, Governança de Tokens e Portão de Qualidade Contínuo

---

## 🖼️ Material Visual de Apresentação (Pranchas 16:9 em Alta Resolução)

Para apresentar na entrevista (seja compartilhando tela, projetando ou anexando em um deck de slides), utilize as duas pranchas visuais geradas em alta definição:

1. **Prancha 1 — Topologia, Orquestração e Ciclo de Entrega Contínua:**  
   `presentation/metodologia_ia_organograma.png` (ou abra `presentation/metodologia_ia_organograma.html` no navegador).
2. **Prancha 2 — Governança, Gestão de Tokens e Princípios Operacionais:**  
   `presentation/metodologia_ia_governanca.png` (ou abra `presentation/metodologia_ia_governanca.html` no navegador).

---

## 🎯 1. O Posicionamento Estratégico (Como se Vender na Entrevista)

> *"Eu não utilizo IA como um mero gerador de texto ou 'chat de respostas'. Eu encaro LLMs como unidades de computação cognitiva dentro de um **sistema distribuído de microsserviços intelectuais**, governado pelas melhores práticas da engenharia de software tradicional: modularidade, contratos estritos de interface, controle de versão atômico e testes contínuos de regressão."*

### Os 3 Grandes Diferenciais que você demonstra:
1. **Maturidade de Engenharia vs. "Prompt Engineering Amador":** Você não joga problemas genéricos para a IA torcer para dar certo; você estabelece contratos estritos (`AGENTS.md`, `SPEC.md`, `KANBAN.md`), delegação hierárquica e portões de aceitação.
2. **Consciência Econômica e Operacional (Token Economics):** Você sabe que contexto de LLM é recurso escasso e caro. Você aplica filtros determinísticos (OCR, compiladores, scripts) antes de acionar a IA.
3. **Zero Regressão em Produção:** Você tem 209 testes automatizados que impedem que qualquer avanço técnico quebre funcionalidades existentes.

---

## 🎙️ 2. Roteiro de Fala Passo a Passo (Pitch de 3 a 5 Minutos)

### Minuto 1: A Camada de Contexto & Arquivos Fundamentais (Prancha 1 - Esquerda)
* *"No projeto da JEZ Collections, a primeira coisa que estruturei não foi código, foi a **fundação de contexto**, eliminando o problema clássico de perda de memória e alucinações da IA."*
* *"Criei quatro artefatos vivos:"*
  * **`SPEC.md`**: Define as regras de negócio, rotas, arquitetura e modelo de dados no Cloud Firestore.
  * **`AGENTS.md`**: É a 'constituição' do projeto. Define regras inegociáveis (como a diretriz de zero emojis na interface e a paleta de cores oficial) e o contrato operacional de cada persona.
  * **`KANBAN.md`**: Fonte única da verdade para o progresso do projeto, backlog priorizado e os Critérios de Aceite por ticket.
  * **Pasta `personas/`**: Modulariza os perfis em arquivos independentes, permitindo evoluir a autoridade técnica de cada especialista sem poluir o prompt principal.

### Minuto 2: A Estrutura em Dois Níveis & O Princípio da Liderança (Prancha 1 - Centro)
* *"A arquitetura de agentes é dividida em dois níveis muito claros:"*
* **Nível 1 (Orquestrador — Alex, CTO):**
  * *"O papel do orquestrador é exclusivamente planejar, arquitetar e delegar. Ele decompõe épicos em tarefas granulares."*
  * *"Tenho uma regra de ouro: **o orquestrador jamais executa tarefas além de delegar**. Se eu percebo que o orquestrador precisou fazer algo por conta própria mais de uma vez, eu não permito sobrecarga cognitiva: eu instancio uma nova persona especializada na pasta `personas/`."*
* **Nível 2 (Subagents Especialistas):**
  * *"Cada subagente domina seu escopo: **Lumi** cuida de tokens visuais e microinterações boutique; **Sam** foca na conversão, Pix e cálculo de frete; **Cris** projeta a usabilidade mobile do Ateliê da artesã; **Morgan** assegura sanitização XSS, LGPD e transações atômicas no Firestore; **Ariel** blinda a identidade visual contra designs genéricos de IA; e **Noa** otimiza performance WebP, SEO e PWA."*

### Minuto 3: O Portão de Qualidade & A Figura do Supervisor (Prancha 1 - Direita)
* *"Para garantir que o código seja confiável, adoto um portão de qualidade rigoroso:"*
* **Robin (QA & Regression Tester):**
  * *"Criamos uma suíte com **209 testes automatizados**. Antes de qualquer entrega, o testador roda verificações de sintaxe em tempo de compilação (`node -c`), testa o carrinho, cálculo de frete e integridade de banco de dados. Se 1 teste falhar, nada sobe."*
* **O Supervisor / Judge (Visão de Futuro / Próximos Projetos):**
  * *"Uma prática que desenhei e estou trazendo para os meus próximos projetos é a figura do **Supervisor Independente**: um agente que recebe os Critérios de Aceite objetivos do Kanban e avalia friamente o artefato do especialista. Ele só tem duas respostas possíveis: **Aprovado** ou **Refazer com Justificativa Técnica Objetiva**. Isso cria um loop interno de auto-correção antes mesmo do código chegar para revisão humana."*
* **CI/CD e Versionamento:**
  * *"Todo commit é atômico no Git e rastreado pelo ticket do Kanban. O GitHub Actions roda a suíte de testes e só então efetua o deploy contínuo no Firebase Hosting."*

### Minutos 4 e 5: Eficiência de Tokens & Fronteira Humano-IA (Prancha 2)
* *"Passando para a governança e eficiência operacional (Prancha 2):"*
* **1. O Funil Determinístico de Tokens:**
  * *"Gastar tokens caros de LLM para ler 50 páginas de PDF bruto ou procurar um erro de parêntese é um desperdício. Uso ferramentas determinísticas locais: OCR e pdftotext para extrair dados estruturados antes da IA, e `node -c` ou `ripgrep` via CLI para checagens de sintaxe. Isso reduziu nossos custos de contexto em mais de 75%."*
* **2. Anti-Prolixidade:**
  * *"Eliminei todo formalismo inútil do agente: sem saudações vazias, sem pedidos de desculpas. A comunicação é feita por diffs e schemas estruturados."*
* **3. Skills Reutilizáveis:**
  * *"Tarefas que se repetem (como deploy, testes de regressão, checklists de segurança) viram Skills parametrizadas."*
* **4. A Fronteira Ótima Humano + IA:**
  * *"A IA assume 95% da carga mecânica pesada (codificação, documentação, testes unitários, regras de transação). Onde eu, como humana, concentro minha energia?"*
  * *"Em vez de rodar inspeções visuais caras e repetitivas por visão computacional da IA, **eu utilizo o tempo que ganhei com a automação do código para eu mesma conferir e validar a interface visual**, a harmonia das cores e a sensação de toque mobile. A estratégia e a curadoria estética permanecem sob o olhar humano."*

---

## 💡 3. Respostas Preparadas para Perguntas Desafiadoras do Entrevistador

### Pergunta 1: *"Como você garante que os agentes não entrem em alucinação ou quebrem funcionalidades já entregues?"*
* **Resposta Ideal:**
  > *"Através de três travas complementares: **1) Contratos delimitados** no `SPEC.md` e `AGENTS.md`, que impedem o agente de inventar regras fora do escopo; **2) O subagent Robin (QA)** com 209 testes automatizados que rodam a cada modificação, detectando qualquer efeito colateral de imediato; e **3) Pipeline de CI/CD** no GitHub Actions, onde commits que reprovam em testes são impedidos de entrar na branch de produção."*

### Pergunta 2: *"Orquestrar múltiplos agentes não fica proibitivamente caro em consumo de tokens?"*
* **Resposta Ideal:**
  > *"Fica caro se você usar 'context stuffing' ingênuo, jogando o repositório inteiro no prompt a cada interação. Na minha metodologia, adoto o **Funil Determinístico**: tarefas de busca de arquivos são feitas por ripgrep/AST; análise de sintaxe é feita pelo compilador local (`node -c`); e documentos como PDFs passam por OCR e parsers de linha de comando antes de chegar na IA. Além disso, a modularização em `personas/` garante que cada subagente receba apenas o pedaço de contexto pertinente ao seu domínio, sem ruído."*

### Pergunta 3: *"Por que criar uma persona nova quando o orquestrador repete uma tarefa?"*
* **Resposta Ideal:**
  > *"Em engenharia de software chamamos isso de Princípio da Responsabilidade Única (SRP). Se o orquestrador começa a codificar CSS, escrever regras de Firestore e analisar métricas de SEO, a janela de contexto dele sofre entropia ('prompt pollution') e o raciocínio estratégico degrada. Ao isolar um papel recorrente em uma persona na pasta `personas/`, eu crio um especialista focado com instruções precisas, mantendo o orquestrador leve para delegar e arquitetar."*

### Pergunta 4: *"O que você pretende implementar no futuro com o Supervisor / Judge?"*
* **Resposta Ideal:**
  > *"É um padrão de **Agentic Self-Correction / Reflection**. Hoje, muitas equipes entregam a saída da IA diretamente para o desenvolvedor humano revisar. O Supervisor atua como um portão intermediário: ele recebe os critérios de aceitação do Kanban e faz uma auditoria cega e crítica da entrega do especialista. Se faltar um critério, ele mesmo devolve com o log de pendências para o especialista corrigir. O humano só é acionado quando a entrega já atende 100% dos requisitos formais."*

---

## 📁 4. Tabela Rápida de Ativos do Case JEZ Collections

| Ativo | Caminho no Repositório | Papel no Case |
| :--- | :--- | :--- |
| **Prancha 1 (PNG)** | [`presentation/metodologia_ia_organograma.png`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/presentation/metodologia_ia_organograma.png) | Imagem principal da topologia e orquestração para apresentação |
| **Prancha 2 (PNG)** | [`presentation/metodologia_ia_governanca.png`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/presentation/metodologia_ia_governanca.png) | Imagem de economia de tokens, governança e fronteira humano-IA |
| **Prancha 1 (HTML)** | [`presentation/metodologia_ia_organograma.html`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/presentation/metodologia_ia_organograma.html) | Código-fonte visual interativo e responsivo da Prancha 1 |
| **Prancha 2 (HTML)** | [`presentation/metodologia_ia_governanca.html`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/presentation/metodologia_ia_governanca.html) | Código-fonte visual interativo e responsivo da Prancha 2 |
| **Contrato de IA** | [`AGENTS.md`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/AGENTS.md) | Regras inegociáveis, paleta de cores, prompts e limites técnicos |
| **Especificação** | [`SPEC.md`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/SPEC.md) | Requisitos funcionais, arquitetura e modelo de dados |
| **Kanban Vivo** | [`KANBAN.md`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/KANBAN.md) | Épicos decompostos, critérios de aceite e rastreabilidade |
| **Pasta de Personas** | [`personas/`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/personas/) | Diretório modular com os 7 especialistas do projeto |
| **Suíte de Testes** | [`site/tests/smoke_test.js`](file:///mnt/94CCB337CCB3130A/JEZ%20collections/site/tests/smoke_test.js) | 209 testes automatizados de regressão contínua |
