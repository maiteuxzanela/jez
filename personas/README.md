# Organograma da Equipe Técnica — JEZ Collection

Este diretório reúne as personas e prompts de especialistas que guiam a arquitetura, desenvolvimento, segurança e operação do e-commerce da **JEZ Collection**.

---

## 🏛️ Liderança Técnica (CTO)

* **[Alex — Chief Technology Officer (CTO)](./alex_cto.md)**
  * *Responsabilidade:* Liderança geral, arquitetura de software, code review, alinhamento estratégico com os requisitos da Jéssica e garantia de entrega de alto nível.

---

## 👥 Subagents Especialistas

| Especialista | Documento de Persona | Área de Atuação Principal |
| :--- | :--- | :--- |
| **Ariel** | [ariel_brand.md](./ariel_brand.md) | Direção de Arte, Craft Design, Texturas e Combate Ativo à Estética Genérica de IA |
| **Lumi** | [lumi_ux.md](./lumi_ux.md) | UI/UX, Design System da Marca, Micro-interações, Mobile-First Boutique |
| **Sam** | [sam_payments.md](./sam_payments.md) | Fluxos de E-commerce, Pronta Entrega vs. Encomenda, Frete e Checkout Pix/Cartão |
| **Cris** | [cris_merchant.md](./cris_merchant.md) | Painel Administrativo Intuitivo da Jéssica, Gestão de Pedidos e Usabilidade no Celular |
| **Morgan** | [morgan_security.md](./morgan_security.md) | Cibersegurança, Tokenização PCI-DSS, Privacidade de Dados (LGPD) e Mitigação OWASP |
| **Noa** | [noa_growth.md](./noa_growth.md) | Performance Extrema (Core Web Vitals), Otimização de Fotos, SEO e Previews do WhatsApp |
| **Robin** | [robin_qa.md](./robin_qa.md) | QA Contínuo, Testes E2E de Compra e Painel Admin, e Prevenção de Regressões a Cada Alteração |

---

## 💡 Como os Subagents São Utilizados na Prática

1. **Invocação Contextualizada:** Sempre que uma tarefa específica é iniciada (ex.: criar um componente de galeria ou estruturar o webhook de pagamento do Pix), Alex injeta o prompt e os checklists de aceite do respectivo especialista no subagent.
2. **Revisão Multidisciplinar & Regressão (Quality Gate):** Funcionalidades críticas passam por mais de um olhar técnico (exemplo: a tela de checkout é projetada por **Lumi**, integrada funcionalmente por **Sam**, blindada em segurança por **Morgan**, otimizada por **Noa** e validada contra regressões funcionais e visuais por **Robin**).
3. **Coerência de Decisões:** As personas garantem que nenhum código seja escrito sem levar em consideração o ecossistema completo da JEZ Collection.
