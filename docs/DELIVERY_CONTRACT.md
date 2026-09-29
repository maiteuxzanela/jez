# Contrato de Entrega e Checklist de Revisão (Delivery Contract)

> **Template Oficial de Submissão de Entregas — JEZ Collection**  
> **Destinatários:** Desenvolvedores, Subagentes Especialistas, Revisor Crítico e CTO (Alex)  
> **Objetivo:** Garantir que nenhuma alteração seja promovida para produção sem validação determinística de regras de negócio, invariantes, contratos de dados e diretrizes estéticas da marca.

---

## Instruções de Uso

Copie a seção abaixo (a partir de `## 1. Identificação da Entrega`) e cole no corpo do seu Pull Request, issue ou solicitação de revisão executiva.  
**Nenhum campo pode ser deixado em branco.** Se não houver impacto em determinada área, declare explicitamente: `N/A — Justificativa`.

---

## 1. Identificação da Entrega

* **Título da Tarefa / Issue:** `[ex: JEZ-033: Refatoração do Fluxo de Notificação de Despacho]`
* **Autor / Subagente Responsável:** `[@Alex / @Sam / @Cris / @Lumi / etc.]`
* **Data da Submissão:** `YYYY-MM-DD`
* **Contexto e Motivação:**  
  *Breve resumo executivo explicando o porquê desta alteração e como ela beneficia a cliente final ou a Jéssica no ateliê.*

---

## 2. Mapeamento de Regras de Negócio (`docs/BUSINESS_RULES.md`)

| ID da Regra | Título da Regra | Natureza do Impacto | Descrição Detalhada da Mudança |
| :--- | :--- | :--- | :--- |
| `RN-JEZ-XXX` | *Nome da Regra* | `[Criada / Alterada / Validada]` | *Como a regra foi afetada por este commit.* |

* **Houve violação ou flexibilização de alguma Invariante existente?**  
  `[ ] Sim (Exige justificativa técnica formal abaixo)`  
  `[ ] Não (Todas as invariantes foram rigorosamente preservadas)`

---

## 3. Impacto no Ciclo de Vida e Estados (`docs/STATE_MACHINES.md`)

* **A alteração afeta alguma máquina de estado?**  
  `[ ] Máquina 1: Ciclo de Vida do Pedido (Order & Fulfillment)`  
  `[ ] Máquina 2: Ciclo de Vida do Produto e Estoque (Catalog & Inventory)`  
  `[ ] Máquina 3: Gatekeeper de Acesso ao Ateliê (Auth & Security)`  
  `[ ] Máquina 4: Sincronização em Nuvem (Cloud Sync)`  
  `[ ] Nenhuma máquina de estado foi afetada`

* **Em caso positivo, responda:**
  1. Foram criados novos estados?  
  2. Alguma transição anteriormente proibida passou a ser permitida? Por quê?  
  3. A atomicidade/idempotência da transição foi testada contra concorrência?

---

## 4. Contrato de Dados & Armazenamento

* **Houve alteração no esquema do Firestore ou LocalStorage?**  
  `[ ] Sim`  
  `[ ] Não`

* **Detalhamento das Coleções / Chaves Modificadas:**
  * **Coleção / Chave:** `[ex: orders / products / jez_orders]`
  * **Campos Novos ou Modificados:** `[ex: + trackingCompany: string (opcional)]`
  * **Estratégia de Compatibilidade com Dados Legados:**  
    *Como clientes antigos com dados cacheados continuam funcionando sem quebra?*

---

## 5. Validação Determinística & Suíte de Testes (QA Robin)

> *Toda entrega de código DEVE executar a suíte sem erros (`0 falhas`) antes de submeter.*

* **Comando de Teste Executado:**
  ```bash
  node site/tests/smoke_test.js
  ```
* **Resultado da Execução:**
  * **Total de Testes:** `[ex: 389]`
  * **Aprovados:** `[ex: 389]`
  * **Falhas:** `0`
* **Novos Testes Determinísticos Adicionados:**  
  *Descreva os novos asserts adicionados à suíte para cobrir as regras alteradas nesta entrega.*

---

## 6. Auditoria de Diretrizes Estéticas Anti-IA (Ariel & Lumi)

* `[ ]` **Zero Emojis:** Nenhum emoji foi introduzido em arquivos de código (`.js`), templates (`.html`), estilos (`.css`) ou mensagens de erro.
* `[ ]` **Zero Pills:** Nenhum botão ou badge utiliza estilo oval flutuante genérico (`.hero-badge-pill`).
* `[ ]` **Acabamento Artesanal:** Novos componentes utilizam etiquetas com pesponto costurado (`dashed border`), texturas têxteis ou fita adesiva washi-tape.
* `[ ]` **Tokens da Paleta:** Todas as novas cores referenciam estritamente as variáveis de `site/css/tokens.css` (`#23192d`, `#FD0A54`, `#F57576`, `#FEBF97`, `#F5ECB7`).

---

## 7. Cibersegurança & LGPD (Morgan)

* `[ ]` **Sanitização XSS:** Nenhuma variável de usuário é inserida via `.innerHTML` sem `escapeHtml` ou sanitizador dedicado.
* `[ ]` **Proteção PCI:** Nenhum dado sensível de pagamento trafega ou é salvo em logs/banco.
* `[ ]` **CSP Compliance:** Não há scripts inline não autorizados nem violação da política de Content Security Policy.

---

## 8. Parecer Final do Autor / Subagente

* **Veredito:** `[APROVADO PARA REVISÃO CRÍTICA]`  
* **Declaração:** *Declaro que todas as evidências apresentadas são factuais, auditáveis e reproduzíveis no ambiente local.*
