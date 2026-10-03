# Diretrizes de Direção de Arte & Craft Design — Vídeos em Loop & Galeria Mista (JEZ-032)

> **Autoria:** Ariel (Diretoria de Arte, Identidade Visual & Craft Design)  
> **Para:** Lumi (Frontend UI/UX), Cris (Painel do Ateliê), Alex (CTO) e Jéssica Regina (Artesã & Criadora)  
> **Status:** Ativo & Homologado  
> **Compromissos Inegociáveis:** 🚫 **ZERO EMOJIS** | 🚫 **ZERO BADGES PÍLULA FLUTUANTES** | ✂️ **ETIQUETAS TÊXTEIS COM PESPONTO**  

---

## 1. Manifesto Artístico: O Vídeo como Extensão Tátil do Crochê

No ateliê de Montes Claros, cada ponto carrega tensão manual, relevo, textura e balanço. Uma foto estática captura o formato, mas não consegue transmitir a organicidade do fio de algodão cru em movimento, a flexibilidade da malha aberta na Blusa Teia de Aranha ou o tilintar das correntes de aço na Bolsa Punk.

O vídeo curto em loop (3 a 8 segundos) não é uma peça de publicidade agressiva de rede social — é uma **janela tátil para o processo artesanal**. Ele deve funcionar como uma respiração contínua da peça, convidando a visitante a tocar na tela e sentir a espessura do ponto.

### Princípios da Filmagem Autoral (Guia para Jéssica Regina):
1. **Duração Hipnótica (3s a 8s):** Loops ultra-curtos, contínuos, sem saltos bruscos. O início e o fim devem se fundir de maneira orgânica (movimento pendular, rotação lenta de 360° ou aproximação e afastamento suave).
2. **Silêncio de Ateliê (Sem Áudio):** O vídeo deve ser estritamente sem som (`muted`). Vídeos com ruídos de fundo ou música quebram a serenidade da experiência boutique e aumentam desnecessariamente o tamanho do arquivo.
3. **Foco Macro & Textura Real:** Priorizar planos fechados (close-ups) que valorizem o relevo dos pontos (ponto pipoca, ponto alto, correntinha, teia), o caimento do tecido e os acabamentos metálicos/forros.
4. **Iluminação Natural de Janela:** Evitar ring lights estouradas ou filtros coloridos artificiais de redes sociais que distorcem as cores fiéis das linhas (o tom manteiga do casaco, o magenta neon ou o aubergine profundo). A luz lateral suave valoriza o relevo dos pontos.
5. **Enquadramento 1:1 e Fundo de Estúdio:** Gravar com o objeto centralizado em proporção quadrada (1:1) ou 4:5 vertical, sobre superfícies com personalidade de ateliê (linho rústico, mesa de madeira maciça, tecido cru ou fundo neutro aubergine).
6. **Zero Emojis e Zero Textos Sobrepostos no Vídeo:** O vídeo deve ser puramente a peça viva, sem adesivos de IA, sem animações infantis e sem emojis.

---

## 2. A Identidade Visual da Mídia Mista na Vitrine e Acervo

A incorporação de vídeos curtos em loop junto a fotos estáticas exige diferenciação visual clara e refinada, sem jamais recorrer a truques genéricos de templates SaaS (como botões vermelhos redondos de YouTube, play buttons em pílula ou emojis de câmera 🎥).

### 2.1. O Badge de Mídia: A Etiqueta Têxtil Costurada (*Woven Label*)
Em vez de uma pílula flutuante que parece colada por IA, os cards que possuem vídeo em loop recebem uma **etiqueta de ateliê pespontada**:
- **Corte:** Retangular reto com cantos minimamente suavizados (`border-radius: 4px` a `6px`).
- **Costura (Pesponto):** Linha tracejada artesanal (`border: 1.5px dashed rgba(254, 191, 151, 0.55)`).
- **Fundo:** Aubergine profundo translúcido com textura de linho escuro (`rgba(35, 25, 45, 0.90)` ou `--color-dark-glass`).
- **Tipografia & Ícone:** Tipografia `Plus Jakarta Sans` em caixa-alta compacta (`letter-spacing: 0.08em; font-size: 0.68rem; font-weight: 700;`) acompanhada do ícone vetorial de bobina/loop.

### 2.2. Miniaturas da Galeria no Quick View (`.modal-thumb.is-video`)
- As miniaturas de vídeo na barra inferior do Quick View recebem um selo sutil no canto superior direito: um micro-ícone SVG de play com linha de pesponto e cantos arredondados orgânicos.
- Quando o vídeo está ativo, a borda da miniatura acende com o brilho pêssego aconchegante (`--color-accent: #FEBF97`) e traço pespontado reforçado.

### 2.3. Controles do Vídeo no Modal Quick View
- **Autoplay Contínuo e Discreto:** O vídeo inicia automaticamente em loop e mudo (`autoplay loop muted playsinline`).
- **Botão Sutil de Play/Pausa:** Um botão minimalista no canto inferior direito do modal, integrado ao fundo em vidro aubergine translúcido, com ícones monocromáticos de traço artesanal para quem desejar pausar o movimento.

---

## 3. Ícones Vetoriais SVG Monocromáticos Oficiais (Biblioteca de Ateliê)

Todos os ícones são estritamente vetoriais SVG, utilizam `currentColor` para total aderência aos tokens de cores, possuem espessura de traço consistente (`stroke-width: 1.8` a `2`) e acabamentos orgânicos suaves (`stroke-linecap="round"` `stroke-linejoin="round"`).

### 3.1. Ícone: `jez-icon-video-loop` (Bobina / Fio em Ciclo Perpétuo)
*Uso: Badge no Card da Vitrine, indicador de vídeo no Catálogo do Ateliê e cabeçalho da galeria.*

```xml
<svg class="jez-craft-icon jez-icon-video-loop" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Quadro de filme / moldura de ateliê com pesponto de cantos -->
  <rect x="2" y="4" width="20" height="16" rx="3" ry="3"></rect>
  <!-- Triângulo de play estilizado no centro com cantos suaves -->
  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fill-opacity="0.25"></polygon>
  <!-- Linhas decorativas laterais simbolizando perfurações têxteis da bobina -->
  <line x1="6" y1="4" x2="6" y2="7"></line>
  <line x1="6" y1="17" x2="6" y2="20"></line>
  <line x1="18" y1="4" x2="18" y2="7"></line>
  <line x1="18" y1="17" x2="18" y2="20"></line>
</svg>
```

---

### 3.2. Ícone: `jez-icon-play-craft` (Play Orgânico de Ponta de Agulha)
*Uso: Miniatura no Quick View, overlay de reprodução e botões de controle.*

```xml
<svg class="jez-craft-icon jez-icon-play-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Forma de play com vértice arredondado autoral -->
  <path d="M6 4.5l14 7.5-14 7.5V4.5z" fill="currentColor" fill-opacity="0.3"></path>
</svg>
```

---

### 3.3. Ícone: `jez-icon-pause-craft` (Pausa com Linhas Gêmeas de Costura)
*Uso: Alternância de reprodução no Quick View.*

```xml
<svg class="jez-craft-icon jez-icon-pause-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="8" y1="5" x2="8" y2="19"></line>
  <line x1="16" y1="5" x2="16" y2="19"></line>
</svg>
```

---

### 3.4. Ícone: `jez-icon-reel-tag` (Etiqueta Têxtil de Mídia para Card)
*Uso: Selo integrado na vitrine.*

```xml
<svg class="jez-craft-icon jez-icon-reel-tag" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="9"></circle>
  <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor"></path>
  <!-- Pespontos radiais sugerindo carretel de costura -->
  <line x1="12" y1="3" x2="12" y2="5"></line>
  <line x1="12" y1="19" x2="12" y2="21"></line>
  <line x1="3" y1="12" x2="5" y2="12"></line>
  <line x1="19" y1="12" x2="21" y2="12"></line>
</svg>
```

---

## 4. Especificações de CSS e Classes de UI (Para Lumi & Cris)

### 4.1. Tokens em `site/css/tokens.css`
```css
/* Mídia Mista & Vídeos Curtos em Loop (JEZ-032 — Ariel) */
--media-badge-bg: rgba(35, 25, 45, 0.90);
--media-badge-border: 1.5px dashed rgba(254, 191, 151, 0.55);
--media-badge-text: var(--color-bg-light);
--media-badge-accent: var(--color-primary);
--media-thumb-overlay: rgba(35, 25, 45, 0.65);
--media-stitch-pattern: 1.5px dashed rgba(254, 191, 151, 0.5);
```

### 4.2. Estilos de Badge no Card da Vitrine (`styles.css`)
```css
/* Badge Têxtil de Vídeo no Card da Vitrine (Anti-Pílula) */
.product-badge-video {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  background: var(--media-badge-bg);
  color: var(--media-badge-text);
  border: var(--media-badge-border);
  border-radius: var(--radius-xs); /* 6px retangular de etiqueta */
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.product-badge-video svg {
  color: var(--color-accent);
  flex-shrink: 0;
}

.product-card:hover .product-badge-video {
  border-color: var(--color-accent);
  transform: translateY(-1px);
}
```

### 4.3. Estilos de Miniatura de Vídeo no Quick View (`styles.css`)
```css
/* Miniatura com Indicador de Vídeo na Galeria */
.modal-thumb.is-video {
  position: relative;
}

.modal-thumb.is-video::after {
  content: '';
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  background-color: var(--media-badge-bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FEBF97' stroke='%23FEBF97' stroke-width='2'%3E%3Cpolygon points='8 5 19 12 8 19 8 5'/%3E%3C/svg%3E");
  background-size: 8px 8px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 2px;
  border: 1px solid rgba(254, 191, 151, 0.6);
  pointer-events: none;
}

.modal-thumb.is-video.active::after {
  background-color: var(--color-primary);
  border-color: var(--color-bg-light);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F5ECB7' stroke='%23F5ECB7' stroke-width='2'%3E%3Cpolygon points='8 5 19 12 8 19 8 5'/%3E%3C/svg%3E");
}
```

### 4.4. Estilos do Player de Vídeo em Loop no Quick View
```css
/* Vídeo em Loop no Modal de Detalhes */
.modal-video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-md);
  background-color: var(--color-dark);
}

/* Botão de Controle Suave de Reprodução / Pausa */
.modal-video-toggle-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-xs);
  background: var(--color-dark-glass);
  border: 1px dashed rgba(254, 191, 151, 0.45);
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all var(--transition-fast);
}

.modal-video-toggle-btn:hover {
  background: var(--color-dark);
  border-color: var(--color-primary);
  color: var(--color-bg-light);
  transform: scale(1.05);
}
```

---

## 5. Checklist de Quality Gate de Arte de Ariel (Para Lumi e Cris)

Antes de homologar qualquer código ou tela da galeria mista, verificar:

- [ ] **Zero Emojis:** Nenhum caractere Unicode de vídeo (ex: 🎬, 📹, ▶️, 🎥) em nenhuma tag, botão, alerta ou miniatura.
- [ ] **Zero Pills:** As tags de vídeo não possuem formato oval de pílula nem sombras genéricas flutuantes de templates SaaS.
- [ ] **Etiquetas de Ateliê Têxtil:** Os selos de vídeo utilizam cantos discretos (`radius-xs`), borda pespontada (`dashed`) e tipografia autoral.
- [ ] **Ícones Monocromáticos Coerentes:** Todos os ícones de play e loop utilizam os SVGs oficiais monocromáticos com `currentColor`.
- [ ] **Comportamento Muted/Loop:** Os vídeos são exibidos sem áudio (`muted`), contínuos (`loop`), sem controles invasivos do navegador.
- [ ] **Performance & Textura:** Os vídeos destacam o relevo das linhas de crochê e transmitem a sensação tátil autêntica do ateliê da Jéssica Regina.
