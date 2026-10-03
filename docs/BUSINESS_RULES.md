# Catálogo de Invariantes e Regras de Negócio — JEZ Collection

> **Versão:** 1.0.0  
> **Status:** Ativo & Auditável  
> **Responsável Geral:** Alex (CTO & Arquiteto Líder)  
> **Especialistas Vinculados:** Sam (E-Commerce), Cris (Merchant), Morgan (Segurança), Lumi (UI/UX), Ariel (Brand), Noa (Performance), Robin (QA)  
> **Repositório:** `JEZ collections`  

---

## 1. Visão Geral e Contrato de Governança

Este documento cataloga de forma indexável, estrita e unívoca todas as **Regras de Negócio (RN)** da **JEZ Collection**.  
Cada regra atua como um contrato inviolável entre as camadas de domínio, serviços, interfaces e testes automatizados.

Qualquer alteração ou inclusão neste catálogo deve ser submetida via `docs/DELIVERY_CONTRACT.md` e validada deterministicamente pela suíte de regressão (`site/tests/smoke_test.js`).

> **Nota Arquitetural sobre Módulos e Entrypoints:**  
> O projeto adota uma arquitetura em transição contínua para módulos ES dedicados (`site/js/services/`, `site/js/admin/`, `site/js/components/`). Os arquivos consolidados na raiz de `site/` (`app.js`, `admin.js`, `firebase-service.js`) operam como entrypoints e adaptadores compatíveis tanto para execução nativa em navegadores mobile sem bundler quanto para a suíte de regressão automatizada. Ambos os caminhos são auditados e protegidos por testes.

---

## 2. Índice de Regras de Negócio

| ID | Título Resumido | Domínio | Severidade |
| :--- | :--- | :--- | :--- |
| [`RN-JEZ-001`](#rn-jez-001-modalidade-de-producao-e-prazos) | Modalidade de Produção (Pronta Entrega vs Sob Encomenda) | Catálogo & Checkout | Crítica |
| [`RN-JEZ-002`](#rn-jez-002-transicoes-do-ciclo-de-vida-do-pedido) | Transições do Ciclo de Vida do Pedido e Bifurcação | Gestão de Pedidos | Crítica |
| [`RN-JEZ-003`](#rn-jez-003-deducao-atomica-de-estoque-concorrente) | Dedução Atômica de Estoque contra Concorrência | Estoque & Transações | Crítica |
| [`RN-JEZ-004`](#rn-jez-004-sanitizacao-estrita-de-entradas-e-prevencao-xss) | Sanitização Estrita de Entradas e Prevenção de XSS | Segurança & Dados | Crítica |
| [`RN-JEZ-005`](#rn-jez-005-despacho-e-formatacao-do-pedido-no-whatsapp) | Formatação e Despacho de Pedido para WhatsApp Oficial | Checkout & Ateliê | Alta |
| [`RN-JEZ-006`](#rn-jez-006-gatekeeper-criptografico-e-isolamento-de-sessao) | Autenticação SHA-256, Rate Limiting e Sessão do Ateliê | Segurança & Admin | Crítica |
| [`RN-JEZ-007`](#rn-jez-007-resiliencia-de-armazenamento-e-cota-de-fotos) | Resiliência contra QuotaExceededError no LocalStorage | Storage & Mídia | Alta |
| [`RN-JEZ-008`](#rn-jez-008-visibilidade-e-filtro-de-pecas-suspensas) | Ocultamento de Peças Suspensas na Vitrine Pública | Catálogo & Vitrine | Alta |
| [`RN-JEZ-009`](#rn-jez-009-limite-e-integridade-do-carrossel-de-fotos) | Limite de Fotos (Máx 5) e Proteção da Imagem de Capa | Catálogo & Mídia | Média |
| [`RN-JEZ-010`](#rn-jez-010-expurgo-de-dados-ficticios-e-reset-seguro) | Expurgo de Dados de Teste e Reset Seguro de Vendas | Banco de Dados & Admin | Alta |
| [`RN-JEZ-011`](#rn-jez-011-privacidade-lgpd-e-minimizacao-de-dados) | Minimização de Dados (LGPD) e Zero Persistência PCI | Privacidade & Legal | Crítica |
| [`RN-JEZ-012`](#rn-jez-012-governanca-estetica-anti-ia-e-tokens-oficiais) | Diretrizes Anti-IA (Zero Emojis, Zero Pills, Woven Tags) | Design System & UI | Crítica |
| [`RN-JEZ-013`](#rn-jez-013-resiliencia-de-consulta-de-cep-e-fallback-regional) | Fallback de CEP e Logística Regional (Montes Claros) | Frete & Integrações | Média |
| [`RN-JEZ-014`](#rn-jez-014-galeria-mista-e-diretrizes-esteticas-de-video-em-loop) | Galeria Mista e Diretrizes Estéticas de Vídeo em Loop | Design & Mídia | Alta |
| [`RN-JEZ-015`](#rn-jez-015-arquitetura-de-performance-quotas-e-lazy-loading-de-video) | Performance, Quotas do Storage e Lazy Loading de Vídeo | Performance & Infra | Crítica |

---

## 3. Catálogo Detalhado de Regras de Negócio

### RN-JEZ-001: Modalidade de Produção e Prazos

* **ID & Título:** `RN-JEZ-001` — Modalidade de Produção (Pronta Entrega vs Sob Encomenda).
* **Invariante (O que NUNCA pode acontecer):**  
  Um item sob encomenda (`isReady: false` ou `status: 'order'`) **NUNCA** pode ser vendido como pronta entrega sem a exibição explícita do prazo de confecção (`leadTimeDays`). Um item de pronta entrega esgotado (`stockQty === 0`) **NUNCA** pode ser adicionado à sacola de compras na modalidade pronta entrega.
* **Critério de Aceite / Fluxo Válido:**
  1. Para peças Pronta Entrega (`isReady: true`): exibir quantidade disponível em estoque. No card e no Quick View, o botão de compra opera diretamente. Se `stockQty === 0`, o card recebe filtro `grayscale(100%)`, badge `"Esgotada"` e o botão de compra é desabilitado.
  2. Para peças Sob Encomenda (`isReady: false`): exibir o aviso `"Feito sob encomenda — Prazo de confecção: X dias úteis"`. A compra é permitida normalmente sem travas de estoque finito.
* **Casos de Borda & Exceções:**
  * Se `leadTimeDays` for nulo ou indefinido para peça sob encomenda, adotar fallback seguro de 7 dias úteis.
  * Peça sem flag `isReady` explícita deve ser classificada com base na referência cruzada com o catálogo do ateliê ou fallback seguro para encomenda.
* **Arquivos/Módulos Relacionados:**
  * `site/js/services/products.js`
  * `site/js/admin/orders.js`
  * `site/js/components/product-card.js`
  * `site/app.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 21, 22 e 27 (`Classificação atribui Sob Encomenda/Pronta Entrega/Esgotada`).

---

### RN-JEZ-002: Transições do Ciclo de Vida do Pedido e Bifurcação

* **ID & Título:** `RN-JEZ-002` — Transições do Ciclo de Vida do Pedido e Bifurcação de Produção.
* **Invariante (O que NUNCA pode acontecer):**  
  Um pedido **NUNCA** pode transicionar ilegalmente saltando etapas (ex: de `aguardando-pagamento` direto para `concluido` ou `enviado`), **NUNCA** pode transicionar a partir do estado terminal `concluido` para qualquer outro estado, e um pedido composto exclusivamente por pronta entrega **NUNCA** deve ser direcionado para o status de fabricação (`em-producao`).
* **Critério de Aceite / Fluxo Válido:**
  1. `aguardando-pagamento` -> Se contiver item sob encomenda: avança para `em-producao` (Ação: `"Enviar para o Tear"`).
  2. `aguardando-pagamento` -> Se contiver apenas pronta entrega: avança para `preparar-envio` (Ação: `"Confirmar Pix"`).
  3. `em-producao` -> avança para `preparar-envio` (Ação: `"Peça Concluída"`).
  4. `preparar-envio` -> avança para `enviado` (Ação: `"Postar e Enviar"`, com preenchimento opcional/sanitizado de código de rastreamento).
  5. `enviado` -> avança para `concluido` (Ação: `"Marcar como Entregue"`).
  6. Toda mutação deve ser imutável, retornando uma nova lista de pedidos sem mutar o estado original.
* **Casos de Borda & Exceções:**
  * Status atual nulo, indefinido ou inexistente: rejeitar com `{ allowed: false, reason: 'invalid_current_status' }`.
  * Status alvo nulo ou não previsto: rejeitar com `{ allowed: false, reason: 'invalid_target_status' }`.
  * Pedido não encontrado na lista: retornar `{ success: false, reason: 'order_not_found' }`.
* **Arquivos/Módulos Relacionados:**
  * `site/js/admin/orders.js` (`validateOrderStatusTransition`, `updateOrderInList`, `getStatusMeta`)
  * `site/admin.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 28 (`Testes Unitarios de Validacao e Cobertura de Caminhos de Erro`).

---

### RN-JEZ-003: Dedução Atômica de Estoque contra Concorrência

* **ID & Título:** `RN-JEZ-003` — Dedução Atômica de Estoque contra Venda Concorrente (Race Conditions).
* **Invariante (O que NUNCA pode acontecer):**  
  O estoque de uma peça pronta entrega **NUNCA** pode ficar negativo (`stockQty < 0`) e **NUNCA** pode permitir que duas clientes simultâneas comprem a mesma última unidade de estoque.
* **Critério de Aceite / Fluxo Válido:**
  * O checkout com controle de estoque DEVE utilizar `runTransaction` do Firebase Cloud Firestore.
  * O ciclo de leitura (`transaction.get`) DEVE preceder qualquer escrita.
  * Se `currentStock < requestedQty`, a transação é abortada imediatamente disparando erro com código `ESTOQUE_ESGOTADO`.
  * Havendo estoque suficiente, `stockQty` é decrementado atomicamente na coleção `products` e o pedido é criado na coleção `orders`.
* **Casos de Borda & Exceções:**
  * Firestore indisponível/offline: fallback gracioso criando o pedido localmente e alertando a lojista.
  * Compra de peça com quantidade fracionária ou negativa: normalizada para no mínimo 1 unidade.
* **Arquivos/Módulos Relacionados:**
  * `site/firebase-service.js` (`checkoutWithStockCheck`)
  * `site/js/services/firebase.js`
  * `site/app.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 22 (`Controle de Estoque, Esgotamento Visual e Proteção contra Concorrência`).

---

### RN-JEZ-004: Sanitização Estrita de Entradas e Prevenção de XSS

* **ID & Título:** `RN-JEZ-004` — Sanitização Estrita de Entradas e Prevenção de XSS/Injeção.
* **Invariante (O que NUNCA pode acontecer):**  
  Nenhum dado digitado por usuário (nome do cliente, contato, endereço, código de rastreamento, URLs de fotos) **NUNCA** pode ser interpolado diretamente no DOM sem higienização, nem permitir a execução de scripts arbitrários (`<script>`, eventos `onload`/`onerror`, esquemas `javascript:` ou `data:text/html`).
* **Critério de Aceite / Fluxo Válido:**
  * Todas as entradas textuais passam por `sanitizeCustomerInput` ou `escapeHtml`.
  * Códigos de rastreamento passam por regex estrita: `replace(/[^A-Z0-9\- ]/g, '').slice(0, 30).toUpperCase()`.
  * URLs de imagens são restritas a esquemas seguros (`https://`, `/`, `./`, ou `data:image/(png|jpeg|webp)`). Protocolos perigosos disparam fallback imediato para imagem padrão.
* **Casos de Borda & Exceções:**
  * Entrada nula ou indefinida: converte para string vazia ou valor default seguro.
  * Strings com excesso de espaços em branco: colapsados para espaço único via `\s+`.
* **Arquivos/Módulos Relacionados:**
  * `site/js/services/orders.js` (`sanitizeCustomerInput`)
  * `site/js/admin/orders.js`
  * `site/js/admin/catalog.js` (`sanitizeImageUrl`, `sanitizeTrackingCode`)
  * `site/app.js` e `site/admin.js` (`escapeHtml`)
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 11, 16, 27 e 28.

---

### RN-JEZ-005: Despacho e Formatação do Pedido no WhatsApp

* **ID & Título:** `RN-JEZ-005` — Formatação e Despacho de Pedido para WhatsApp Oficial da Artesã.
* **Invariante (O que NUNCA pode acontecer):**  
  O link gerado para finalização do pedido **NUNCA** pode apontar para números fictícios ou placeholders legados (como `5538999999999`). Deve apontar **exclusivamente** para o WhatsApp oficial de atendimento da Jéssica (`553892322411`).
* **Critério de Aceite / Fluxo Válido:**
  * A URL gerada deve respeitar o formato: `https://wa.me/553892322411?text=${encodeURIComponent(mensagem)}`.
  * A mensagem obrigatória deve conter:
    1. Nome do cliente;
    2. Lista discriminada dos itens e quantidades;
    3. Valor total com separador de frete;
    4. Endereço completo de entrega com CEP validado;
    5. Pergunta padrão de instrução de pagamento via Pix.
* **Casos de Borda & Exceções:**
  * Cliente sem nome preenchido: adotar fallback seguro `"Cliente"`.
  * Frete com custo zero: omitir linha de frete mantendo apenas o total dos produtos.
* **Arquivos/Módulos Relacionados:**
  * `site/js/services/orders.js` (`JESSICA_WHATSAPP`, `formatWhatsAppOrderMessage`)
  * `site/app.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 15 e 16.

---

### RN-JEZ-006: Gatekeeper Criptográfico e Isolamento de Sessão

* **ID & Título:** `RN-JEZ-006` — Autenticação SHA-256, Rate Limiting e Sessão do Ateliê.
* **Invariante (O que NUNCA pode acontecer):**  
  A chave de acesso ao Ateliê **NUNCA** pode ser armazenada em texto plano no código-fonte nem persistida em `localStorage`. Tentativas sucessivas de invasão por força bruta **NUNCA** podem prosseguir sem bloqueio temporário da interface.
* **Critério de Aceite / Fluxo Válido:**
  * A senha fornecida é comparada utilizando o hash SHA-256 processado nativamente via `crypto.subtle.digest`.
  * Limite estrito de **5 tentativas falhas consecutivas**.
  * Atingido o limite, o gatekeeper impõe **bloqueio temporário de 5 minutos** (`LOCKED_OUT`), registrando o timestamp de liberação.
  * A sessão autenticada possui validade de **4 horas** e reside exclusivamente em `sessionStorage` (`jez_atelie_session`), destruída no logout ou ao expirar.
* **Casos de Borda & Exceções:**
  * Tentativa de bypass por recarregamento da página: timestamp de lockout armazenado previne contorno por reload.
  * Navegadores com Web Crypto API desabilitada: bloqueio defensivo por segurança.
* **Arquivos/Módulos Relacionados:**
  * `site/js/admin/auth.js`
  * `site/admin.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 12 (`Sistema de Autenticação & Gatekeeper do Ateliê`).

---

### RN-JEZ-007: Resiliência de Armazenamento e Cota de Fotos

* **ID & Título:** `RN-JEZ-007` — Resiliência contra QuotaExceededError no LocalStorage.
* **Invariante (O que NUNCA pode acontecer):**  
  O painel do Ateliê **NUNCA** deve crashar, travar silenciosamente ou perder dados da peça que a artesã está salvando quando o limite de 5MB de armazenamento local do navegador for atingido por fotos em base64.
* **Critério de Aceite / Fluxo Válido:**
  * Toda foto de capa deve ser comprimida e redimensionada via Canvas para no máximo 540x540px a 72% de qualidade.
  * Fotos complementares são comprimidas para 540px a 68% de qualidade.
  * Ao capturar `QuotaExceededError` no `localStorage.setItem`:
    1. Executar rotina de alívio: compactar fotos complementares de peças antigas no cache local mantendo a capa original intacta;
    2. Preservar 100% de todas as fotos da peça recém-criada ou editada no evento atual;
    3. Tentar nova persistência segura.
* **Casos de Borda & Exceções:**
  * Catálogo nulo ou corrompido: inicializar array vazio e restaurar acervo padrão seguro.
* **Arquivos/Módulos Relacionados:**
  * `site/js/admin/image-compression.js`
  * `site/js/admin/catalog.js`
  * `site/admin.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 24 (`Resiliência de Fotos, Otimização de Payload e Persistência`).

---

### RN-JEZ-008: Visibilidade e Filtro de Peças Suspensas

* **ID & Título:** `RN-JEZ-008` — Ocultamento de Peças Suspensas na Vitrine Pública.
* **Invariante (O que NUNCA pode acontecer):**  
  Uma peça com status `'suspended'` **NUNCA** pode ser visível na vitrine pública (`index.html`), **NUNCA** pode aparecer nos resultados de filtros de categorias e **NUNCA** pode ser adicionada ao carrinho de compras. Além disso, ao ser reativada no Ateliê, a peça **NUNCA** pode perder sua modalidade original de produção (uma peça sob encomenda jamais pode ser sobrescrita indevidamente para pronta entrega ao ser reativada).
* **Critério de Aceite / Fluxo Válido:**
  * A vitrine filtra ativamente o acervo antes da renderização: `products.filter(p => p.status !== 'suspended')`.
  * No painel do Ateliê (`atelie.html`), a peça suspensa é visível na aba dedicada `"Suspensas"`, com badge indicativo e opção de reativação contextual.
  * O acionamento de `"Reativar na Loja"` invoca `mutatePieceStatus(catalog, id, 'reactivate')`, determinando via `determineReactivatedStatus` se a peça deve retornar para `'order'` ou `'ready'`, preservando integralmente `leadTimeDays` ou `stockQty`.
  * Contador executivo do catálogo contabiliza corretamente as peças suspensas separadamente.
* **Casos de Borda & Exceções:**
  * Peça suspensa selecionada anteriormente como destaque (Hero Polaroid): a vitrine deve fazer fallback automático para a primeira peça ativa do catálogo.
  * Peças suspensas legadas sem metadado explícito: recuperadas através da análise de `leadTimeDays` e `isReady`.
* **Arquivos/Módulos Relacionados:**
  * `site/app.js`
  * `site/js/services/products.js`
  * `site/js/admin/catalog.js`
  * `site/admin.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 10, 27 e 29 (JEZ-033).

---

### RN-JEZ-009: Limite e Integridade do Carrossel de Fotos

* **ID & Título:** `RN-JEZ-009` — Limite de Fotos (Máx 5) e Proteção da Imagem de Capa.
* **Invariante (O que NUNCA pode acontecer):**  
  Um produto **NUNCA** pode ter mais de 5 fotos cadastradas no carrossel e o índice 0 (foto oficial de capa) **NUNCA** pode ser excluído diretamente através da lista de fotos complementares sem a definição de uma nova capa.
* **Critério de Aceite / Fluxo Válido:**
  * A galeria suporta entre 1 e 5 imagens.
  * Ao tentar adicionar a 6ª foto, a operação é rejeitada com aviso visual.
  * A exclusão de fotos secundárias recalcula o carrossel e redefine o índice ativo para 0 (capa), garantindo que a renderização nunca aponte para um índice inexistente.
* **Casos de Borda & Exceções:**
  * Peças legadas que contêm apenas o atributo `image`: convertidas dinamicamente para `images = [image]`.
  * Tentativa de exclusão com índice nulo ou fora dos limites: operação ignorada defensivamente.
* **Arquivos/Módulos Relacionados:**
  * `site/js/admin/catalog.js`
  * `site/js/components/quick-view.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 18 e 27 (`Carrossel`).

---

### RN-JEZ-010: Expurgo de Dados Fictícios e Reset Seguro

* **ID & Título:** `RN-JEZ-010` — Expurgo de Dados de Teste e Reset Seguro de Vendas.
* **Invariante (O que NUNCA pode acontecer):**  
  O sistema **NUNCA** pode re-semear pedidos fictícios ou de teste (prefixo legado `JEZ-80...`) após o expurgo pela lojista, e **NUNCA** pode executar o reset completo de vendas sem a confirmação explícita em modal de segurança.
* **Critério de Aceite / Fluxo Válido:**
  * A leitura inicial de pedidos detecta e descarta qualquer array contendo IDs fictícios legados.
  * O acionamento do botão `#btn-reset-orders` exige confirmação em modal dedicado antes de invocar `clearOrders()` no Firestore e limpar o `localStorage`.
* **Casos de Borda & Exceções:**
  * Reset disparado em modo offline: limpa o armazenamento local e sincroniza a deleção assim que restabelecer conexão.
* **Arquivos/Módulos Relacionados:**
  * `site/js/admin/orders.js` (`loadOrders`)
  * `site/firebase-service.js` (`clearOrders`)
  * `site/admin.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 20 (`Limpeza de Vendas Fake e Reset Seguro no Ateliê`).

---

### RN-JEZ-011: Privacidade LGPD e Minimização de Dados

* **ID & Título:** `RN-JEZ-011` — Minimização de Dados (LGPD) e Zero Persistência PCI.
* **Invariante (O que NUNCA pode acontecer):**  
  Dados sensíveis de cartão de crédito (número, CVV, data de validade) **NUNCA** podem ser armazenados no banco de dados, `localStorage` ou logs. Dados de clientes (nome, WhatsApp, endereço) **NUNCA** podem ser coletados além do estritamente necessário para envio postal.
* **Critério de Aceite / Fluxo Válido:**
  * A vitrine disponibiliza modal transparente de Termos & Privacidade LGPD acessível pelo rodapé.
  * Os dados de envio são armazenados vinculados ao pedido apenas para cumprimento fiscal e despacho postal.
  * O contato do cliente é validado estritamente como WhatsApp válido (10 a 13 dígitos) ou formato RFC de e-mail.
* **Casos de Borda & Exceções:**
  * Tentativa de submissão com campos de contato vazios ou maliciosos bloqueia o checkout.
* **Arquivos/Módulos Relacionados:**
  * `site/js/services/orders.js` (`validateCustomerContact`)
  * `site/app.js`
  * `site/index.html`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 11 e 16.

---

### RN-JEZ-012: Governança Estética Anti-IA e Tokens Oficiais

* **ID & Título:** `RN-JEZ-012` — Diretrizes Anti-IA (Zero Emojis, Zero Pills, Woven Tags).
* **Invariante (O que NUNCA pode acontecer):**  
  A interface do e-commerce, o painel do ateliê ou o código-fonte voltado ao usuário **NUNCA** podem conter emojis Unicode em botões, títulos, alertas ou logs. **NUNCA** devem ser utilizadas pílulas ovais flutuantes (`.hero-badge-pill`, `border-radius: 9999px` genéricos) ou ondinhas decorativas irregulares.
* **Critério de Aceite / Fluxo Válido:**
  * Utilizar exclusivamente acabamento de etiquetas de ateliê com pesponto costurado (`dashed border`), texturas têxteis, fita washi-tape e micro-interações de ateliê artesanal.
  * As cores devem seguir estritamente os tokens oficiais:
    * `--color-dark: #23192d` (Aubergine Profundo)
    * `--color-primary: #FD0A54` (Magenta Vibrante)
    * `--color-secondary: #F57576` (Coral Suave)
    * `--color-accent: #FEBF97` (Pêssego Têxtil)
    * `--color-bg-light: #F5ECB7` (Creme Manteiga)
* **Casos de Borda & Exceções:**
  * Ícones devem ser exclusivamente vetores SVG inline ou tipografia pura.
* **Arquivos/Módulos Relacionados:**
  * `site/css/tokens.css`
  * `site/styles.css`
  * `site/admin.css`
  * `site/index.html`
  * `site/atelie.html`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 2, 6, 7 e 23.
  * Hook de parada de Robin: `.agents/scripts/robin_guard.py`.

---

### RN-JEZ-013: Resiliência de Consulta de CEP e Fallback Regional

* **ID & Título:** `RN-JEZ-013` — Fallback de Consulta de CEP e Logística Regional (Montes Claros).
* **Invariante (O que NUNCA pode acontecer):**  
  A indisponibilidade, lentidão ou bloqueio da API externa do ViaCEP **NUNCA** pode impedir a conclusão do checkout nem bloquear a cliente de inserir manualmente seu endereço.
* **Critério de Aceite / Fluxo Válido:**
  * A requisição ao ViaCEP possui timeout estrito de **2.500 ms** gerenciado via `AbortController`.
  * Se o CEP informado pertencer à faixa de origem da artesã em Montes Claros – MG (prefixo `39400` a `39409`), o sistema aplica fallback regional automático preenchendo `"Montes Claros / MG"` com flag `isOriginFallback: true`.
  * Em caso de erro ou timeout de CEPs de outras localidades, os campos de endereço são liberados para preenchimento manual transparente.
* **Casos de Borda & Exceções:**
  * CEP informado com formatação (`39400-000`): higienizado para 8 dígitos numéricos puros antes da consulta.
* **Arquivos/Módulos Relacionados:**
  * `site/js/services/orders.js` (`fetchAddressByCep`)
  * `site/app.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 16.

---

### RN-JEZ-014: Galeria Mista e Diretrizes Estéticas de Vídeo em Loop

* **ID & Título:** `RN-JEZ-014` — Galeria Mista e Diretrizes Estéticas de Vídeo em Loop.
* **Invariante (O que NUNCA pode acontecer):**  
  Vídeos em loop na vitrine ou no catálogo **NUNCA** podem conter faixa de áudio ativa ou emitir som automático. **NUNCA** devem utilizar emojis (ex: 🎬, 📹, ▶️) ou botões pílula flutuantes para indicar reprodução ou mídia mista. Vídeos não devem exceder o limite de 8 segundos para preservar cotas de tráfego e foco tátil.
* **Critério de Aceite / Fluxo Válido:**
  * Vídeos devem possuir duração recomendada entre 3 e 8 segundos, gravados em loop contínuo e silencioso (`muted`, `loop`, `playsinline`).
  * Indicadores de vídeo nos cards e miniaturas devem utilizar acabamento de etiqueta de ateliê pespontada (`dashed border`) com cantos retos suavizados (`border-radius: 4px` a `6px`) e ícones monocromáticos vetoriais SVG (`currentColor`).
  * As miniaturas de vídeo na galeria Quick View exibem selo artesanal discreto de identificação.
  * Diretrizes de gravação e tokens oficiais definidos em `docs/DESIGN_VIDEO_GUIDELINES.md` e `site/css/tokens.css`.
* **Casos de Borda & Exceções:**
  * Navegadores com restrição de autoplay: o vídeo permanece com poster estático com ícone vetorial de reprodução artesanal aguardando interação do usuário.
* **Arquivos/Módulos Relacionados:**
  * `docs/DESIGN_VIDEO_GUIDELINES.md`
  * `site/css/tokens.css`
  * `site/styles.css`
  * `site/js/components/quick-view.js`
  * `site/js/components/product-card.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seções 2, 6, 7 e 23.

---

### RN-JEZ-015: Arquitetura de Performance, Quotas e Lazy Loading de Vídeo

* **ID & Título:** `RN-JEZ-015` — Arquitetura de Performance, Quotas do Storage e Lazy Loading de Vídeo.
* **Invariante (O que NUNCA pode acontecer):**  
  Um arquivo de vídeo com tamanho superior a **4 MB** **NUNCA** pode ser aceito ou enviado para o Firebase Storage no painel do Ateliê. Vídeos na vitrine pública (`index.html`) **NUNCA** podem ser baixados em massa sem interação ou utilizar `preload="auto"`. Um elemento de vídeo **NUNCA** pode ser renderizado sem os atributos obrigatórios de performance e acessibilidade (`autoplay loop muted playsinline preload="metadata"` e `poster`), e **NUNCA** pode causar Cumulative Layout Shift (CLS >= 0.1). O fechamento do modal ou a alternância de mídia **NUNCA** pode deixar o vídeo em reprodução em segundo plano drenando dados e cotas de download do Firebase Storage.
* **Critério de Aceite / Fluxo Válido:**
  * O validador client-side (`validateVideoUploadQuota`) bloqueia preventivamente arquivos maiores que 4 MB (limite estrito para salvaguarda da cota Spark diária de 1 GB).
  * A vitrine consome exclusivamente pôsteres estáticos leves (WebP/JPEG), exibindo a etiqueta pespontada `.product-badge-video` desenhada pela direção de arte.
  * O modal Quick View instancia o vídeo HTML5 sob demanda com `preload="metadata"`, `autoplay`, `loop`, `muted`, `playsinline` e pôster de fallback imediato.
  * O container e o elemento de vídeo possuem proporção fixa 1:1 (`aspect-ratio: 1 / 1; width: 100%; height: 100%; object-fit: cover;`), garantindo CLS rigorosamente inferior a 0.1.
  * Ao fechar o Quick View ou alternar para outra foto da galeria, a rotina `cleanupVideoPlayback` pausa a reprodução imediatamente e descarrega a retenção de buffer.
  * Respeito estrito à preferência do sistema operacional para redução de movimento (`prefers-reduced-motion: reduce`) e economia de dados (`Save-Data`).
* **Casos de Borda & Exceções:**
  * Navegadores com políticas restritivas de autoplay ou conexões 3G com economia de dados ativada: o vídeo exibe o poster estático preservando o layout até interação do usuário.
* **Arquivos/Módulos Relacionados:**
  * `docs/VIDEO_PERFORMANCE_QUOTAS.md`
  * `site/js/services/media-performance.js`
  * `site/js/components/quick-view.js`
  * `site/js/admin/catalog.js`
* **Testes Associados:**
  * `site/tests/smoke_test.js` — Seção 34 (JEZ-032).
