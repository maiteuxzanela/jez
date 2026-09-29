# Máquinas de Estado e Ciclo de Vida Transacional — JEZ Collection

> **Versão:** 1.0.0  
> **Status:** Ativo & Auditável  
> **Responsável Geral:** Alex (CTO & Arquiteto Líder)  
> **Especialistas Vinculados:** Sam (E-Commerce), Cris (Merchant), Morgan (Segurança), Robin (QA)  
> **Repositório:** `JEZ collections`  

---

## 1. Visão Geral

Este documento formaliza as **Máquinas de Estado Finitas (FSM)** e os fluxos transacionais das entidades críticas do ecossistema **JEZ Collection**.

A consistência de qualquer transição deve ser garantida tanto em nível de interface (desativação de botões incoerentes) quanto em nível de domínio e persistência (validação defensiva e operações atômicas).

---

## 2. Máquina de Estado 1: Ciclo de Vida do Pedido e Expedição

### 2.1. Estados Permitidos

| Estado (`status`) | Nome Amigável | Descrição de Domínio |
| :--- | :--- | :--- |
| `aguardando-pagamento` | Aguardando Pagamento | Pedido recebido via checkout. Aguardando confirmação do Pix pela artesã. |
| `em-producao` | Em Produção (Tear) | Peça sob encomenda em confecção manual no ateliê em Montes Claros. |
| `preparar-envio` | Preparar Envio | Pagamento confirmado (ou confecção concluída). Embalagem e separação de brindes. |
| `enviado` | Enviado (Postado) | Pacote despachado nos Correios/transportadora com código de rastreamento anexado. |
| `concluido` | Concluído (Entregue) | Entrega confirmada ao cliente final. Estado terminal imutável. |

---

### 2.2. Diagrama de Transições e Bifurcação por Modalidade

```
                           [ Checkout da Loja ]
                                    │
                                    ▼
                         aguardando-pagamento
                                    │
             ┌──────────────────────┴──────────────────────┐
             │ (Contém item Sob Encomenda)                 │ (Apenas Pronta Entrega)
             ▼                                             ▼
        em-producao                                        │
             │                                             │
             │ (Peça Concluída)                            │ (Confirmar Pix)
             └──────────────────────┬──────────────────────┘
                                    │
                                    ▼
                              preparar-envio
                                    │
                                    │ (Postar e Enviar + Rastreio)
                                    ▼
                                 enviado
                                    │
                                    │ (Marcar como Entregue)
                                    ▼
                                concluido (Terminal)
```

---

### 2.3. Matriz de Transições Permitidas vs. Proibidas

| Estado Atual (`currentStatus`) | Próximo Estado Permitido | Estados Explicitamente Proibidos | Justificativa da Proibição |
| :--- | :--- | :--- | :--- |
| `aguardando-pagamento` | `em-producao` *(se sob encomenda)*<br>`preparar-envio` *(se pronta entrega)* | `enviado`, `concluido` | Não é permitido despachar ou concluir pedido sem confirmação de pagamento prévia. |
| `em-producao` | `preparar-envio` | `aguardando-pagamento`, `enviado`, `concluido` | Não pode saltar a etapa de conferência/embalagem, nem regredir pagamento. |
| `preparar-envio` | `enviado` | `aguardando-pagamento`, `em-producao`, `concluido` | Não pode marcar como entregue diretamente da bancada de empacotamento. |
| `enviado` | `concluido` | `aguardando-pagamento`, `em-producao`, `preparar-envio` | Não é permitida regressão de postagem já realizada nos Correios. |
| `concluido` | *(Nenhum — Estado Terminal)* | Qualquer outro estado | Pedido finalizado é **imutável**. Reabertura de pedido viola auditoria contábil. |

---

### 2.4. Gatilhos de Transição, Ações da Interface e Idempotência

1. **Gatilho `Confirmar Pix (Preparar Envio)`:**
   * **Pré-condição:** Pedido em `aguardando-pagamento` e pedido classificado como 100% pronta entrega (`isOrderCustomProduction === false`).
   * **Ação:** Transiciona para `preparar-envio`.
   * **Idempotência:** Mutações repetidas mantêm o status em `preparar-envio` sem duplicação de eventos.

2. **Gatilho `Enviar para o Tear (Produção)`:**
   * **Pré-condição:** Pedido em `aguardando-pagamento` e pedido contendo ao menos uma peça sob encomenda (`isOrderCustomProduction === true`).
   * **Ação:** Transiciona para `em-producao`.

3. **Gatilho `Peça Concluída (Preparar Envio)`:**
   * **Pré-condição:** Pedido em `em-producao`.
   * **Ação:** Confecção artesanal finalizada; avança para `preparar-envio`.

4. **Gatilho `Postar e Enviar`:**
   * **Pré-condição:** Pedido em `preparar-envio`.
   * **Payload Adicional:** Código de rastreamento sanitizado (`trackingCode`).
   * **Ação:** Transiciona para `enviado` e vincula link direto de consulta aos Correios.

5. **Gatilho `Marcar como Entregue`:**
   * **Pré-condição:** Pedido em `enviado`.
   * **Ação:** Transiciona para `concluido`.

---

## 3. Máquina de Estado 2: Ciclo de Vida do Produto e Estoque

### 3.1. Estados Permitidos

| Estado (`modality / status`) | Indicadores | Impacto na Vitrine (`index.html`) | Impacto no Ateliê (`atelie.html`) |
| :--- | :--- | :--- | :--- |
| `READY_IN_STOCK` | `isReady: true`, `stockQty > 0` | Card ativo, exibe estoque, botão de compra liberado. | Badge de estoque disponível, edição liberada. |
| `READY_SOLD_OUT` | `isReady: true`, `stockQty === 0` | Filtro `grayscale(100%)`, badge `"Esgotada"`, botão desabilitado. | Badge `"Esgotada (0 un.)"`, alerta de reabastecimento. |
| `MADE_TO_ORDER` | `isReady: false`, `leadTimeDays > 0` | Exibe prazo de confecção, badge de encomenda, compra liberada. | Badge `"Sob Encomenda (X dias)"`. |
| `SUSPENDED` | `status === 'suspended'` | **Invisível** na vitrine (removido do DOM e de buscas). | Visível na aba `"Suspensas"`, opção de reativação imediata. |

---

### 3.2. Diagrama de Transição de Estoque & Catálogo

```
      [ Cadastro Inicial ]
               │
      ┌────────┴────────┐
      ▼                 ▼
[ READY_IN_STOCK ]  [ MADE_TO_ORDER ]
      │                 │
      │ (Venda:         │
      │  stockQty -> 0) │
      ▼                 │
[ READY_SOLD_OUT ]      │
      │ (Reabastecer)   │
      └────────┬────────┘
               │
               │ (Artesã suspende peça)
               ▼
         [ SUSPENDED ]
               │
               │ (Reativar no Ateliê)
               ▼
       [ Estado Anterior ]
```

---

### 3.3. Requisitos de Atomicidade e Concorrência (Race Conditions)

* **Operação de Checkout (`checkoutWithStockCheck`):**
  * Toda compra que consome estoque DEVE executar em bloco transacional atômico no Firestore via `runTransaction`.
  * Se o snapshot indicar `currentStock < requestedQty`:
    * A transação é abortada com erro `ESTOQUE_ESGOTADO`;
    * Nenhuma alteração é persistida em `products` ou `orders`;
    * A UI exibe notificação amigável avisando que a peça acabou de esgotar.
  * Se houver concorrência simultânea, a transação perdedora é refeita automaticamente pelo SDK do Firestore ou falha de forma segura sem gerar estoque negativo.

---

## 4. Máquina de Estado 3: Gatekeeper de Acesso ao Ateliê

### 4.1. Estados Permitidos

| Estado | Descrição |
| :--- | :--- |
| `UNAUTHENTICATED` | Sessão não iniciada. Acesso restrito com tela de login bloqueando a visão de dados operacionais. |
| `CHALLENGE_ACTIVE` | Usuário inserindo credenciais. Contador de tentativas falhas (`failCount < 5`). |
| `AUTHENTICATED` | Hash SHA-256 validado. Token temporal gravado em `sessionStorage` (validade de 4 horas). |
| `LOCKED_OUT` | 5 tentativas incorretas atingidas. Bloqueio absoluto por 5 minutos registrado por timestamp imutável. |

---

### 4.2. Matriz de Transições do Gatekeeper

```
[ UNAUTHENTICATED ] ──(Tentativa Incorreta)──> [ CHALLENGE_ACTIVE (Tentativas: 1..4) ]
         │                                                      │
         │                                          (5ª Falha Consecutiva)
         │                                                      │
         ▼                                                      ▼
[ AUTHENTICATED ] <──(Após 5 minutos de espera)─────── [ LOCKED_OUT ]
         │
    (Logout manual OU Expiração de 4h)
         │
         ▼
[ UNAUTHENTICATED ]
```

---

## 5. Máquina de Estado 4: Sincronização em Nuvem (Firebase Cloud Firestore)

### 5.1. Estados Permitidos

| Estado | Indicador Visual (`#cloud-sync-badge`) | Comportamento Operacional |
| :--- | :--- | :--- |
| `CONNECTING` | Badge Âmbar pulsante | Inicializando instâncias do Firebase App e Firestore. |
| `ONLINE_SYNCED` | Badge Verde suave | Sincronização bidirecional em tempo real ativa via WebSockets (`onSnapshot`). |
| `OFFLINE_LOCAL` | Badge Cinza discreto | Conexão indisponível; operando com resiliência sobre `localStorage`. |
| `SYNC_ERROR` | Alerta contextual | Falha de permissão (Firestore rules) ou rejeição de rede; fallback local garantido. |
