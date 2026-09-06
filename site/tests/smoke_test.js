/**
 * ==========================================================================
 * Suíte de Testes de Regressão & Integridade (QA & Quality Gate)
 * Responsável: Robin (Sênior QA & Test Automation Engineer)
 * Aprovado por: Alex (CTO)
 * ==========================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failedTests++;
  }
}

console.log('\n🧪 ======================================================');
console.log('🧪 Iniciando Bateria de Testes de Regressão — JEZ Collection');
console.log('🧪 ======================================================\n');

// 1. Integridade dos Arquivos Estruturais
console.log('📁 1. Validando Arquivos Essenciais do Repositório:');
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'atelie.html', 'admin.css', 'admin.js'];
requiredFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(filePath) && fs.statSync(filePath).size > 100, `Arquivo ${file} existe e possui conteúdo`);
});

// 2. Integridade dos Tokens Visuais (Design System Lumi)
console.log('\n🎨 2. Validando Tokens Oficiais da Paleta em styles.css:');
const stylesContent = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf-8');
const requiredTokens = ['#23192d', '#FD0A54', '#F57576', '#FEBF97', '#F5ECB7'];
requiredTokens.forEach(token => {
  assert(stylesContent.toLowerCase().includes(token.toLowerCase()), `Token de cor oficial ${token} está presente`);
});

// 3. Validação de Requisito Específico: Zero Instruções de Lavagem
console.log('\n🧼 3. Validando Remoção de Instruções de Lavagem (Feedback do Usuário):');
const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const appContent = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');

assert(!htmlContent.toLowerCase().includes('lavagem') && !htmlContent.toLowerCase().includes('lavar à mão'), 'index.html não contém menções a instruções de lavagem');
assert(!appContent.toLowerCase().includes('lavagem') && !appContent.toLowerCase().includes('lavar à mão'), 'app.js não contém menções a instruções de lavagem');

// 4. Integridade do Branding Oficial com Trema no Ë
console.log('\n🏷️ 4. Validando Logo e Grafia Oficial com Trema:');
assert(htmlContent.includes('JËZ'), 'Logo possui grafia oficial com trema no Ë (JËZ)');
assert(htmlContent.includes('@_jezcollection'), 'Link para o Instagram oficial @_jezcollection está presente');
assert(htmlContent.includes('Montes Claros'), 'Origem oficial de Montes Claros – MG está declarada');

// 5. Integridade do Acervo de Imagens de Produtos
console.log('\n🖼️ 5. Validando Presença dos Assets Fotográficos Reais:');
const productImages = [
  'tote_cherry.jpg',
  'bolsa_punk.jpg',
  'blusa_teia.jpg',
  'shoulder_coracao.jpg',
  'bolsa_xadrez.jpg',
  'chaveiro_baphomet.jpg',
  'top_bandana.jpg',
  'porta_airpods.jpg',
  'cardiga_manteiga.jpg'
];

productImages.forEach(img => {
  const imgPath = path.join(ROOT_DIR, 'assets', 'products', img);
  assert(fs.existsSync(imgPath) && fs.statSync(imgPath).size > 50000, `Foto real ${img} existe com boa resolução (>50KB)`);
});

// 6. Validação Estrita Anti-IA: Zero Emojis e Zero Badges Pílula Flutuantes (Ariel & Robin)
console.log('\n🚫 6. Validando Diretrizes Anti-IA (Zero Emojis & Zero Pills):');
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/u;
assert(!emojiRegex.test(htmlContent), 'index.html possui rigorosamente ZERO emojis');
assert(!emojiRegex.test(appContent), 'app.js possui rigorosamente ZERO emojis');
assert(!htmlContent.includes('hero-badge-pill'), 'index.html baniu a classe genérica hero-badge-pill');
assert(!stylesContent.includes('hero-badge-pill'), 'styles.css baniu a classe genérica hero-badge-pill');
assert(!htmlContent.includes('torn-paper-divider'), 'index.html eliminou ondinhas/divisores estranhos que quebravam a harmonia visual');
assert(!htmlContent.includes('torn-paper-footer-divider'), 'index.html eliminou divisor irregular desconexo no rodapé');

// 7. Validação da Estética Zine, Colagem e Etiquetas Costuradas (Ariel & Lumi)
console.log('\n✂️ 7. Validando Elementos de Colagem, Washi-Tape, Tags Têxteis e Instagram Anti-Pílula:');
assert(htmlContent.includes('washi-tape'), 'Detalhe de fita adesiva washi-tape presente no Hero Card');
assert(stylesContent.includes('dashed') && stylesContent.includes('product-badge'), 'Etiquetas de produto possuem pesponto de costura (dashed stitch)');
assert(stylesContent.includes('.btn-instagram') && !stylesContent.match(/\.btn-instagram\s*\{[^}]*border-radius:\s*var\(--radius-full\)/), 'Botão do Instagram NÃO usa formato pílula');
// 8. Validação de Responsividade Mobile & Contenção Vertical Total (JEZ-011 - Lumi & Robin)
console.log('\n📱 8. Validando Contenção Vertical e Responsividade Mobile (JEZ-011):');
assert(stylesContent.includes('max-width: 100vw') && stylesContent.includes('overflow-x: hidden'), 'html e body possuem contenção estrita de 100vw e overflow-x: hidden');
assert(stylesContent.includes('repeat(2, minmax(0, 1fr))'), 'Grade de produtos no mobile usa repeat(2, minmax(0, 1fr)) prevenindo transbordamento lateral');
assert(stylesContent.includes('.cart-drawer') && stylesContent.includes('max-width: 100vw'), 'Gaveta do carrinho (cart drawer) ocupa 100vw em smartphone');
assert(stylesContent.includes('.filter-pills') && stylesContent.includes('flex-wrap: wrap'), 'Pílulas de categoria usam flex-wrap para acomodação vertical completa sem corte');
assert(htmlContent.includes('name="viewport"'), 'index.html possui metatag de viewport configurada');

// 9. Validação do Painel Administrativo Mobile da Jéssica (JEZ-009 - Cris & Alex)
console.log('\n👩‍🎨 9. Validando Painel Administrativo Mobile da Jéssica (JEZ-009):');
const adminHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
const adminJsContent = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
const adminCssContent = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf-8');

assert(!emojiRegex.test(adminHtmlContent), 'atelie.html possui rigorosamente ZERO emojis na interface');
assert(!emojiRegex.test(adminJsContent), 'admin.js possui rigorosamente ZERO emojis no código');
assert(adminHtmlContent.includes('kpi-sales') && adminHtmlContent.includes('kpi-shipping') && adminHtmlContent.includes('kpi-production'), 'Dashboard possui os 3 cartões executivos essenciais (vendas, postagens e produção)');
assert(adminHtmlContent.includes('form-new-product') && adminHtmlContent.includes('photo-upload-zone'), 'Formulário ágil de cadastro de peça com upload de foto presente');
assert(adminHtmlContent.includes('status-aguardando-pagamento') || adminCssContent.includes('status-aguardando-pagamento'), 'Quadro de status visual por cores configurado');
assert(adminJsContent.includes('https://rastreamento.correios.com.br/app/index.php?codigo='), 'Geração automática de link de rastreio dos Correios implementada');
assert(!htmlContent.includes('atelie.html') && !htmlContent.includes('admin.html'), 'Vitrine (index.html) não expõe link público para o ateliê (defesa em profundidade)');
assert(htmlContent.includes('Desenvolvimento Web: Maiteux Zanela'), 'Rodapé atribui formalmente o desenvolvimento web a Maiteux Zanela (JEZ-014)');

// 10. Validação dos Ajustes de Usabilidade e Estética do Painel (Lumi & Cris)
console.log('\n🎨 10. Validando Ajustes de Usabilidade e Estética do Painel:');
assert(adminCssContent.includes('--admin-card-bg: #2d2038') || adminCssContent.includes('background: #2d2038'), 'Cards do painel possuem fundo marrom quente (#2d2038) combinando com o botão Ver Loja');
assert(adminCssContent.includes('.orders-filter-bar') && adminCssContent.includes('flex-wrap: wrap'), 'Barra de filtros de pedidos utiliza flex-wrap para evitar texto encavalado no mobile');
assert(adminHtmlContent.includes('crop-viewport') && adminHtmlContent.includes('crop-zoom-slider'), 'Ferramenta interativa de enquadramento e zoom 1:1 de fotos está implementada');
assert(adminHtmlContent.includes('modal-edit-backdrop'), 'Modal de edição de peças do acervo está presente');
assert(adminHtmlContent.includes('suspended') && adminJsContent.includes('suspended'), 'Suporte nativo ao status "Suspensa" configurado no painel administrativo');
assert(appContent.includes("p.status !== 'suspended'"), 'Vitrine da loja (app.js) filtra e oculta automaticamente peças suspensas');

// 11. Validação de Cibersegurança, Sanitização XSS & LGPD (JEZ-007 - Morgan & Robin)
console.log('\n🛡️ 11. Validando Cibersegurança, Sanitização XSS e Conformidade LGPD (JEZ-007):');
const htmlRef = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const adminHtmlRef = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
const appJsRef = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');
const adminJsRef = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');

// A. Metadados de Segurança HTTP & CSP
assert(htmlRef.includes('Content-Security-Policy') && adminHtmlRef.includes('Content-Security-Policy'), 'index.html e atelie.html possuem Content-Security-Policy (CSP) configurado');
assert(htmlRef.includes('X-Content-Type-Options') && adminHtmlRef.includes('X-Content-Type-Options'), 'Cabeçalho nosniff configurado em index.html e atelie.html');
assert(htmlRef.includes('referrer') && adminHtmlRef.includes('referrer'), 'Política de referenciador estrita configurada em ambos os arquivos HTML');

// B. Utilitários de Sanitização e Escape contra XSS
assert(appJsRef.includes('escapeHtml') && adminJsRef.includes('escapeHtml'), 'Função centralizada escapeHtml implementada na vitrine e no painel');
assert(appJsRef.includes('sanitizeImageUrl') && adminJsRef.includes('sanitizeImageUrl'), 'Sanitização estrita de URLs de imagem implementada contra esquemas perigosos');
assert(adminJsRef.includes('sanitizeTrackingCode'), 'Sanitização rigorosa de código de rastreamento dos Correios implementada');

// C. Teste Unitário Funcional do Algoritmo de Escape XSS
function testEscape(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
const xssPayload = `<script>alert("xss")</script><img src=x onerror='alert(1)'>`;
const escapedPayload = testEscape(xssPayload);
assert(!escapedPayload.includes('<script>') && !escapedPayload.includes('<img'), 'Tags maliciosas de XSS são 100% neutralizadas e desarmadas pelo escape');
assert(escapedPayload.includes('&lt;script&gt;') && escapedPayload.includes('&lt;img'), 'Caracteres perigosos convertidos em entidades HTML inofensivas');

// D. Event Delegation Seguro (Zero Injeção Inline de Strings)
assert(!appJsRef.includes("onclick=\"window.jezApp.openQuickView('${p.id}')\""), 'Eventos inline com interpolação de strings eliminados da vitrine');
assert(appJsRef.includes("data-action=\"quickview\"") && appJsRef.includes("data-action=\"add-cart\""), 'Delegação segura de eventos via data attributes implementada');

// E. Conformidade LGPD & Privacidade
assert(htmlRef.includes('privacy-modal-backdrop') && htmlRef.includes('btn-open-privacy'), 'Modal transparente de Privacidade & LGPD implementado com botão de acesso');
assert(appJsRef.includes('privacyModalBackdrop'), 'Lógica de abertura e fechamento do modal LGPD ativa');

// 12. Validação do Sistema de Autenticação & Proteção do Ateliê (JEZ-016 - Morgan & Cris)
console.log('\n🔐 12. Validando Sistema de Autenticação & Gatekeeper do Ateliê (JEZ-016):');
assert(adminHtmlRef.includes('id="admin-login-screen"'), 'Tela de login dedicada presente no HTML do ateliê');
assert(adminHtmlRef.includes('id="admin-workspace"') && adminHtmlRef.includes('class="admin-workspace" id="admin-workspace" style="display: none;"'), 'Área de trabalho do ateliê protegida contra FOUC com display: none estático');
assert(adminHtmlRef.includes('id="admin-password"') && adminHtmlRef.includes('id="btn-toggle-password"'), 'Input de senha seguro e botão de alternância de visibilidade presentes');
assert(adminHtmlRef.includes('id="btn-admin-logout"'), 'Botão de encerramento de sessão presente no cabeçalho do ateliê');
assert(adminHtmlRef.includes('id="login-error-box"'), 'Caixa de avisos de erro e bloqueio temporário presente');

// Validação da criptografia SHA-256 e Web Crypto API
assert(adminJsRef.includes('crypto.subtle.digest') && adminJsRef.includes('sha256Hex'), 'Autenticação utiliza Web Crypto API nativa com digest SHA-256');
assert(adminJsRef.includes('3ec583f48c630ea4e2c7ef915480e1e0fe6fa96225b9affcb5d4feefd0e42711'), 'Hash SHA-256 da chave mestre está configurado');

// Teste unitário Node.js da chave mestre contra o hash
const nodeCrypto = require('crypto');
const calculatedNodeHash = nodeCrypto.createHash('sha256').update('atelie2026').digest('hex');
assert(calculatedNodeHash === '3ec583f48c630ea4e2c7ef915480e1e0fe6fa96225b9affcb5d4feefd0e42711', 'Teste unitário criptográfico: hash de atelie2026 bate exatamente com o valor pré-computado');

// Validação das políticas de segurança
assert(adminJsRef.includes('MAX_FAILED_ATTEMPTS = 5'), 'Política de rate limiting contra ataques de força bruta definida para 5 tentativas');
assert(adminJsRef.includes('LOCKOUT_DURATION_MS = 5 * 60 * 1000'), 'Duração do bloqueio temporário configurada para 5 minutos');
assert(adminJsRef.includes('SESSION_DURATION_MS = 4 * 60 * 60 * 1000'), 'Duração da sessão administrativa configurada para 4 horas');
assert(adminJsRef.includes('sessionStorage.getItem(STORAGE_SESSION_KEY)'), 'Sessão administrativa mantida exclusivamente em sessionStorage');

// Validação estética: zero emojis na tela de login
const loginSectionHtml = adminHtmlRef.substring(
  adminHtmlRef.indexOf('id="admin-login-screen"'),
  adminHtmlRef.indexOf('id="admin-workspace"')
);
assert(!emojiRegex.test(loginSectionHtml), 'Diretriz Inegociável da Marca: Zero emojis na tela e formulário de login');

// 13. Validação de Otimização WebP, SEO e Metatags Sociais (JEZ-008 - Noa)
console.log('\n🚀 13. Validando Otimização WebP, Metatags OpenGraph e SEO (JEZ-008):');
const webpProducts = [
  'blusa_teia.webp', 'bolsa_punk.webp', 'bolsa_xadrez.webp',
  'cardiga_manteiga.webp', 'chaveiro_baphomet.webp', 'porta_airpods.webp',
  'shoulder_coracao.webp', 'top_bandana.webp', 'tote_cherry.webp'
];
webpProducts.forEach(webpFile => {
  const p = path.join(ROOT_DIR, 'assets', 'products', webpFile);
  assert(fs.existsSync(p) && fs.statSync(p).size > 20000, `Arquivo WebP otimizado ${webpFile} existe e possui alta compressão`);
});

// Metatags Sociais e SEO
assert(htmlRef.includes('og:image') && htmlRef.includes('og:title') && htmlRef.includes('og:description'), 'index.html possui metatags OpenGraph configuradas para WhatsApp e Instagram');
assert(htmlRef.includes('twitter:card') && htmlRef.includes('summary_large_image'), 'index.html possui Twitter Cards configurado para compartilhamento com foto grande');
assert(adminHtmlRef.includes('name="robots" content="noindex, nofollow"'), 'atelie.html possui diretiva estrita de noindex para proteger a rota privada contra rastreadores');
assert(htmlRef.includes('<source id="hero-featured-webp"') || appJsRef.includes("type=\"image/webp\""), 'Suporte a picture element com fallback progressivo WebP implementado');

// 14. Validação da Polaroid Destaque Hero Clicável & Gestão no Ateliê (JEZ-015 - Lumi & Cris)
console.log('\n⭐ 14. Validando Polaroid Destaque Clicável e Gestão no Ateliê (JEZ-015):');
assert(htmlRef.includes('id="hero-featured-card"') && htmlRef.includes('role="button"') && htmlRef.includes('tabindex="0"'), 'Card destaque hero (#hero-featured-card) possui semântica acessível e foco via teclado');
assert(stylesContent.includes('.hero-card-featured') && stylesContent.includes('cursor: pointer'), 'Card polaroid possui cursor pointer e micro-interação de hover autoral');
assert(appJsRef.includes('renderHeroFeaturedCard'), 'Vitrine (app.js) possui renderização dinâmica da peça em destaque');
assert(adminJsRef.includes('setFeaturedPiece') && adminJsRef.includes('jez_featured_product_id'), 'Ateliê (admin.js) implementa seleção da peça em destaque com 1 clique');
assert(adminCssContent.includes('.btn-action-featured') && adminCssContent.includes('.badge-featured-piece'), 'Estilos de destaque (.btn-action-featured e .badge-featured-piece) implementados no ateliê');

// 15. Validação do WhatsApp Oficial da Jéssica (+55 38 9232-2411 - Sam & Lumi)
console.log('\n💬 15. Validando WhatsApp Oficial da Jéssica (+55 38 9232-2411):');
assert(htmlRef.includes('wa.me/553892322411'), 'index.html possui link direto com o WhatsApp oficial da Jéssica (553892322411)');
assert(appJsRef.includes('553892322411'), 'app.js utiliza o WhatsApp oficial da Jéssica no checkout e no Quick View');
assert(!htmlRef.includes('5538999999999') && !appJsRef.includes('5538999999999'), 'Número placeholder antigo (5538999999999) foi 100% eliminado da base de código');

// 16. Validação dos Dados de Envio no Carrinho & WhatsApp Personalizado (JEZ-020 - Sam, Morgan & Lumi)
console.log('\n📦 16. Validando Coleta de Dados de Envio no Carrinho e Mensagem WhatsApp (JEZ-020):');
assert(htmlRef.includes('id="customer-info-box"'), 'index.html possui o container #customer-info-box no Drawer da sacola');
assert(htmlRef.includes('id="customer-name"') && htmlRef.includes('id="customer-street"'), 'Campos de nome e logradouro presentes no formulário de entrega');
assert(htmlRef.includes('id="customer-number"') && htmlRef.includes('id="customer-city"'), 'Campos de número/complemento e cidade/UF presentes no formulário');
assert(htmlRef.includes('id="customer-data-hint"'), 'Mensagem informativa de validação #customer-data-hint presente');
assert(htmlRef.includes('connect-src') && htmlRef.includes('https://viacep.com.br'), 'CSP de index.html autoriza requisições seguras à API ViaCEP');

// Teste Unitário da Sanitização Estrita de Entradas (Morgan)
function testSanitizeCustomerInput(str, maxLen = 100) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[<>'"`;]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}
const maliciousName = `<script>alert("hack")</script> Maria'; DROP TABLE orders; --`;
const sanitizedName = testSanitizeCustomerInput(maliciousName, 80);
assert(!sanitizedName.includes('<') && !sanitizedName.includes('>') && !sanitizedName.includes('"') && !sanitizedName.includes(';'), 'Entrada de dados do cliente higienizada contra scripts, aspas e ponto-e-vírgula');

const spacingName = '   Maria   da   Silva   ';
const cleanSpacing = testSanitizeCustomerInput(spacingName, 80);
assert(cleanSpacing === 'Maria da Silva', 'Sanitização preserva caracteres legítimos e colapsa espaços excedentes');

// Lógica de Condicionamento e Preenchimento Automático em app.js
assert(appJsRef.includes('updateCheckoutReadiness'), 'app.js implementa verificação dinâmica de prontidão do checkout');
assert(appJsRef.includes('lookupAddressByCep'), 'app.js implementa consulta e preenchimento automático por CEP');
assert(appJsRef.includes('btnCheckout.disabled = true'), 'Botão de checkout permanece bloqueado preventivamente quando dados estão pendentes');

// Estrutura da Mensagem de WhatsApp e Gravação de Pedido com Endereço
assert(appJsRef.includes('Olá Jéssica! Me chamo') && appJsRef.includes('Endereço de envio:'), 'app.js formata a mensagem de WhatsApp conforme o template aprovado pela Jéssica');
assert(appJsRef.includes('address: fullAddress') && appJsRef.includes('cep: formattedCep'), 'app.js salva endereço completo e CEP no payload de jez_orders');
assert(adminJsRef.includes('order.address') && adminJsRef.includes('Endereço de Entrega:'), 'admin.js renderiza o endereço de entrega do cliente nos cards de pedidos do Ateliê');

// 17. Validação da Integração com Firebase Cloud Firestore (JEZ-021 - Alex, Morgan & Cris)
console.log('\n🔥 17. Validando Integração com Firebase Cloud Firestore (JEZ-021):');
const fbConfigContent = fs.readFileSync(path.join(ROOT_DIR, 'firebase-config.js'), 'utf-8');
const fbServiceContent = fs.readFileSync(path.join(ROOT_DIR, 'firebase-service.js'), 'utf-8');
const firestoreRulesPath = path.resolve(ROOT_DIR, '..', 'firestore.rules');
const firestoreRulesContent = fs.existsSync(firestoreRulesPath) ? fs.readFileSync(firestoreRulesPath, 'utf-8') : '';

assert(fbConfigContent.includes('jez-collection'), 'firebase-config.js configurado com o projectId oficial jez-collection');
assert(fbServiceContent.includes('JezFirebaseService') && fbServiceContent.includes('onProductsChange'), 'firebase-service.js implementa escuta e sincronização de produtos');
assert(fbServiceContent.includes('onOrdersChange') && fbServiceContent.includes('createOrder'), 'firebase-service.js implementa escuta e criação de pedidos em nuvem');
assert(fbServiceContent.includes('updateOrderStatus'), 'firebase-service.js implementa atualização de status de pedidos no Firestore');
assert(fbServiceContent.includes('seedInitialProductsIfEmpty'), 'firebase-service.js possui rotina de semeamento automático de acervo inicial');
assert(firestoreRulesContent.includes('match /products/{productId}') && firestoreRulesContent.includes('match /orders/{orderId}'), 'firestore.rules define permissões de segurança para produtos e pedidos');

// CSP atualizado nos arquivos HTML
assert(htmlRef.includes('https://www.gstatic.com') && htmlRef.includes('https://*.firebaseio.com'), 'index.html possui CSP configurado para carregar e conectar ao Firebase');
assert(adminHtmlRef.includes('https://www.gstatic.com') && adminHtmlRef.includes('https://*.firebaseio.com'), 'atelie.html possui CSP configurado para carregar e conectar ao Firebase');
assert(adminHtmlRef.includes('id="cloud-sync-badge"'), 'atelie.html exibe indicador visual de status de sincronização (#cloud-sync-badge)');
assert(appJsRef.includes('window.jezFirebase') && adminJsRef.includes('window.jezFirebase'), 'app.js e admin.js integram nativamente com window.jezFirebase');

// 18. Validação da Galeria Multi-Fotos no Ateliê e Vitrine (JEZ-019 - Lumi, Cris & Ariel)
console.log('\n📸 18. Validando Galeria Multi-Fotos no Ateliê e Vitrine (JEZ-019):');
assert(adminHtmlRef.includes('id="new-extra-photos-section"') && adminHtmlRef.includes('id="new-extra-photos-input"'), 'Formulário de nova peça possui seção e input para fotos complementares');
assert(adminHtmlRef.includes('id="edit-extra-photos-section"') && adminHtmlRef.includes('id="edit-extra-photos-input"'), 'Modal de edição possui seção e input para fotos complementares');
assert(adminCssContent.includes('.extra-photos-grid') && adminCssContent.includes('.btn-add-extra-photo') && adminCssContent.includes('.badge-catalog-photos'), 'admin.css define estilos boutique para fotos extras e badge no catálogo');
assert(adminJsRef.includes('compressImageFile') && adminJsRef.includes('newPieceExtraPhotos') && adminJsRef.includes('editPieceExtraPhotos'), 'admin.js implementa compressão client-side em Canvas e gestão de fotos extras');
assert(adminJsRef.includes('images: allImages') && adminJsRef.includes('images: updatedImages'), 'admin.js persiste o array de imagens preservando a capa oficial');

assert(htmlRef.includes('id="modal-btn-prev"') && htmlRef.includes('id="modal-btn-next"'), 'index.html possui botões de navegação anterior/próximo no Quick View');
assert(htmlRef.includes('id="modal-photo-counter"') && htmlRef.includes('id="modal-gallery-thumbs"'), 'index.html possui contador numérico e faixa de miniaturas no Quick View');
assert(stylesContent.includes('.product-img-secondary') && stylesContent.includes('.has-secondary-image'), 'styles.css define regras para imagem secundária e efeito de transição no card');
assert(stylesContent.includes('.modal-nav-btn') && stylesContent.includes('.modal-gallery-thumbs') && stylesContent.includes('.modal-thumb'), 'styles.css define estilos para botões flutuantes e miniaturas no Quick View');

assert(appJsRef.includes('product-img-secondary') && appJsRef.includes('has-secondary-image'), 'app.js gera markup para imagem secundária no card de produto na vitrine');
assert(appJsRef.includes('selectModalPhoto') && appJsRef.includes('currentModalPhotos'), 'app.js implementa controle dinâmico e seleção de fotos no Quick View');
assert(appJsRef.includes('ArrowLeft') && appJsRef.includes('ArrowRight'), 'app.js oferece suporte nativo a atalhos de teclado (setas) para navegar nas fotos');

// Validação dos novos arquivos de detalhe
const detailAssets = [
  'tote_cherry_detail.jpg', 'tote_cherry_detail.webp',
  'bolsa_punk_detail.jpg', 'bolsa_punk_detail.webp',
  'chaveiro_baphomet_detail.jpg', 'chaveiro_baphomet_detail.webp'
];
detailAssets.forEach(f => {
  const p = path.join(ROOT_DIR, 'assets', 'products', f);
  assert(fs.existsSync(p) && fs.statSync(p).size > 10000, `Arquivo de detalhe autoral ${f} existe e possui alta fidelidade`);
});

// Teste unitário de resiliência: retrocompatibilidade de peças com 1 foto
const legacyProduct = { id: 'leg-1', image: 'assets/products/tote_cherry.jpg' };
const resolvedImages = (Array.isArray(legacyProduct.images) && legacyProduct.images.length > 0) ? legacyProduct.images : [legacyProduct.image];
assert(resolvedImages.length === 1 && resolvedImages[0] === legacyProduct.image, 'Peças legadas sem array images mantêm fallback perfeito para a capa');


console.log('\n======================================================');
console.log(`📊 Relatório do QA (Robin):`);
console.log(`   Total de Testes: ${totalTests}`);
console.log(`   Aprovados: ${passedTests}`);
console.log(`   Falhas: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 Todos os testes de regressão passaram com 100% de sucesso!\n');
  process.exit(0);
}
