# Arquitetura de Performance, Quotas e Lazy Loading de Vídeo — JEZ-032

> **Autoria:** Noa (Especialista em Performance Web & SEO)  
> **Para:** Alex (CTO), Lumi (UI/UX Boutique), Cris (Merchant & Ateliê), Ariel (Direção de Arte)  
> **Status:** Homologado & Ativo  
> **Diretrizes Técnicas:** LCP < 2.0s | CLS < 0.1 | Salvaguarda de Cota Spark (1 GB/dia) | Zero Emojis  

---

## 1. Contexto e O Desafio das Cotas do Firebase Storage

O projeto **JEZ Collection** utiliza a infraestrutura em nuvem do Google Firebase no **Plano Spark (Gratuito)**.  
Neste plano, os limites operacionais estritos para o Firebase Storage são:

* **Armazenamento Total:** 5 GB
* **Download Diário (Egress / Bandwidth Transfer):** **1 GB / dia (1.024 MB)**
* **Operações de Download:** 50.000 / dia
* **Operações de Upload:** 20.000 / dia

### O Risco Crítico de Exaustão de Cota (Egress Disaster):
Se um único vídeo de produto tiver 12 MB e for carregado automaticamente na vitrine ou baixado na íntegra por cada visitante:
- Menos de 85 visualizações da página consumiriam **100% da cota diária de 1 GB**.
- Uma vez estourada a cota, o Firebase Storage bloqueia downloads retornando erros HTTP 402/403, e **todas as imagens e mídias do acervo param de abrir para todas as clientes**, paralisando as vendas do ateliê.

Para viabilizar vídeos curtos autorais em loop sem estourar as cotas gratuitas, a arquitetura de entrega de mídia deve operar com rédeas curtas de performance, compressão e carregamento sob demanda (*lazy loading*).

---

## 2. Invariantes de Quota e Upload (Hard Limits)

1. **Limite Rígido de Tamanho de Arquivo (Hard Limit): 4 MB**
   - Nenhuma mídia de vídeo pode ser aceita no painel do Ateliê com tamanho superior a **4 MB (4.194.304 bytes)**.
   - O tamanho recomendado para a Jéssica Regina é entre **1.5 MB e 3.0 MB**.
   - O validador client-side (`validateVideoUploadQuota`) bloqueia arquivos maiores antes mesmo de iniciar o upload para o Storage.

2. **Duração Máxima Recomendada: 6 a 15 Segundos**
   - Vídeos curtos em loop devem retratar o relevo, a textura do ponto e o movimento da peça artesanal.
   - Duração superior a 15 segundos eleva o bitrate e o peso em MB sem agregação de valor tátil.

3. **Formatos Homologados: MP4 (H.264 / AAC) e WebM**
   - O formato padrão obrigatório é `video/mp4` com codec H.264, por possuir compatibilidade de 100% em Safari iOS, Chrome Android, Firefox e navegadores de desktop.
   - O arquivo de vídeo deve ser exportado **sem canal de áudio (silencioso)** ou com áudio desabilitado, economizando até 25% de bitrate.

---

## 3. Estratégia de Carregamento Sob Demanda (Lazy Loading & Streaming Eficiente)

### 3.1. Vitrine Geral (`index.html` e Card de Produto)
* **Regra:** Vídeos **NUNCA** são baixados automaticamente na listagem do catálogo.
* **Comportamento:** O card de produto na vitrine exibe exclusivamente a **imagem estática de capa (Poster WebP/JPEG)**.
* **Diferenciação Visual:** O card recebe a etiqueta têxtil pespontada autoral desenhada por Ariel (`.product-badge-video`) indicando presença de vídeo em loop.
* **Economia de Banda:** A visitação da vitrine consome exatamente a mesma cota leve de imagens (WebP de ~30KB), mantendo o **Largest Contentful Paint (LCP) < 1.5s** em conexões 4G.

### 3.2. Modal de Detalhes (Quick View)
* **Regra:** O vídeo só é instanciado quando o usuário clica na peça e seleciona o item de vídeo.
* **Atributos Obrigatórios do HTML5 `<video>`:**
  ```html
  <video
    class="modal-video-element"
    autoplay
    loop
    muted
    playsinline
    preload="metadata"
    poster="assets/products/tote_cherry.jpg"
    aria-label="Vídeo em loop dos detalhes da peça"
    width="400"
    height="400">
    <source src="URL_DO_VIDEO.mp4" type="video/mp4">
    Seu navegador não suporta reprodução de vídeos HTML5.
  </video>
  ```
* **Significado de Cada Atributo:**
  - `preload="metadata"`: Instrução mandatória para o navegador baixar **apenas os primeiros bytes** (cabeçalhos de dimensões, codec e primeiro frame, ~3KB a 8KB). O stream de vídeo só progride se a mídia permanecer ativa na tela. Se a visitante fechar o modal em 1 segundo, o vídeo não é descarregado por completo, poupando a cota do Firebase.
  - `autoplay`: Inicia a reprodução contínua ao ser exibido.
  - `loop`: Cria o ciclo suave e hipnótico da peça em movimento contínuo.
  - `muted`: Requisito obrigatório dos navegadores modernos (Safari iOS e Chromium) para autorizar autoplay sem clique prévio de mídia.
  - `playsinline`: **Essencial para iOS Safari**. Impede que o iPhone force abertura em player de tela cheia nativo, mantendo a experiência integrada dentro da janela boutique do Quick View.
  - `poster`: Imagem estática de alta fidelidade que é exibida instantaneamente enquanto os frames do vídeo são decodificados, garantindo sensação de velocidade imediata.

---

## 4. Prevenção Rígida de Layout Shift (CLS < 0.1)

O **Cumulative Layout Shift (CLS)** é uma das métricas mais críticas do Google Core Web Vitals. Quando um elemento de vídeo é inserido sem dimensões travadas, o layout da página salta abruptamente ao decodificar a proporção do vídeo, irritando a usuária e penalizando o SEO da loja.

### Salvaguardas Implementadas:
1. **Aspect Ratio Rígido 1:1:**
   O container `.modal-img-wrap` e a classe `.modal-video-element` utilizam obrigatoriamente:
   ```css
   aspect-ratio: 1 / 1;
   width: 100%;
   height: 100%;
   object-fit: cover;
   ```
2. **Coexistência Poster e Vídeo:**
   O poster possui exatamente a mesma resolução e proporção quadrada (1:1) do container. A transição entre o poster estático e o primeiro frame do vídeo ocorre sem qualquer deslocamento de pixel.
3. **Dimensões Explícitas nos Atributos HTML:**
   O elemento `<video>` e a tag `<img>` de poster carregam atributos numéricos `width="400"` e `height="400"`, informando a proporção exata à engine de renderização antes do download dos estilos.

---

## 5. Limpeza de Recursos e Prevenção de Vazamento de Banda (Bandwidth Leak Prevention)

Quando o usuário alterna entre as fotos da galeria ou fecha o modal Quick View:
1. **Pausa Imediata:** Todo `<video>` ativo deve receber `video.pause()`.
2. **Interrupção de Buffer:** O elemento de vídeo deve ter seu `src` resetado ou desanexado caso o modal seja encerrado, evitando que o navegador continue consumindo requisições HTTP Range de chunks subsequentes do Firebase Storage em background.
3. **Respeito à Acessibilidade e Redução de Movimento:**
   Se a cliente tiver ativada a preferência do sistema operacional para redução de movimento (`prefers-reduced-motion: reduce`), o autoplay automático é desativado por padrão, exibindo o poster e disponibilizando o botão de play manual.

---

## 6. Módulo Centralizador de Performance: `media-performance.js`

Para que Lumi (em `t3`) e Cris (em `t4`) não precisem reimplementar regras de validação ou markup duplicado, o arquivo `site/js/services/media-performance.js` centraliza:

* `MAX_VIDEO_FILE_SIZE_BYTES` (4 MB)
* `RECOMMENDED_MAX_DURATION_SECONDS` (15 segundos)
* `isVideoUrl(url)`: detecção robusta de extensão (`.mp4`, `.webm`, `.mov`), data URLs e objetos de mídia.
* `normalizeMediaItem(item, fallbackPoster)`: normalização homogênea de strings legadas e novos objetos de mídia mista.
* `validateVideoUploadQuota(file)`: validação preventiva de tamanho e tipo MIME.
* `createOptimizedVideoMarkup(options)`: gerador do HTML5 semântico com todos os atributos obrigatórios de performance.
* `cleanupVideoPlayback(videoElement)`: rotina segura de pausa e desacoplamento de stream.
* `shouldAutoplayMotion()`: verificação de `prefers-reduced-motion`.

---

## 7. Checklist de Homologação de Performance (Quality Gate Noa)

- [ ] Arquivo `media-performance.js` compila com `node -c` e possui zero erros sintáticos.
- [ ] Validador client-side rejeita qualquer vídeo com tamanho > 4 MB.
- [ ] A vitrine pública não carrega arquivos `.mp4` antes de interação explícita do usuário.
- [ ] Elemento de vídeo no Quick View inclui rigorosamente: `autoplay`, `loop`, `muted`, `playsinline`, `preload="metadata"`, `poster` e `aspect-ratio: 1/1`.
- [ ] Ao fechar o Quick View ou alternar de foto, a reprodução de vídeo é pausada e descarregada.
- [ ] Zero emojis em código, markup, logs ou comentários.
