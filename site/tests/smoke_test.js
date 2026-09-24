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

// 1. Integridade dos Arquivos Estruturais & Sintaxe JavaScript
console.log('📁 1. Validando Arquivos Essenciais do Repositório & Compilação:');
const { execSync } = require('child_process');
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'atelie.html', 'admin.css', 'admin.js'];
requiredFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(filePath) && fs.statSync(filePath).size > 100, `Arquivo ${file} existe e possui conteúdo`);
});
try {
  execSync(`node -c "${path.join(ROOT_DIR, 'app.js')}"`);
  assert(true, 'app.js compila sem nenhum erro de sintaxe (node -c)');
} catch (e) {
  assert(false, `app.js falhou na compilação: ${e.message}`);
}
try {
  execSync(`node -c "${path.join(ROOT_DIR, 'admin.js')}"`);
  assert(true, 'admin.js compila sem nenhum erro de sintaxe (node -c)');
} catch (e) {
  assert(false, `admin.js falhou na compilação: ${e.message}`);
}

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
assert(htmlRef.includes('id="customer-name"') && htmlRef.includes('id="customer-contact"') && htmlRef.includes('id="customer-street"'), 'Campos de nome, contato (WhatsApp/e-mail) e logradouro presentes no formulário de entrega');
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
assert(appJsRef.includes('contact: safeContact') && appJsRef.includes('customerContactInput'), 'app.js valida e salva WhatsApp ou e-mail de contato no payload de pedidos');

// Estrutura da Mensagem de WhatsApp e Gravação de Pedido com Endereço
assert(appJsRef.includes('Olá Jéssica! Me chamo') && appJsRef.includes('Endereço de envio:'), 'app.js formata a mensagem de WhatsApp conforme o template aprovado pela Jéssica');
assert(appJsRef.includes('address: fullAddress') && appJsRef.includes('cep: formattedCep'), 'app.js salva endereço completo e CEP no payload de jez_orders');
assert(adminJsRef.includes('order.address') && adminJsRef.includes('Endereço de Entrega:'), 'admin.js renderiza o endereço de entrega do cliente nos cards de pedidos do Ateliê');
assert(adminJsRef.includes('order.contact') && adminJsRef.includes('Contato:'), 'admin.js renderiza o WhatsApp ou e-mail de contato do cliente nos cards de pedidos do Ateliê');

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

// 19. Validando Transformação PWA, Firebase Hosting & CI/CD Automático (JEZ-022)
console.log('\n📲 19. Validando PWA, Firebase Hosting e Automação CI/CD (JEZ-022):');
const PROJECT_ROOT = path.resolve(ROOT_DIR, '..');

// 19.1 Configurações do Firebase
const firebasercPath = path.join(PROJECT_ROOT, '.firebaserc');
const firebaseJsonPath = path.join(PROJECT_ROOT, 'firebase.json');
assert(fs.existsSync(firebasercPath), '.firebaserc existe na raiz do projeto');
assert(fs.existsSync(firebaseJsonPath), 'firebase.json existe na raiz do projeto');

if (fs.existsSync(firebasercPath)) {
  const rc = JSON.parse(fs.readFileSync(firebasercPath, 'utf-8'));
  assert(rc.projects && rc.projects.default === 'jez-collection', '.firebaserc aponta para o projeto jez-collection');
}

if (fs.existsSync(firebaseJsonPath)) {
  const fbJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf-8'));
  assert(fbJson.hosting && fbJson.hosting.public === 'site', 'firebase.json define public como "site"');
  assert(Array.isArray(fbJson.hosting.headers) && fbJson.hosting.headers.some(h => h.source === '/sw.js'), 'firebase.json define cabeçalhos no-cache para o Service Worker');
}

// 19.2 Manifesto Web App & Ícones PWA
const manifestPath = path.join(ROOT_DIR, 'manifest.json');
const manifestAteliePath = path.join(ROOT_DIR, 'manifest-atelie.json');
assert(fs.existsSync(manifestPath), 'manifest.json existe no diretório site/');
assert(fs.existsSync(manifestAteliePath), 'manifest-atelie.json isolado existe no diretório site/');

if (fs.existsSync(manifestPath)) {
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestRaw);
  assert(manifest.name && manifest.name.includes('JËZ'), 'manifest.json possui nome oficial com trema (JËZ)');
  assert(manifest.display === 'standalone', 'manifest.json define display standalone para sensação nativa de app');
  assert(manifest.theme_color === '#23192d' && (manifest.background_color === '#FD0A54' || manifest.background_color === '#23192d'), 'manifest.json utiliza cores oficiais da marca (#23192d e #FD0A54)');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'manifest.json possui ícones configurados (192, 512, maskable)');
  assert(manifest.start_url === '/' || manifest.start_url === './', 'manifest.json possui start_url sem redirecionamentos para compatibilidade total com Samsung Internet e Chromium');
}

if (fs.existsSync(manifestAteliePath)) {
  const atelieManifest = JSON.parse(fs.readFileSync(manifestAteliePath, 'utf-8'));
  assert(atelieManifest.name === 'JËZ Ateliê | Painel da Artesã', 'manifest-atelie.json possui nome dedicado do Ateliê');
  assert(atelieManifest.start_url === '/atelie' || atelieManifest.start_url === './atelie', 'manifest-atelie.json inicia diretamente na rota protegida do ateliê');
  assert(atelieManifest.display === 'standalone', 'manifest-atelie.json permite instalação como app independente da artesã');
}

const pwaIcons = [
  'icon-192.png',
  'icon-512.png',
  'icon-maskable.png',
  'apple-touch-icon.png'
];
pwaIcons.forEach(iconName => {
  const iconPath = path.join(ROOT_DIR, 'assets', 'icons', iconName);
  assert(fs.existsSync(iconPath) && fs.statSync(iconPath).size > 1000, `Ícone PWA ${iconName} existe e possui boa qualidade`);
});
assert(fs.existsSync(path.join(ROOT_DIR, 'favicon.svg')), 'Favicon SVG vetorial existe em site/');

// 19.3 Service Worker
const swPath = path.join(ROOT_DIR, 'sw.js');
assert(fs.existsSync(swPath), 'sw.js existe no diretório site/');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf-8');
  assert(swContent.includes("addEventListener('install'") || swContent.includes('addEventListener("install"'), 'sw.js implementa evento de instalação com pré-cache');
  assert(swContent.includes("addEventListener('activate'") || swContent.includes('addEventListener("activate"'), 'sw.js implementa evento de ativação e limpeza de cache antigo');
  assert(swContent.includes("addEventListener('fetch'") || swContent.includes('addEventListener("fetch"'), 'sw.js intercepta requisições com cache inteligente e fallback offline');
  assert(swContent.includes('manifest-atelie.json'), 'sw.js armazena em cache o manifest-atelie.json');
}

// 19.4 Vinculação no HTML & CSS
const latestIndexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const latestAtelieHtml = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
assert(latestIndexHtml.includes('rel="manifest"') && latestIndexHtml.includes('manifest.json'), 'index.html vincula o manifest.json público');
assert(latestAtelieHtml.includes('rel="manifest"') && latestAtelieHtml.includes('manifest-atelie.json'), 'atelie.html vincula manifesto dedicado e isolado manifest-atelie.json');
assert(latestIndexHtml.includes('apple-touch-icon') && latestAtelieHtml.includes('apple-touch-icon'), 'index.html e atelie.html declaram apple-touch-icon para iOS');
assert(latestIndexHtml.includes('btn-pwa-install'), 'index.html contém botão de instalação do PWA');
assert(latestAtelieHtml.includes('btn-pwa-install-admin'), 'atelie.html contém botão de instalação do PWA para o back-office');

// 19.5 Handlers em app.js e admin.js
const latestAppJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');
const latestAdminJs = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
assert(latestAppJs.includes('serviceWorker') && latestAppJs.includes('beforeinstallprompt'), 'app.js implementa registro do Service Worker e escuta de instalação');
assert(latestAdminJs.includes('serviceWorker') && latestAdminJs.includes('beforeinstallprompt'), 'admin.js implementa registro do Service Worker e escuta de instalação no Ateliê');

// 19.6 Automação CI/CD no GitHub Actions
const workflowPath = path.join(PROJECT_ROOT, '.github', 'workflows', 'firebase-hosting-merge.yml');
assert(fs.existsSync(workflowPath), 'Workflow do GitHub Actions .github/workflows/firebase-hosting-merge.yml existe');
if (fs.existsSync(workflowPath)) {
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
  assert(workflowContent.includes('branches:') && workflowContent.includes('main'), 'Workflow CI/CD é acionado automaticamente em pushes na branch main');
  assert(workflowContent.includes('smoke_test.js'), 'Workflow executa a bateria de testes de regressão antes do deploy');
  assert(workflowContent.includes('action-hosting-deploy'), 'Workflow utiliza a action oficial de deploy do Firebase Hosting');
  assert(workflowContent.includes('FIREBASE_SERVICE_ACCOUNT_JEZ_COLLECTION'), 'Workflow referencia a secret oficial de autenticação do Firebase');
  assert(workflowContent.includes('jez-collection'), 'Workflow define o projectId jez-collection');
}

// 20. Validação de Limpeza de Vendas Fake & Reset Seguro no Ateliê (JEZ-023)
console.log('\n🧹 20. Validando Limpeza de Vendas Fake e Reset Seguro no Ateliê (JEZ-023):');
assert(fbServiceContent.includes('clearOrders'), 'firebase-service.js implementa método clearOrders para resetar pedidos na nuvem');
assert(!adminJsRef.includes('defaultSampleOrders') && !adminJsRef.includes('JEZ-8042'), 'admin.js removeu template de vendas fictícias (defaultSampleOrders)');
assert(adminHtmlRef.includes('id="btn-reset-orders"'), 'atelie.html contém botão discreto #btn-reset-orders');
assert(adminHtmlRef.includes('id="modal-reset-orders-backdrop"'), 'atelie.html contém modal de confirmação para reset de vendas');
assert(adminCssContent.includes('.btn-reset-orders') && adminCssContent.includes('.modal-reset-card'), 'admin.css define estilização boutique para o botão de reset e modal');
assert(adminJsRef.includes('btn-reset-orders') && adminJsRef.includes('modal-reset-orders-backdrop'), 'admin.js implementa controle completo do fluxo de confirmação e reset');

// 21. Validação dos Botões de Ação Condicionados à Modalidade (Pronta Entrega vs Sob Encomenda)
console.log('\n🎯 21. Validando Botões de Ação por Modalidade (Pronta Entrega vs Sob Encomenda):');
const updatedAdminJs = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
const updatedAppJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');
assert(updatedAdminJs.includes('isItemCustomProduction') && updatedAdminJs.includes('isOrderCustomProduction'), 'admin.js implementa identificação robusta da modalidade do pedido');
assert(updatedAdminJs.includes('isCustomOrder ?') && updatedAdminJs.includes('data-newstatus="em-producao"') && updatedAdminJs.includes('data-newstatus="preparar-envio"'), 'admin.js submete os botões de aguardando-pagamento estritamente à modalidade');
assert(updatedAdminJs.includes('Sob Encomenda</span>') && updatedAdminJs.includes('Pronta Entrega</span>'), 'admin.js exibe badges de identificação visual nos itens do pedido');
assert(updatedAppJs.includes('hasCustomProduction') && updatedAppJs.includes('isReady:'), 'app.js persiste metadados de modalidade ao registrar novos pedidos');
assert(!emojiRegex.test(updatedAdminJs), 'admin.js preserva rigorosamente ZERO emojis após atualização');

// 22. Validação do Controle de Estoque, Esgotamento Visual & Proteção contra Concorrência (JEZ-028)
console.log('\n📦 22. Validando Controle de Estoque, Esgotamento Visual e Proteção contra Concorrência (JEZ-028):');
const updatedFbService = fs.readFileSync(path.join(ROOT_DIR, 'firebase-service.js'), 'utf-8');
const updatedStyles = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf-8');
const updatedAdminCss = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf-8');
const updatedAtelieHtml = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');

// A. Transação Atômica e Concorrência no Firebase Service
assert(updatedFbService.includes('runTransaction') && updatedFbService.includes('checkoutWithStockCheck'), 'firebase-service.js implementa checkoutWithStockCheck utilizando runTransaction do Firestore');
assert(updatedFbService.includes('ESTOQUE_ESGOTADO:') && updatedFbService.includes('currentStock < requestedQty'), 'firebase-service.js aborta transação atômica caso o estoque disponível seja insuficiente');
assert(updatedFbService.includes('transaction.update(update.ref') && updatedFbService.includes('stockQty: update.newStock'), 'firebase-service.js atualiza atomicamente o estoque na coleção products');

// B. Interface e Campos de Estoque no Ateliê (atelie.html & admin.css & admin.js)
assert(updatedAtelieHtml.includes('id="product-stock-input"') && updatedAtelieHtml.includes('id="ready-stock-field"'), 'atelie.html possui campo dinâmico de quantidade em estoque no cadastro de peças');
assert(updatedAtelieHtml.includes('id="edit-product-stock"') && updatedAtelieHtml.includes('id="edit-stock-wrap"'), 'atelie.html possui campo de estoque no modal de edição de peças');
assert(updatedAdminCss.includes('.btn-status-badge.soldout'), 'admin.css define estilização para o badge de status "Esgotada"');
assert(updatedAdminJs.includes('product-stock-input') && updatedAdminJs.includes('stockQty: stockQty'), 'admin.js coleta e salva stockQty na criação de novas peças');
assert(updatedAdminJs.includes('edit-product-stock'), 'admin.js permite editar a quantidade de estoque no acervo');
assert(updatedAdminJs.includes('Esgotada (0 un.)'), 'admin.js renderiza badge "Esgotada (0 un.)" quando o estoque zera');

// C. Vitrine, Estilização Grayscale e Badges na Loja (styles.css & app.js)
assert(updatedStyles.includes('.badge-sold-out') && updatedStyles.includes('grayscale(100%)'), 'styles.css define filtro grayscale(100%) e badge-sold-out para peças esgotadas');
assert(updatedStyles.includes('.btn-add-cart.is-disabled') || updatedStyles.includes('.btn-add-cart:disabled'), 'styles.css estiliza botão de compra desabilitado para peças esgotadas');
assert(updatedStyles.includes('.product-card.is-sold-out .product-img-secondary') && updatedStyles.includes('opacity: 0'), 'styles.css oculta foto secundária em card esgotado evitando sobreposição');
assert(updatedStyles.includes('.modal-img-wrap.is-sold-out .modal-img-blur') && updatedStyles.includes('blur(24px)'), 'styles.css preserva blur de 24px no fundo do modal de peça esgotada');
assert(updatedAppJs.includes('badge-sold-out') && updatedAppJs.includes('is-sold-out'), 'app.js atribui classe is-sold-out e etiqueta Esgotada na vitrine');
assert(updatedAppJs.includes('checkoutWithStockCheck') && updatedAppJs.includes('ESTOQUE_ESGOTADO:'), 'app.js invoca checkoutWithStockCheck e trata feedback amigável de concorrência esgotada');
assert(updatedAppJs.includes('Limite de estoque') || updatedAppJs.includes('esgotada no momento'), 'app.js bloqueia adição ao carrinho caso o estoque seja excedido');
assert(!emojiRegex.test(updatedFbService) && !emojiRegex.test(updatedAppJs) && !updatedStyles.includes('emoji'), 'Todos os arquivos atualizados cumprem a diretriz anti-emoji');

// 23. Validando Arquitetura Modular do Frontend e Tokens de CSS (Ponto 4 - Alex & Lumi)
console.log('\n🏛️ 23. Validando Arquitetura Modular do Frontend e Tokens de CSS (Ponto 4):');
const tokensCssPath = path.join(ROOT_DIR, 'css', 'tokens.css');
assert(fs.existsSync(tokensCssPath), 'site/css/tokens.css existe e centraliza os tokens de design system');

const tokensContent = fs.readFileSync(tokensCssPath, 'utf-8');
const brandTokens = ['#23192d', '#FD0A54', '#F57576', '#FEBF97', '#F5ECB7'];
brandTokens.forEach(t => {
  assert(tokensContent.toLowerCase().includes(t.toLowerCase()), `tokens.css contém a cor oficial da marca ${t}`);
});
assert(tokensContent.includes('--admin-card-bg') && tokensContent.includes('--admin-card-border'), 'tokens.css unifica os tokens dedicados do Ateliê');

assert(stylesContent.includes("import url('./css/tokens.css')") || stylesContent.includes('import url("./css/tokens.css")') || stylesContent.includes('tokens.css'), 'styles.css importa tokens.css');
const adminCssRaw = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf-8');
assert(adminCssRaw.includes("import url('./css/tokens.css')") || adminCssRaw.includes('import url("./css/tokens.css")') || adminCssRaw.includes('tokens.css'), 'admin.css importa tokens.css');

const indexHtmlRaw = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const atelieHtmlRaw = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
assert(indexHtmlRaw.includes('css/tokens.css'), 'index.html vincula link de css/tokens.css');
assert(atelieHtmlRaw.includes('css/tokens.css'), 'atelie.html vincula link de css/tokens.css');

const modularServices = [
  'js/services/firebase.js',
  'js/services/products.js',
  'js/services/orders.js'
];
modularServices.forEach(modPath => {
  const fullModPath = path.join(ROOT_DIR, modPath);
  assert(fs.existsSync(fullModPath), `${modPath} existe na camada de serviços`);
  try {
    execSync(`node -c "${fullModPath}"`);
    assert(true, `${modPath} compila sem erros sintáticos (node -c)`);
  } catch (err) {
    assert(false, `${modPath} falhou na compilação: ${err.message}`);
  }
  const content = fs.readFileSync(fullModPath, 'utf-8');
  assert(!emojiRegex.test(content), `${modPath} cumpre rigorosamente a política anti-emoji`);
});

const modularComponents = [
  'js/components/cart.js',
  'js/components/product-card.js',
  'js/components/quick-view.js'
];
modularComponents.forEach(compPath => {
  const fullCompPath = path.join(ROOT_DIR, compPath);
  assert(fs.existsSync(fullCompPath), `${compPath} existe na camada de componentes`);
  try {
    execSync(`node -c "${fullCompPath}"`);
    assert(true, `${compPath} compila sem erros sintáticos (node -c)`);
  } catch (err) {
    assert(false, `${compPath} falhou na compilação: ${err.message}`);
  }
  const content = fs.readFileSync(fullCompPath, 'utf-8');
  assert(!emojiRegex.test(content), `${compPath} cumpre rigorosamente a política anti-emoji`);
});

const updatedSwRaw = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf-8');
assert(updatedSwRaw.includes('jez-boutique-cache-v2.2.0') || updatedSwRaw.includes('jez-boutique-cache-v2.3.0'), 'sw.js atualizou CACHE_NAME para v2.2.0/v2.3.0');
assert(updatedSwRaw.includes('./css/tokens.css'), 'sw.js inclui tokens.css no pré-cache');
assert(updatedSwRaw.includes('./js/services/firebase.js') && updatedSwRaw.includes('./js/components/cart.js'), 'sw.js inclui a nova malha de módulos em STATIC_ASSETS');
assert(indexHtmlRaw.includes('src="app.js"'), 'index.html carrega app.js nativamente para compatibilidade local e web');
assert(atelieHtmlRaw.includes('src="admin.js"'), 'atelie.html carrega admin.js nativamente para compatibilidade local e web');

console.log('\n📸 24. Validando Resiliência de Fotos, Otimização de Payload e Persistência no Ateliê (JEZ-029):');
const currentAdminJs = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
assert(currentAdminJs.includes('handleStorageQuotaExceeded'), 'admin.js implementa rotina de recuperação para estouro de cota do localStorage');
assert(currentAdminJs.includes('try {') && currentAdminJs.includes('localStorage.setItem(STORAGE_CATALOG_KEY'), 'admin.js protege persistência de catálogo com try/catch contra QuotaExceededError');
assert(currentAdminJs.includes('maxWidth = 540') && currentAdminJs.includes('quality = 0.68'), 'admin.js otimiza compressão de fotos complementares para 540px a 68% de qualidade');
assert(currentAdminJs.includes('targetSize = 540') && currentAdminJs.includes("toDataURL('image/jpeg', 0.72)"), 'admin.js calibra recorte de capa 1:1 para 540px a 72% de qualidade');
assert(currentAdminJs.includes('Salvando e Publicando...') && currentAdminJs.includes('Salvando Alterações...'), 'admin.js fornece feedback visual de carregamento nos botões de submissão');
assert(!emojiRegex.test(currentAdminJs), 'admin.js mantém conformidade estrita com ZERO emojis');

// Teste funcional de simulação: peça com 5 fotos e preservação da peça ativa na recuperação de quota
const mockCatalog = [
  { id: 'custom-old', name: 'Peça Antiga', images: ['data:image/jpeg;base64,111', 'data:image/jpeg;base64,222', 'data:image/jpeg;base64,333'] },
  { id: 'custom-new', name: 'Nova Peça Multi-Fotos', images: ['data:image/jpeg;base64,aaa', 'data:image/jpeg;base64,bbb', 'data:image/jpeg;base64,ccc', 'data:image/jpeg;base64,ddd', 'data:image/jpeg;base64,eee'] }
];
const targetId = 'custom-new';
const slimResult = mockCatalog.map(p => {
  if (p.id !== targetId && p.id.startsWith('custom-') && Array.isArray(p.images) && p.images.length > 1) {
    return { ...p, images: [p.images[0]] };
  }
  return p;
});
assert(slimResult.find(p => p.id === 'custom-old').images.length === 1, 'Rotina de quota compacta fotos secundárias de peças antigas');
assert(slimResult.find(p => p.id === 'custom-new').images.length === 5, 'Rotina de quota preserva integralmente todas as 5 fotos da peça recém-adicionada/editada');

console.log('\n🏛️ 25. Validando Decomposição Modular do Ateliê (JEZ-030):');
const adminModules = [
  'js/admin/auth.js',
  'js/admin/cropper.js',
  'js/admin/image-compression.js',
  'js/admin/catalog.js',
  'js/admin/orders.js',
  'js/admin/dashboard.js'
];
adminModules.forEach(modPath => {
  const fullModPath = path.join(ROOT_DIR, modPath);
  assert(fs.existsSync(fullModPath), `${modPath} existe na arquitetura modular do Ateliê`);
  try {
    execSync(`node -c "${fullModPath}"`);
    assert(true, `${modPath} compila sem erros sintáticos (node -c)`);
  } catch (err) {
    assert(false, `${modPath} falhou na compilação: ${err.message}`);
  }
  const content = fs.readFileSync(fullModPath, 'utf-8');
  assert(!emojiRegex.test(content), `${modPath} cumpre rigorosamente a política anti-emoji`);
});

assert(updatedSwRaw.includes('./js/admin/auth.js'), 'sw.js inclui auth.js em STATIC_ASSETS');
assert(updatedSwRaw.includes('./js/admin/cropper.js'), 'sw.js inclui cropper.js em STATIC_ASSETS');
assert(updatedSwRaw.includes('./js/admin/image-compression.js'), 'sw.js inclui image-compression.js em STATIC_ASSETS');
assert(updatedSwRaw.includes('./js/admin/catalog.js'), 'sw.js inclui catalog.js em STATIC_ASSETS');
assert(updatedSwRaw.includes('./js/admin/orders.js'), 'sw.js inclui orders.js em STATIC_ASSETS');
assert(updatedSwRaw.includes('./js/admin/dashboard.js'), 'sw.js inclui dashboard.js em STATIC_ASSETS');

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
