# Organograma da Equipe Técnica — JEZ Collection

Este diretório reúne as personas e prompts de especialistas que guiam a arquitetura, desenvolvimento, segurança e operação do e-commerce da **JEZ Collection**.

---

## 🏛️ Liderança Técnica (CTO)

* **[Alex — Chief Technology Officer (CTO)](./alex_cto.md)**
  * *Responsabilidade:* Liderança geral, arquitetura de software, code review, alinhamento estratégico com os requisitos da Jéssica e garantia de entrega de alto nível.

---

## 👥 Especialistas do Squad

| Especialista | Documento de Persona | Área de Atuação Principal |
| :--- | :--- | :--- |
| **Ariel** | [ariel_brand_art_direction.md](./ariel_brand_art_direction.md) | Direção de Arte, Craft Design, Texturas e Combate Ativo à Estética Genérica de IA |
| **Lumi** | [lumi_ui_ux_frontend.md](./lumi_ui_ux_frontend.md) | UI/UX, Design System da Marca, Micro-interações, Mobile-First Boutique e testes visuais |
| **Sam** | [sam_ecommerce_payments.md](./sam_ecommerce_payments.md) | Fluxos de E-commerce, Pronta Entrega vs. Encomenda, Frete, Checkout Pix/Cartão e testes E2E |
| **Cris** | [cris_admin_merchant.md](./cris_admin_merchant.md) | Painel Administrativo Intuitivo da Jéssica, Gestão de Pedidos e Usabilidade no Celular |
| **Morgan** | [morgan_security_privacy.md](./morgan_security_privacy.md) | Cibersegurança, Tokenização PCI-DSS, Privacidade de Dados (LGPD) e Mitigação OWASP |
| **Noa** | [noa_performance_seo.md](./noa_performance_seo.md) | Performance Extrema (Core Web Vitals), Otimização de Fotos, SEO e Previews do WhatsApp |
| *(Arquivo)* **Robin** | [robin_qa_regression.md](./robin_qa_regression.md) | *[Descontinuada / Integrada]* Testes E2E (smoke_test.js) transferidos para desenvolvedores |

---

## 💡 Como os Especialistas São Utilizados na Prática

1. **Orquestração Mandatória de Squad (AgentTeams):** Sempre que uma tarefa envolver debate, colaboração ou múltiplos especialistas, Alex instancia a equipe compulsoriamente via plugin **AgentTeams** com DAG e mailbox durável. Quando a usuária já tiver autorizado a execução no chat, a criação é feita com `approval: "automatic"`. Finalizada a rodada, a equipe é encerrada via `agent_teams_delete`.
2. **Revisão Multidisciplinar & Regressão (Quality Gate):** Funcionalidades críticas passam por mais de um olhar técnico (exemplo: a tela de checkout é projetada por **Lumi**, integrada funcionalmente por **Sam**, blindada em segurança por **Morgan**, otimizada por **Noa** e validada via testes automatizados no `smoke_test.js` e `needle_verify_delivery`).
3. **Coerência de Decisões:** As personas garantem que nenhum código seja escrito sem levar em consideração o ecossistema completo da JEZ Collection.
