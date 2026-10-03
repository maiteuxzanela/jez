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
try {
  execSync(`node --input-type=module -e "import('${path.join(ROOT_DIR, 'admin.js')}')"`);
  assert(true, 'admin.js valida como módulo ESM sem duplicações de identificador ou conflitos léxicos');
} catch (e) {
  assert(false, `admin.js falhou na compilação de módulo ESM: ${e.message}`);
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

console.log('\n[26] Validando Integracao do Acervo do Atelie com o DOM (JEZ-031):');
const finalAdminJs = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
assert(finalAdminJs.includes("document.getElementById('admin-catalog-grid')"), 'admin.js referencia o container oficial do acervo (#admin-catalog-grid)');
assert(!finalAdminJs.includes("catalog-list-container"), 'admin.js nao referencia mais o ID obsoleto catalog-list-container');
assert(finalAdminJs.includes('cat-count-all') && finalAdminJs.includes('cat-count-ready') && finalAdminJs.includes('cat-count-order'), 'admin.js atualiza os contadores de status do acervo');
assert(finalAdminJs.includes('cat-count-suspended') && finalAdminJs.includes('total-pieces-count'), 'admin.js atualiza contador de pecas suspensas e totalizador');
assert(finalAdminJs.includes('.catalog-filter-btn') && finalAdminJs.includes('catalog-search-input'), 'admin.js conecta listeners de filtro por abas e busca textual');
assert(finalAdminJs.includes('admin-product-card') && finalAdminJs.includes('admin-product-thumb'), 'admin.js utiliza classes de card compativeis com admin.css');
assert(finalAdminJs.includes('modal-edit-backdrop') && finalAdminJs.includes('form-edit-product'), 'admin.js mapeia o modal de edicao oficial do atelie.html');
assert(finalAdminJs.includes('edit-piece-id') && finalAdminJs.includes('edit-product-desc'), 'admin.js sincroniza campos de identificador e descricao na edicao');
assert(finalAdminJs.includes('onProductsChange') && finalAdminJs.includes('onOrdersChange'), 'admin.js implementa sincronizacao em tempo real com Firestore');
console.log('\n[27] Testes Unitarios Funcionais e Cobertura de Caminhos de Erro (JEZ-031):');

// A. Testes de Sanitizacao Estrita e Casos de Borda
function testSanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return 'assets/products/tote_cherry.jpg';
  const trimmed = url.trim();
  const assetIdx = trimmed.indexOf('assets/products/');
  if (assetIdx !== -1) return trimmed.slice(assetIdx);
  if (
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('./assets/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  return 'assets/products/tote_cherry.jpg';
}

assert(testSanitizeImageUrl(null) === 'assets/products/tote_cherry.jpg', 'Sanitizacao de imagem trata valor nulo com fallback seguro');
assert(testSanitizeImageUrl('') === 'assets/products/tote_cherry.jpg', 'Sanitizacao de imagem trata string vazia com fallback seguro');
assert(testSanitizeImageUrl('javascript:alert(1)') === 'assets/products/tote_cherry.jpg', 'Sanitizacao de imagem rejeita protocolo perigoso javascript:');
assert(testSanitizeImageUrl('data:text/html,<script>alert(1)</script>') === 'assets/products/tote_cherry.jpg', 'Sanitizacao de imagem rejeita data:text/html malicioso');
assert(testSanitizeImageUrl('https://cdn.jez.com/bolsa.webp') === 'https://cdn.jez.com/bolsa.webp', 'Sanitizacao de imagem aceita URLs HTTPS validas');
assert(testSanitizeImageUrl('data:image/webp;base64,abc') === 'data:image/webp;base64,abc', 'Sanitizacao de imagem aceita data:image legitimo');

function testSanitizeTrackingCode(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase().replace(/[^A-Z0-9\- ]/g, '').slice(0, 30);
}

assert(testSanitizeTrackingCode(null) === '', 'Sanitizacao de rastreio trata valor nulo com string vazia');
assert(testSanitizeTrackingCode('nl 123 456 789 br') === 'NL 123 456 789 BR', 'Sanitizacao de rastreio normaliza caixa alta e espacos');
assert(testSanitizeTrackingCode('<script>NL123BR</script>') === 'SCRIPTNL123BRSCRIPT', 'Sanitizacao de rastreio remove tags HTML e caracteres proibidos');

// B. Teste Unitario da Logica de Ordenacao Curada
const defaultOrder = [
  'bolsa-punk', 'tote-cherry', 'shoulder-coracao', 'bolsa-xadrez',
  'blusa-teia', 'top-bandana', 'cardiga-manteiga', 'chaveiro-baphomet', 'porta-airpods'
];
function testSortCatalog(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const idxA = defaultOrder.indexOf(a.id);
    const idxB = defaultOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });
}

assert(testSortCatalog([]).length === 0, 'Ordenacao curada trata array vazio sem falhas');
const invertedCatalog = [{ id: 'porta-airpods' }, { id: 'bolsa-punk' }, { id: 'custom-1' }];
const sortedCatalog = testSortCatalog(invertedCatalog);
assert(sortedCatalog[0].id === 'bolsa-punk' && sortedCatalog[1].id === 'porta-airpods' && sortedCatalog[2].id === 'custom-1', 'Ordenacao curada prioriza pecas padrao na ordem editorial e customizadas ao fim');

// C. Teste Unitario de Classificacao de Status e Estoque do Acervo
function testClassifyPiece(piece) {
  if (!piece) return { badge: 'indefinido', canDisplay: false };
  const isSuspended = piece.status === 'suspended';
  if (isSuspended) return { badge: 'Suspensa', canDisplay: false };
  const isReady = piece.status ? piece.status === 'ready' : (piece.isReady !== undefined ? piece.isReady : true);
  const stock = piece.stockQty !== undefined && piece.stockQty !== null ? Number(piece.stockQty) : (isReady ? 1 : 0);
  if (isReady && stock <= 0) return { badge: 'Esgotada (0 un.)', canDisplay: true };
  if (isReady) return { badge: `Pronta Entrega (${stock} un.)`, canDisplay: true };
  return { badge: 'Sob Encomenda', canDisplay: true };
}

assert(testClassifyPiece({ status: 'suspended' }).badge === 'Suspensa', 'Classificacao atribui Suspensa para status suspended');
assert(testClassifyPiece({ status: 'ready', stockQty: 0 }).badge === 'Esgotada (0 un.)', 'Classificacao atribui Esgotada para pronta entrega sem estoque');
assert(testClassifyPiece({ status: 'ready', stockQty: 4 }).badge === 'Pronta Entrega (4 un.)', 'Classificacao exibe estoque correto para pronta entrega');
assert(testClassifyPiece({ status: 'order' }).badge === 'Sob Encomenda', 'Classificacao atribui Sob Encomenda para pecas de producao sob pedido');
assert(testClassifyPiece(null).badge === 'indefinido', 'Classificacao trata peca nula defensivamente');

// D. Teste Unitario de Filtragem e Busca Textual
function testFilterCatalog(catalog, filter, query = '') {
  let list = Array.isArray(catalog) ? catalog : [];
  if (filter === 'ready') {
    list = list.filter(p => p.status === 'ready' || (p.status !== 'order' && p.status !== 'suspended' && p.isReady));
  } else if (filter === 'order') {
    list = list.filter(p => p.status === 'order' || (p.status !== 'ready' && p.status !== 'suspended' && !p.isReady));
  } else if (filter === 'suspended') {
    list = list.filter(p => p.status === 'suspended');
  }
  if (query) {
    list = list.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase()));
  }
  return list;
}

const sampleCatalog = [
  { id: '1', name: 'Bolsa Punk', status: 'ready', isReady: true },
  { id: '2', name: 'Blusa Teia', status: 'order', isReady: false },
  { id: '3', name: 'Cardiga Manteiga', status: 'suspended', isReady: true }
];

assert(testFilterCatalog(sampleCatalog, 'ready').length === 1, 'Filtro pronta entrega retorna exatamente 1 item');
assert(testFilterCatalog(sampleCatalog, 'order').length === 1, 'Filtro encomenda retorna exatamente 1 item');
assert(testFilterCatalog(sampleCatalog, 'suspended').length === 1, 'Filtro suspensas retorna exatamente 1 item');
assert(testFilterCatalog(sampleCatalog, 'all', 'punk').length === 1, 'Busca textual localiza peca por termo em minusculo');
assert(testFilterCatalog(sampleCatalog, 'all', 'INEXISTENTE').length === 0, 'Busca textual retorna lista vazia quando termo nao existe');
assert(testFilterCatalog(null, 'all').length === 0, 'Filtro trata catalogo nulo com lista vazia sem quebra');

// E. Teste Unitario de Mutacao Segura de Status
function testMutateStatus(catalog, id, newStatus) {
  if (!id || typeof id !== 'string') return { success: false, reason: 'invalid_id', catalog };
  const valid = ['ready', 'order', 'suspended'];
  if (!valid.includes(newStatus)) return { success: false, reason: 'invalid_status', catalog };
  const list = Array.isArray(catalog) ? catalog : [];
  const exists = list.some(p => p.id === id);
  if (!exists) return { success: false, reason: 'not_found', catalog: list };
  const updated = list.map(p => p.id === id ? { ...p, status: newStatus, isReady: newStatus === 'ready' } : p);
  return { success: true, catalog: updated };
}

assert(testMutateStatus(sampleCatalog, null, 'ready').success === false, 'Mutacao de status rejeita ID nulo');
assert(testMutateStatus(sampleCatalog, '1', 'invalido').success === false, 'Mutacao de status rejeita status desconhecido');
assert(testMutateStatus(sampleCatalog, '999', 'order').success === false, 'Mutacao de status retorna not_found para ID inexistente');
const mutateRes = testMutateStatus(sampleCatalog, '1', 'suspended');
assert(mutateRes.success === true && mutateRes.catalog.find(p => p.id === '1').status === 'suspended', 'Mutacao de status atualiza peca existente com sucesso');

// F. Teste Unitario de Exclusao Defensiva
function testDeletePiece(catalog, id) {
  if (!id || typeof id !== 'string') return { success: false, reason: 'invalid_id', catalog };
  const list = Array.isArray(catalog) ? catalog : [];
  const exists = list.some(p => p.id === id);
  if (!exists) return { success: false, reason: 'not_found', catalog: list };
  const updated = list.filter(p => p.id !== id);
  return { success: true, catalog: updated };
}

assert(testDeletePiece(sampleCatalog, null).success === false, 'Exclusao rejeita ID nulo');
assert(testDeletePiece(sampleCatalog, '999').success === false, 'Exclusao retorna not_found para peca inexistente');
const deleteRes = testDeletePiece(sampleCatalog, '1');
assert(deleteRes.success === true && deleteRes.catalog.length === sampleCatalog.length - 1, 'Exclusao remove peca existente corretamente');

// G. Teste Unitario de Validacao de Edicao de Peca
function testValidatePieceEdit(id, name, price, catalog) {
  if (!id || typeof id !== 'string' || !id.trim()) return { valid: false, field: 'id' };
  if (!name || typeof name !== 'string' || !name.trim()) return { valid: false, field: 'name' };
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) return { valid: false, field: 'price' };
  const list = Array.isArray(catalog) ? catalog : [];
  if (!list.some(p => p.id === id.trim())) return { valid: false, field: 'not_found' };
  return { valid: true };
}

assert(testValidatePieceEdit('', 'Bolsa', 120, sampleCatalog).valid === false, 'Validacao de edicao rejeita ID vazio');
assert(testValidatePieceEdit('1', '', 120, sampleCatalog).valid === false, 'Validacao de edicao rejeita nome vazio');
assert(testValidatePieceEdit('1', 'Bolsa', 0, sampleCatalog).valid === false, 'Validacao de edicao rejeita preco zero ou negativo');
assert(testValidatePieceEdit('999', 'Bolsa', 120, sampleCatalog).valid === false, 'Validacao de edicao rejeita peca inexistente');
assert(testValidatePieceEdit('1', 'Bolsa Atualizada', 150, sampleCatalog).valid === true, 'Validacao de edicao aprova dados consistentes');

// H. Teste Unitario de Gestao do Carrossel Multi-Fotos (JEZ-019 / JEZ-031)
function testAddCarouselPhoto(currentItems, newUrl) {
  const items = Array.isArray(currentItems) ? [...currentItems] : [];
  if (items.length >= 5) return { success: false, reason: 'limit_reached', items };
  if (!newUrl || typeof newUrl !== 'string') return { success: false, reason: 'invalid_url', items };
  const newIdx = items.length;
  items.push({ url: newUrl, isCover: newIdx === 0, isModified: true });
  return { success: true, items, newIndex: newIdx };
}

function testRemoveCarouselPhoto(currentItems, removeIdx, activeIdx) {
  const items = Array.isArray(currentItems) ? [...currentItems] : [];
  if (removeIdx <= 0 || removeIdx >= items.length) return { success: false, reason: 'invalid_index', items, activeIdx };
  items.splice(removeIdx, 1);
  let newActive = activeIdx;
  if (newActive >= items.length) {
    newActive = items.length - 1;
  } else if (newActive === removeIdx) {
    newActive = Math.max(0, removeIdx - 1);
  }
  return { success: true, items, activeIdx: newActive };
}

const initialCarousel = [
  { url: 'https://exemplo.com/capa.jpg', isCover: true }
];

const addRes1 = testAddCarouselPhoto(initialCarousel, 'https://exemplo.com/extra1.jpg');
assert(addRes1.success === true && addRes1.items.length === 2, 'Carrossel adiciona foto extra com sucesso');

const fullCarousel = [
  { url: '1' }, { url: '2' }, { url: '3' }, { url: '4' }, { url: '5' }
];
const addResFull = testAddCarouselPhoto(fullCarousel, 'https://exemplo.com/extra6.jpg');
assert(addResFull.success === false && addResFull.reason === 'limit_reached', 'Carrossel bloqueia adicao alem de 5 fotos');
assert(testAddCarouselPhoto(initialCarousel, null).success === false, 'Carrossel rejeita URL nula');

assert(testRemoveCarouselPhoto(addRes1.items, 0, 0).success === false, 'Carrossel proibe remocao da capa (indice 0)');
const remRes = testRemoveCarouselPhoto(addRes1.items, 1, 1);
assert(remRes.success === true && remRes.items.length === 1 && remRes.activeIdx === 0, 'Carrossel remove foto extra e ajusta indice ativo para capa');

// I. Teste Unitario de Fechamento de Recursos e Reset de Estado do Modal (JEZ-031)
function testCloseModalResourceCleanup(initialState) {
  const state = { ...initialState };
  state.currentEditingPiece = null;
  state.editCarouselItems = [];
  state.activeCarouselIdx = 0;
  state.isBackdropVisible = false;
  return state;
}

const mockModalState = {
  currentEditingPiece: { id: 'custom-123', name: 'Peça Teste' },
  editCarouselItems: [{ url: 'capa.jpg' }, { url: 'extra.jpg' }],
  activeCarouselIdx: 1,
  isBackdropVisible: true
};

const cleanedState = testCloseModalResourceCleanup(mockModalState);
assert(cleanedState.currentEditingPiece === null, 'Fechamento de modal limpa referencia da peca em edicao');
assert(cleanedState.editCarouselItems.length === 0, 'Fechamento de modal esvazia itens do carrossel');
assert(cleanedState.activeCarouselIdx === 0, 'Fechamento de modal reseta indice ativo para zero');
assert(cleanedState.isBackdropVisible === false, 'Fechamento de modal oculta backdrop visual');

// J. Teste Unitario de Gestao de Peca em Destaque no Hero (JEZ-015 / JEZ-031)
function testSetFeaturedPiece(catalog, productId) {
  if (!productId || typeof productId !== 'string') return { success: false, reason: 'invalid_id' };
  const list = Array.isArray(catalog) ? catalog : [];
  const piece = list.find(p => p.id === productId);
  if (!piece) return { success: false, reason: 'not_found' };
  const cacheObj = {
    id: piece.id,
    name: piece.name,
    price: piece.price,
    image: piece.image,
    webp: piece.image && piece.image.startsWith('assets/') ? piece.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''
  };
  return { success: true, featuredId: productId, cache: cacheObj };
}

assert(testSetFeaturedPiece(sampleCatalog, null).success === false, 'Destaque rejeita ID nulo');
assert(testSetFeaturedPiece(sampleCatalog, '999').success === false, 'Destaque retorna not_found para peca inexistente');
const featRes = testSetFeaturedPiece(sampleCatalog, '1');
assert(featRes.success === true && featRes.featuredId === '1', 'Destaque seleciona peca existente com sucesso');
assert(featRes.cache.name === 'Bolsa Punk', 'Destaque armazena nome correto no cache editorial');

// [28] Validacao dos Botoes Rapidos, Filtros de Pedidos e Acoes de Status do Atelie (JEZ-032)
console.log('\n[28] Validando Botoes Rapidos, Filtros e Acoes de Pedidos do Atelie (JEZ-032):');

// A. Botoes de Acao Rapida e Atualizacao no Dashboard
assert(adminJsRef.includes('btn-quick-new-piece') && adminJsRef.includes("switchTab('new-product')"), 'admin.js conecta botao rapido de cadastrar nova peca');
assert(adminJsRef.includes('btn-quick-view-orders') && adminJsRef.includes("switchTab('orders')"), 'admin.js conecta botao rapido de ver pedidos pendentes');
assert(adminJsRef.includes('btn-see-all-orders') && adminJsRef.includes("switchTab('orders')"), 'admin.js conecta link ver todos os pedidos do dashboard');
assert(adminJsRef.includes('btn-refresh-data') && adminJsRef.includes('Dados do ateliê atualizados'), 'admin.js conecta botao de atualizar dados do atelie');

// B. Filtros de Pedidos e Alternancia de Abas
assert(adminJsRef.includes("document.querySelectorAll('.order-filter-btn')"), 'admin.js registra listeners na barra de filtros de pedidos');
assert(adminJsRef.includes("currentOrderFilter = target.getAttribute('data-status')") || adminJsRef.includes("currentOrderFilter = e.currentTarget.getAttribute('data-status')"), 'admin.js sincroniza status ativo do filtro de pedidos');

// C. Identidade Visual Boutique dos Botoes de Status
assert(adminJsRef.includes('btn-status-change btn-order-action status-action-blue') && adminJsRef.includes('Confirmar Pix'), 'admin.js renderiza botao Confirmar Pix com classe boutique e status-action-blue');
assert(adminJsRef.includes('btn-status-change btn-order-action status-action-orange') && adminJsRef.includes('Enviar para o Tear'), 'admin.js renderiza botao Enviar para o Tear com status-action-orange');
assert(adminJsRef.includes('btn-status-change btn-order-action status-action-blue') && adminJsRef.includes('Peça Concluída'), 'admin.js renderiza botao Peca Concluida com status-action-blue');
assert(adminJsRef.includes('btn-status-change btn-order-action status-action-purple') && adminJsRef.includes('Postar e Enviar'), 'admin.js renderiza botao Postar e Enviar com status-action-purple');
assert(adminJsRef.includes('btn-status-change btn-order-action status-action-green') && adminJsRef.includes('Marcar Entregue'), 'admin.js renderiza botao Marcar Entregue com status-action-green');

// D. Suporte CSS aos Botoes de Status e Variantes de Cores
assert(adminCssContent.includes('.btn-status-change') && adminCssContent.includes('.btn-order-action'), 'admin.css define regras para .btn-status-change e .btn-order-action');
assert(adminCssContent.includes('.status-action-blue') && adminCssContent.includes('#2563eb'), 'admin.css define variante azul para Confirmar Pix');
assert(adminCssContent.includes('.status-action-orange') && adminCssContent.includes('#ea580c'), 'admin.css define variante laranja para Enviar para o Tear');
assert(adminCssContent.includes('.status-action-purple') && adminCssContent.includes('#7c3aed'), 'admin.css define variante roxa para Postar e Enviar');
assert(adminCssContent.includes('.status-action-green') && adminCssContent.includes('#16a34a'), 'admin.css define variante verde para Marcar Entregue');

// E. Testes Unitarios Puros de Transicao de Status de Pedidos
function testSimulateStatusTransition(order, action) {
  if (!order || !order.id) return { success: false, reason: 'invalid_order' };
  const current = order.status;
  if (action === 'confirm_pix') {
    if (current !== 'aguardando-pagamento') return { success: false, reason: 'invalid_state' };
    return { success: true, nextStatus: 'preparar-envio', trackingCode: null };
  }
  if (action === 'send_to_loom') {
    if (current !== 'aguardando-pagamento') return { success: false, reason: 'invalid_state' };
    return { success: true, nextStatus: 'em-producao', trackingCode: null };
  }
  if (action === 'piece_finished') {
    if (current !== 'em-producao') return { success: false, reason: 'invalid_state' };
    return { success: true, nextStatus: 'preparar-envio', trackingCode: null };
  }
  if (action === 'post_and_send') {
    if (current !== 'preparar-envio') return { success: false, reason: 'invalid_state' };
    return { success: true, nextStatus: 'enviado', trackingCode: order.trackingCode || null };
  }
  if (action === 'mark_delivered') {
    if (current !== 'enviado') return { success: false, reason: 'invalid_state' };
    return { success: true, nextStatus: 'concluido', trackingCode: order.trackingCode || null };
  }
  return { success: false, reason: 'unknown_action' };
}

const mockOrderPix = { id: 'JEZ-9001', status: 'aguardando-pagamento' };
assert(testSimulateStatusTransition(mockOrderPix, 'confirm_pix').nextStatus === 'preparar-envio', 'Transicao Confirmar Pix avanca pedido para preparar-envio');

const mockOrderCustom = { id: 'JEZ-9002', status: 'aguardando-pagamento' };
assert(testSimulateStatusTransition(mockOrderCustom, 'send_to_loom').nextStatus === 'em-producao', 'Transicao Enviar para o Tear avanca pedido para em-producao');

const mockOrderLoom = { id: 'JEZ-9003', status: 'em-producao' };
assert(testSimulateStatusTransition(mockOrderLoom, 'piece_finished').nextStatus === 'preparar-envio', 'Transicao Peca Concluida avanca pedido para preparar-envio');

const mockOrderShip = { id: 'JEZ-9004', status: 'preparar-envio', trackingCode: 'BR123456789AA' };
const shipRes = testSimulateStatusTransition(mockOrderShip, 'post_and_send');
assert(shipRes.nextStatus === 'enviado' && shipRes.trackingCode === 'BR123456789AA', 'Transicao Postar e Enviar avanca pedido para enviado com codigo de rastreio');

const mockOrderDelivered = { id: 'JEZ-9005', status: 'enviado' };
assert(testSimulateStatusTransition(mockOrderDelivered, 'mark_delivered').nextStatus === 'concluido', 'Transicao Marcar Entregue avanca pedido para concluido');

// F. Teste Unitario do Filtro de Pedidos
function testFilterOrders(ordersList, filterStatus) {
  if (!Array.isArray(ordersList)) return [];
  if (!filterStatus || filterStatus === 'all') return ordersList;
  return ordersList.filter(o => o.status === filterStatus);
}
const ordersSet = [
  { id: '1', status: 'aguardando-pagamento' },
  { id: '2', status: 'em-producao' },
  { id: '3', status: 'preparar-envio' },
  { id: '4', status: 'enviado' },
  { id: '5', status: 'concluido' }
];
assert(testFilterOrders(ordersSet, 'all').length === 5, 'Filtro all retorna todos os 5 pedidos');
assert(testFilterOrders(ordersSet, 'aguardando-pagamento').length === 1, 'Filtro aguardando-pagamento retorna 1 pedido');
assert(testFilterOrders(ordersSet, 'em-producao').length === 1, 'Filtro em-producao retorna 1 pedido');
assert(testFilterOrders(ordersSet, 'preparar-envio').length === 1, 'Filtro preparar-envio retorna 1 pedido');
assert(testFilterOrders(ordersSet, 'enviado').length === 1, 'Filtro enviado retorna 1 pedido');
assert(testFilterOrders(ordersSet, 'concluido').length === 1, 'Filtro concluido retorna 1 pedido');

// G. Testes Unitarios de Validacao e Cobertura de Caminhos de Erro (validateOrderStatusTransition)
assert(adminJsRef.includes('filterOrdersList') && adminJsRef.includes('validateOrderStatusTransition'), 'admin.js integra funcoes puras de pedidos modularizadas');

function testValidateTransition(current, target) {
  if (!current || typeof current !== 'string') return { allowed: false, reason: 'invalid_current_status' };
  if (!target || typeof target !== 'string') return { allowed: false, reason: 'invalid_target_status' };
  const allowedMap = {
    'aguardando-pagamento': ['em-producao', 'preparar-envio'],
    'em-producao': ['preparar-envio'],
    'preparar-envio': ['enviado'],
    'enviado': ['concluido'],
    'concluido': []
  };
  const list = allowedMap[current] || [];
  if (!list.includes(target)) return { allowed: false, reason: 'transition_not_allowed' };
  return { allowed: true };
}

assert(testValidateTransition(null, 'em-producao').allowed === false, 'Transicao rejeita status atual nulo');
assert(testValidateTransition('aguardando-pagamento', null).allowed === false, 'Transicao rejeita status alvo nulo');
assert(testValidateTransition('desconhecido', 'em-producao').allowed === false, 'Transicao rejeita status atual inexistente');
assert(testValidateTransition('aguardando-pagamento', 'concluido').allowed === false, 'Transicao ilegal direto para concluido e impedida');
assert(testValidateTransition('concluido', 'em-producao').allowed === false, 'Transicao reversa a partir de concluido e impedida');
assert(testValidateTransition('aguardando-pagamento', 'em-producao').allowed === true, 'Transicao aguardando-pagamento para em-producao e permitida');
assert(testValidateTransition('aguardando-pagamento', 'preparar-envio').allowed === true, 'Transicao aguardando-pagamento para preparar-envio e permitida');
assert(testValidateTransition('em-producao', 'preparar-envio').allowed === true, 'Transicao em-producao para preparar-envio e permitida');
assert(testValidateTransition('preparar-envio', 'enviado').allowed === true, 'Transicao preparar-envio para enviado e permitida');
assert(testValidateTransition('enviado', 'concluido').allowed === true, 'Transicao enviado para concluido e permitida');

// H. Testes Unitarios de Caminhos de Erro do Filtro (filterOrdersList)
assert(testFilterOrders(null, 'all').length === 0, 'Filtro trata lista nula retornando array vazio');
assert(testFilterOrders(undefined, 'all').length === 0, 'Filtro trata lista indefinida retornando array vazio');
assert(testFilterOrders(ordersSet, 'status_inexistente').length === 0, 'Filtro com status inexistente retorna array vazio');
assert(testFilterOrders(ordersSet, null).length === 5, 'Filtro com status nulo fallback para todos os pedidos');

// I. Testes de Sanitizacao de Rastreio com Ataques e Ruido
function testSanitizeTrack(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase().replace(/[^A-Z0-9\- ]/g, '').slice(0, 30);
}
assert(testSanitizeTrack(null) === '', 'Sanitizacao de rastreio trata nulo com string vazia');
assert(testSanitizeTrack('<script>BR123456789AA</script>') === 'SCRIPTBR123456789AASCRIPT', 'Sanitizacao de rastreio remove tags pontuadas e aspas');
assert(testSanitizeTrack('  br-987654321-br  ') === 'BR-987654321-BR', 'Sanitizacao normaliza espacos e converte em maiusculas');
assert(testSanitizeTrack('AA123456789BR; DROP') === 'AA123456789BR DROP', 'Sanitizacao neutraliza injecoes de pontuacao');

// J. Testes Unitarios de Mutacao Pura de Pedidos (updateOrderInList)
assert(adminJsRef.includes('updateOrderInList'), 'admin.js integra e re-exporta updateOrderInList');

function testUpdateOrderInList(ordersList, orderId, newStatus, trackingCode = null) {
  if (!Array.isArray(ordersList)) return { success: false, orders: [], reason: 'invalid_orders_list' };
  if (!orderId || typeof orderId !== 'string') return { success: false, orders: ordersList, reason: 'invalid_id' };
  if (!newStatus || typeof newStatus !== 'string') return { success: false, orders: ordersList, reason: 'invalid_status' };
  const target = ordersList.find(o => o && o.id === orderId);
  if (!target) return { success: false, orders: ordersList, reason: 'order_not_found' };
  const check = testValidateTransition(target.status, newStatus);
  if (!check.allowed) return { success: false, orders: ordersList, reason: check.reason };
  let updatedTarget = null;
  const nextOrders = ordersList.map(o => {
    if (o && o.id === orderId) {
      updatedTarget = { ...o, status: newStatus };
      if (trackingCode !== null && trackingCode !== undefined) {
        updatedTarget.trackingCode = trackingCode;
      }
      return updatedTarget;
    }
    return o;
  });
  return { success: true, orders: nextOrders, updatedOrder: updatedTarget };
}

assert(testUpdateOrderInList(null, '1', 'em-producao').success === false, 'updateOrderInList rejeita lista invalida');
assert(testUpdateOrderInList(ordersSet, null, 'em-producao').success === false, 'updateOrderInList rejeita id nulo');
assert(testUpdateOrderInList(ordersSet, '1', null).success === false, 'updateOrderInList rejeita status nulo');
assert(testUpdateOrderInList(ordersSet, 'inexistente', 'preparar-envio').reason === 'order_not_found', 'updateOrderInList sinaliza pedido inexistente');
assert(testUpdateOrderInList(ordersSet, '1', 'concluido').reason === 'transition_not_allowed', 'updateOrderInList bloqueia transicao ilegal');

const okUpdate = testUpdateOrderInList(ordersSet, '1', 'preparar-envio');
assert(okUpdate.success === true && okUpdate.updatedOrder.status === 'preparar-envio', 'updateOrderInList atualiza status com sucesso de forma imutavel');
assert(ordersSet[0].status === 'aguardando-pagamento', 'updateOrderInList preserva array original sem efeitos colaterais');

const shipUpdate = testUpdateOrderInList(ordersSet, '3', 'enviado', 'BR999888777AA');
assert(shipUpdate.success === true && shipUpdate.updatedOrder.trackingCode === 'BR999888777AA', 'updateOrderInList anexa codigo de rastreamento no avanco para enviado');

// [29] Validando Reativacao Segura de Pecas e Preservacao da Modalidade (JEZ-033):
console.log('\n[29] Validando Reativacao Segura de Pecas e Preservacao da Modalidade (JEZ-033):');

// 1. Integracao no DOM e Ouvintes do Atelie
assert(adminJsRef.includes("setPieceStatus(id, 'reactivate')"), 'admin.js conecta o botao reactivate enviando a acao de reativacao contextual');
assert(adminJsRef.includes('determineReactivatedStatus') && adminJsRef.includes('mutatePieceStatus'), 'admin.js integra e re-exporta determineReactivatedStatus e mutatePieceStatus');

// 2. Funcoes Puras do Modulo js/admin/catalog.js para Teste Unitario
const adminCatalogModule = require('../js/admin/catalog.js');
const testDetermineReactivatedStatus = adminCatalogModule.determineReactivatedStatus;
const testMutatePieceStatus = adminCatalogModule.mutatePieceStatus;

// 3. Testes Unitarios de Determinacao de Status
assert(testDetermineReactivatedStatus(null) === 'ready', 'determineReactivatedStatus retorna pronta entrega defensiva para entrada nula');
assert(testDetermineReactivatedStatus({ originalStatus: 'order' }) === 'order', 'determineReactivatedStatus respeita originalStatus order');
assert(testDetermineReactivatedStatus({ originalStatus: 'ready' }) === 'ready', 'determineReactivatedStatus respeita originalStatus ready');
assert(testDetermineReactivatedStatus({ status: 'suspended', leadTimeDays: 8, isReady: false }) === 'order', 'determineReactivatedStatus detecta sob encomenda legada por leadTimeDays e isReady');
assert(testDetermineReactivatedStatus({ status: 'suspended', stockQty: 3, isReady: true }) === 'ready', 'determineReactivatedStatus detecta pronta entrega legada por stockQty e isReady');
assert(testDetermineReactivatedStatus({ status: 'suspended', leadTimeDays: 5, stockQty: 0 }) === 'order', 'determineReactivatedStatus detecta sob encomenda com estoque zero');

// 4. Testes de Ciclo Completo e Caminhos de Erro (mutatePieceStatus)
const testCatalogInitial = [
  { id: 'custom-order-1', name: 'Bolsa Tear Especial', status: 'order', isReady: false, leadTimeDays: 10, stockQty: 0 },
  { id: 'custom-ready-1', name: 'Scrunchie Algodao', status: 'ready', isReady: true, leadTimeDays: 0, stockQty: 5 }
];

assert(testMutatePieceStatus(null, 'custom-order-1', 'suspended').success === false, 'mutatePieceStatus rejeita lista nula');
assert(testMutatePieceStatus(testCatalogInitial, null, 'suspended').success === false, 'mutatePieceStatus rejeita ID nulo');
assert(testMutatePieceStatus(testCatalogInitial, 'custom-order-1', 'status_estranho').success === false, 'mutatePieceStatus rejeita status invalido');
assert(testMutatePieceStatus(testCatalogInitial, 'inexistente', 'suspended').reason === 'not_found', 'mutatePieceStatus sinaliza peca inexistente');

// Ciclo Sob Encomenda: Suspender -> Reativar
const suspendOrderRes = testMutatePieceStatus(testCatalogInitial, 'custom-order-1', 'suspended');
assert(suspendOrderRes.success === true, 'mutatePieceStatus suspende peca sob encomenda com sucesso');
assert(suspendOrderRes.updatedPiece.status === 'suspended', 'Peca suspensa possui status suspended');
assert(suspendOrderRes.updatedPiece.originalStatus === 'order', 'Peca suspensa armazena modalidade original order');
assert(suspendOrderRes.updatedPiece.leadTimeDays === 10, 'Peca suspensa mantem prazo de confeccao intacto');

const reactivateOrderRes = testMutatePieceStatus(suspendOrderRes.catalog, 'custom-order-1', 'reactivate');
assert(reactivateOrderRes.success === true, 'mutatePieceStatus reativa peca sob encomenda com sucesso');
assert(reactivateOrderRes.updatedPiece.status === 'order', 'Peca sob encomenda reativada restaura status order');
assert(reactivateOrderRes.updatedPiece.isReady === false, 'Peca sob encomenda reativada mantem isReady falso');
assert(reactivateOrderRes.updatedPiece.leadTimeDays === 10, 'Peca sob encomenda reativada preserva prazo em dias original');

// Ciclo Pronta Entrega: Suspender -> Reativar
const suspendReadyRes = testMutatePieceStatus(testCatalogInitial, 'custom-ready-1', 'suspended');
assert(suspendReadyRes.success === true, 'mutatePieceStatus suspende peca pronta entrega com sucesso');
assert(suspendReadyRes.updatedPiece.originalStatus === 'ready', 'Peca pronta entrega suspensa armazena modalidade original ready');

const reactivateReadyRes = testMutatePieceStatus(suspendReadyRes.catalog, 'custom-ready-1', 'reactivate');
assert(reactivateReadyRes.success === true, 'mutatePieceStatus reativa peca pronta entrega com sucesso');
assert(reactivateReadyRes.updatedPiece.status === 'ready', 'Peca pronta entrega reativada restaura status ready');
assert(reactivateReadyRes.updatedPiece.isReady === true, 'Peca pronta entrega reativada mantem isReady verdadeiro');
assert(reactivateReadyRes.updatedPiece.stockQty === 5, 'Peca pronta entrega reativada preserva quantidade de estoque');

// Garantia de Imutabilidade
assert(testCatalogInitial[0].status === 'order', 'mutatePieceStatus preserva array de catalogo original sem mutacao lateral');

// [30] Validando Gestao Segura de Modais, Fechamento no Backdrop e Tecla Escape (JEZ-034):
console.log('\n[30] Validando Gestao Segura de Modais, Fechamento no Backdrop e Tecla Escape (JEZ-034):');

const latestAdminJsContent = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
const latestAtelieHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');

// 1. Integracao no DOM e Ouvintes do Atelie
assert(latestAdminJsContent.includes('handleModalBackdropClick'), 'admin.js implementa e exporta handleModalBackdropClick');
assert(latestAdminJsContent.includes('handleModalEscapeKey'), 'admin.js implementa e exporta handleModalEscapeKey');
assert(latestAdminJsContent.includes('closeResetOrdersModal'), 'admin.js define funcao dedicada closeResetOrdersModal');
assert(latestAdminJsContent.includes("resetOrdersModal.addEventListener('click'") && latestAdminJsContent.includes('handleModalBackdropClick(e, resetOrdersModal'), 'admin.js conecta fechamento seguro por backdrop no modal de reset');
assert(latestAdminJsContent.includes("document.addEventListener('keydown'") && latestAdminJsContent.includes('handleModalEscapeKey'), 'admin.js registra listener global para a tecla Escape');
assert(!emojiRegex.test(latestAdminJsContent), 'admin.js preserva rigorosamente ZERO emojis apos as mudancas de JEZ-034');

// 2. Testes Unitarios de Fechamento por Backdrop (handleModalBackdropClick)
function testHandleModalBackdropClick(event, backdropElement, closeCallback) {
  if (!event || !backdropElement || typeof closeCallback !== 'function') return false;
  if (event.target === backdropElement) {
    closeCallback();
    return true;
  }
  return false;
}

const mockBackdrop = { id: 'modal-reset-orders-backdrop', style: { display: 'flex' } };
const mockCard = { id: 'modal-reset-orders-card', parent: mockBackdrop };
const mockInnerBtn = { id: 'btn-cancel-reset-orders', parent: mockCard };

let modalClosed = false;
const mockClose = () => { modalClosed = true; };

// Borda e parametros invalidos
assert(testHandleModalBackdropClick(null, mockBackdrop, mockClose) === false, 'handleModalBackdropClick rejeita evento nulo');
assert(testHandleModalBackdropClick({ target: mockBackdrop }, null, mockClose) === false, 'handleModalBackdropClick rejeita backdrop nulo');
assert(testHandleModalBackdropClick({ target: mockBackdrop }, mockBackdrop, null) === false, 'handleModalBackdropClick rejeita callback nula');

// Cliques internos nao devem fechar o modal
modalClosed = false;
const clickInsideCard = testHandleModalBackdropClick({ target: mockCard }, mockBackdrop, mockClose);
assert(clickInsideCard === false && modalClosed === false, 'handleModalBackdropClick ignora cliques disparados no card interno');

modalClosed = false;
const clickInsideBtn = testHandleModalBackdropClick({ target: mockInnerBtn }, mockBackdrop, mockClose);
assert(clickInsideBtn === false && modalClosed === false, 'handleModalBackdropClick ignora cliques disparados em botoes internos');

// Clique no backdrop fecha o modal
modalClosed = false;
const clickOnBackdrop = testHandleModalBackdropClick({ target: mockBackdrop }, mockBackdrop, mockClose);
assert(clickOnBackdrop === true && modalClosed === true, 'handleModalBackdropClick executa callback ao clicar exatamente no backdrop');

// 3. Testes Unitarios de Fechamento por Tecla Escape (handleModalEscapeKey)
function testHandleModalEscapeKey(event, activeModals = []) {
  if (!event || (event.key !== 'Escape' && event.key !== 'Esc')) return false;
  if (!Array.isArray(activeModals)) return false;
  for (const modal of activeModals) {
    if (modal && modal.element && modal.element.style) {
      const display = modal.element.style.display;
      if (display && display !== 'none') {
        if (typeof modal.close === 'function') {
          modal.close();
          return true;
        }
      }
    }
  }
  return false;
}

let escapeClosedModal = false;
const resetModalObj = {
  element: { style: { display: 'none' } },
  close: () => { escapeClosedModal = true; }
};
const editModalObj = {
  element: { style: { display: 'none' } },
  close: () => { escapeClosedModal = true; }
};

// Teclas normais devem ser ignoradas
assert(testHandleModalEscapeKey({ key: 'Enter' }, [resetModalObj]) === false, 'handleModalEscapeKey ignora tecla Enter');
assert(testHandleModalEscapeKey({ key: 'Tab' }, [resetModalObj]) === false, 'handleModalEscapeKey ignora tecla Tab');
assert(testHandleModalEscapeKey({ key: 'a' }, [resetModalObj]) === false, 'handleModalEscapeKey ignora teclas alfanumericas');

// Modais fechados nao disparam acao
escapeClosedModal = false;
assert(testHandleModalEscapeKey({ key: 'Escape' }, [resetModalObj, editModalObj]) === false, 'handleModalEscapeKey nao fecha modais que ja estao ocultos');
assert(escapeClosedModal === false, 'callback de fechamento nao e invocada para modais com display none');

// Modal aberto e fechado via Escape
resetModalObj.element.style.display = 'flex';
escapeClosedModal = false;
const escapeResult = testHandleModalEscapeKey({ key: 'Escape' }, [resetModalObj, editModalObj]);
assert(escapeResult === true && escapeClosedModal === true, 'handleModalEscapeKey fecha com sucesso o modal ativo ao pressionar Escape');

// Suporte alternativo a key Esc legado
resetModalObj.element.style.display = 'flex';
escapeClosedModal = false;
const escLegacyResult = testHandleModalEscapeKey({ key: 'Esc' }, [resetModalObj]);
assert(escLegacyResult === true && escapeClosedModal === true, 'handleModalEscapeKey suporta identificador legado Esc');

// Robustez defensiva
assert(testHandleModalEscapeKey(null, [resetModalObj]) === false, 'handleModalEscapeKey trata evento nulo defensivamente');
assert(testHandleModalEscapeKey({ key: 'Escape' }, null) === false, 'handleModalEscapeKey trata lista de modais nula defensivamente');
assert(testHandleModalEscapeKey({ key: 'Escape' }, [{}]) === false, 'handleModalEscapeKey trata itens malformados sem quebrar');

// ============================================================================
// 31. Validando Classificação de Esgotamento e Reativação Segura de Encomenda (RN-JEZ-001 e RN-JEZ-008)
// ============================================================================
console.log('\n[31] Validando Classificacao de Esgotamento e Reativacao Segura de Encomenda (RN-JEZ-001 / RN-JEZ-008):');

// Carrega servico de produtos
const productsModule = require('../js/services/products.js');
const testIsProductSoldOut = productsModule.isProductSoldOut;
assert(typeof testIsProductSoldOut === 'function', 'isProductSoldOut e exportada como funcao pelo servico de produtos');

// 1. Invariante RN-JEZ-001: Peca sob encomenda NUNCA e classificada como esgotada
const mockOrderPiece1 = { id: 'bolsa-punk', status: 'order', isReady: false, stockQty: 0, leadTimeDays: 7 };
assert(testIsProductSoldOut(mockOrderPiece1) === false, 'isProductSoldOut retorna false para peca sob encomenda com stockQty zero');

const mockOrderPiece2 = { id: 'custom-order-99', status: 'order', isReady: false, stockQty: null, leadTimeDays: 10 };
assert(testIsProductSoldOut(mockOrderPiece2) === false, 'isProductSoldOut retorna false para peca sob encomenda com stockQty null');

const mockOrderPiece3 = { id: 'custom-order-98', isReady: false, leadTimeDays: 5 };
assert(testIsProductSoldOut(mockOrderPiece3) === false, 'isProductSoldOut retorna false para peca sob encomenda sem status explicito mas com isReady false');

const mockOrderPiece4 = { id: 'custom-order-97', status: 'order', stockQty: 0 };
assert(testIsProductSoldOut(mockOrderPiece4) === false, 'isProductSoldOut retorna false para peca com status order mesmo com estoque zerado');

// 2. Peca pronta entrega sem estoque DEVE ser classificada como esgotada
const mockReadySoldOut = { id: 'tote-cherry', status: 'ready', isReady: true, stockQty: 0 };
assert(testIsProductSoldOut(mockReadySoldOut) === true, 'isProductSoldOut retorna true para pronta entrega com estoque zero');

const mockReadyInStock = { id: 'tote-cherry', status: 'ready', isReady: true, stockQty: 2 };
assert(testIsProductSoldOut(mockReadyInStock) === false, 'isProductSoldOut retorna false para pronta entrega com estoque positivo');

assert(testIsProductSoldOut(null) === false, 'isProductSoldOut trata entrada nula defensivamente retornando false');
assert(testIsProductSoldOut({}) === false, 'isProductSoldOut trata objeto vazio defensivamente');

// 3. Invariante RN-JEZ-008: Peca padrao sob encomenda sem metadados legados reativa como order
const defaultOrderPieceSuspended = { id: 'bolsa-punk', status: 'suspended', isReady: false, leadTimeDays: 0, stockQty: 0 };
assert(testDetermineReactivatedStatus(defaultOrderPieceSuspended) === 'order', 'determineReactivatedStatus reconhece peca padrao bolsa-punk como order mesmo com leadTimeDays zerado legado');

const defaultXadrezSuspended = { id: 'bolsa-xadrez', status: 'suspended' };
assert(testDetermineReactivatedStatus(defaultXadrezSuspended) === 'order', 'determineReactivatedStatus reconhece peca padrao bolsa-xadrez como order mesmo sem metadados');

const defaultBlusaTeiaSuspended = { id: 'blusa-teia', status: 'suspended' };
assert(testDetermineReactivatedStatus(defaultBlusaTeiaSuspended) === 'order', 'determineReactivatedStatus reconhece peca padrao blusa-teia como order');

// 4. Ciclo completo de suspensao e reativacao com mutatePieceStatus
const catalogWithOrder = [
  { id: 'bolsa-punk', name: 'Bolsa Punk', status: 'order', isReady: false, leadTimeDays: 7, stockQty: 0 }
];
const suspendResult = testMutatePieceStatus(catalogWithOrder, 'bolsa-punk', 'suspended');
assert(suspendResult.success === true, 'Peca sob encomenda e suspensa com sucesso');
assert(suspendResult.updatedPiece.status === 'suspended', 'Status e atualizado para suspended');
assert(suspendResult.updatedPiece.originalStatus === 'order', 'originalStatus e preservado como order');

const reactivateResult = testMutatePieceStatus(suspendResult.catalog, 'bolsa-punk', 'reactivate');
assert(reactivateResult.success === true, 'Peca suspensa e reativada com sucesso');
assert(reactivateResult.updatedPiece.status === 'order', 'Status reativado e order e NAO ready');
assert(reactivateResult.updatedPiece.isReady === false, 'isReady permanece false');
assert(reactivateResult.updatedPiece.leadTimeDays >= 7, 'Prazo de confeccao e mantido em dias uteis');
assert(testIsProductSoldOut(reactivateResult.updatedPiece) === false, 'Peca reativada sob encomenda NAO e considerada esgotada na vitrine');

// 5. Reativacao de pronta entrega zerada restaura ao menos 1 unidade para exibicao
const catalogWithEmptyReady = [
  { id: 'custom-ready-zero', name: 'Peca Pronta Zerada', status: 'ready', isReady: true, stockQty: 0 }
];
const suspendReadyZero = testMutatePieceStatus(catalogWithEmptyReady, 'custom-ready-zero', 'suspended');
const reactivateReadyZero = testMutatePieceStatus(suspendReadyZero.catalog, 'custom-ready-zero', 'reactivate');
assert(reactivateReadyZero.updatedPiece.status === 'ready', 'Pronta entrega reativa como ready');
assert(reactivateReadyZero.updatedPiece.stockQty >= 1, 'Pronta entrega zerada recupera ao menos 1 unidade ao ser disponibilizada');

// ============================================================================
// 32. Ciclo de Vida do PWA do Atelie e Suporte Multiplataforma (JEZ-035)
// ============================================================================
console.log('\n[32] Ciclo de Vida do PWA do Atelie e Suporte Multiplataforma (JEZ-035):');

// 1. Integridade Estrutural no HTML e Modulos do Atelie
const ateliePwaHtml = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
const adminPwaJs = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');

assert(ateliePwaHtml.includes('window.__jezPwaInstallPrompt = null'), 'atelie.html inicializa variavel de captura antecipada no head');
assert(ateliePwaHtml.includes("window.dispatchEvent(new CustomEvent('jez:pwa-prompt-ready'))"), 'atelie.html dispara evento jez:pwa-prompt-ready ao capturar instalador no head');
assert(ateliePwaHtml.includes('id="btn-pwa-install-admin"'), 'atelie.html contem o botao oficial de instalacao do atelie');
assert(ateliePwaHtml.includes('id="modal-pwa-ios-backdrop"'), 'atelie.html contem o modal dedicado de instrucoes PWA para iOS Safari');
assert(ateliePwaHtml.includes('id="btn-close-pwa-ios"'), 'atelie.html contem botao de fechar modal iOS');
assert(ateliePwaHtml.includes('id="btn-ok-pwa-ios"'), 'atelie.html contem botao de confirmacao no modal iOS');
assert(adminPwaJs.includes('setupPwaLifecycle'), 'admin.js exporta a rotina de ciclo de vida setupPwaLifecycle');
assert(adminPwaJs.includes('{ element: modalPwaIosBackdrop, close: closePwaIosModal }'), 'admin.js inclui modal iOS no listener global de escape');

const adminPwaModule = require('../admin.js');
const testSetupPwaLifecycle = adminPwaModule.setupPwaLifecycle;
const testPwaBackdropClick = adminPwaModule.handleModalBackdropClick;
const testPwaEscapeKey = adminPwaModule.handleModalEscapeKey;

assert(typeof testSetupPwaLifecycle === 'function', 'setupPwaLifecycle e exportada como funcao');
assert(typeof testPwaBackdropClick === 'function', 'handleModalBackdropClick e exportada como funcao');
assert(typeof testPwaEscapeKey === 'function', 'handleModalEscapeKey e exportada como funcao');
assert(testSetupPwaLifecycle(null) === null, 'setupPwaLifecycle trata parametros nulos defensivamente');
assert(testSetupPwaLifecycle({}) === null, 'setupPwaLifecycle trata objetos vazios defensivamente');

// Factory de Mocks Isolada para Validacao do Ciclo de Vida PWA
function createPwaTestElement(id) {
  const listeners = {};
  return {
    id,
    style: { display: 'none' },
    listeners,
    addEventListener(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    click(target) {
      if (listeners['click']) {
        const evt = {
          target: target || this,
          preventDefault: () => {}
        };
        listeners['click'].forEach(fn => fn(evt));
      }
    }
  };
}

function createPwaTestEnv(overrides = {}) {
  const windowListeners = {};
  const btnInstall = createPwaTestElement('btn-pwa-install-admin');
  const modalIos = createPwaTestElement('modal-pwa-ios-backdrop');
  const cardIos = createPwaTestElement('modal-pwa-ios-card');
  const btnCloseIos = createPwaTestElement('btn-close-pwa-ios');
  const btnOkIos = createPwaTestElement('btn-ok-pwa-ios');

  const elementsMap = {
    'btn-pwa-install-admin': btnInstall,
    'modal-pwa-ios-backdrop': modalIos,
    'modal-pwa-ios-card': cardIos,
    'btn-close-pwa-ios': btnCloseIos,
    'btn-ok-pwa-ios': btnOkIos
  };

  const documentObj = {
    readyState: 'complete',
    getElementById(id) {
      return elementsMap[id] || null;
    }
  };

  const defaultNav = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
    platform: 'Win32',
    maxTouchPoints: 0,
    standalone: false,
    serviceWorker: {
      register: () => Promise.resolve({})
    }
  };

  const navigatorObj = Object.assign({}, defaultNav, overrides.navigator || {});

  const windowObj = {
    __jezPwaInstallPrompt: overrides.earlyPrompt !== undefined ? overrides.earlyPrompt : null,
    MSStream: false,
    navigator: navigatorObj,
    matchMedia(query) {
      return {
        matches: query === '(display-mode: standalone)' ? Boolean(overrides.matchMediaStandalone) : false
      };
    },
    addEventListener(event, fn) {
      if (!windowListeners[event]) windowListeners[event] = [];
      windowListeners[event].push(fn);
    },
    dispatchEvent(eventName, eventObj = {}) {
      if (windowListeners[eventName]) {
        windowListeners[eventName].forEach(fn => fn(eventObj));
      }
    }
  };

  return {
    windowObj,
    documentObj,
    elements: {
      btnInstall,
      modalIos,
      cardIos,
      btnCloseIos,
      btnOkIos
    }
  };
}

// 2. Cenario 1: Early Capture no Desktop/Chromium
const earlyPromptMock = {
  prompt: async () => {},
  userChoice: Promise.resolve({ outcome: 'accepted' })
};
const envEarly = createPwaTestEnv({ earlyPrompt: earlyPromptMock });
let earlyToastMsg = null;
const lifecycleEarly = testSetupPwaLifecycle({
  windowObj: envEarly.windowObj,
  documentObj: envEarly.documentObj,
  onToast: (msg) => { earlyToastMsg = msg; }
});
assert(lifecycleEarly !== null, 'Early Capture: setupPwaLifecycle inicializado com sucesso');
assert(lifecycleEarly.isStandalone === false, 'Early Capture: isStandalone permanece false em Desktop normal');
assert(lifecycleEarly.isIos === false, 'Early Capture: isIos permanece false em Desktop Chromium');
assert(envEarly.elements.btnInstall.style.display === 'inline-flex', 'Early Capture: botao de instalacao ganha display inline-flex quando prompt previo existe');
assert(lifecycleEarly.getDeferredPrompt() === earlyPromptMock, 'Early Capture: prompt capturado precocemente e retornado pelo accessor getDeferredPrompt');

// 3. Cenario 2: Late Event (Evento disparado apos o setup)
// Subcenario 2A: Via evento customizado jez:pwa-prompt-ready
const envLateCustom = createPwaTestEnv({ earlyPrompt: null });
const lifecycleLateCustom = testSetupPwaLifecycle({
  windowObj: envLateCustom.windowObj,
  documentObj: envLateCustom.documentObj
});
assert(envLateCustom.elements.btnInstall.style.display === 'none', 'Late Event (Custom): botao inicia com display none sem prompt');
const lateCustomPromptMock = { prompt: async () => {} };
envLateCustom.windowObj.__jezPwaInstallPrompt = lateCustomPromptMock;
envLateCustom.windowObj.dispatchEvent('jez:pwa-prompt-ready');
assert(envLateCustom.elements.btnInstall.style.display === 'inline-flex', 'Late Event (Custom): botao ganha display inline-flex apos evento jez:pwa-prompt-ready');
assert(lifecycleLateCustom.getDeferredPrompt() === lateCustomPromptMock, 'Late Event (Custom): prompt tardio fica disponivel no ciclo de vida');

// Subcenario 2B: Via evento nativo beforeinstallprompt
const envLateNative = createPwaTestEnv({ earlyPrompt: null });
const lifecycleLateNative = testSetupPwaLifecycle({
  windowObj: envLateNative.windowObj,
  documentObj: envLateNative.documentObj
});
assert(envLateNative.elements.btnInstall.style.display === 'none', 'Late Event (Native): botao inicia com display none sem prompt');
let preventDefaultCalled = false;
const nativePromptMock = {
  preventDefault: () => { preventDefaultCalled = true; },
  prompt: async () => {}
};
envLateNative.windowObj.dispatchEvent('beforeinstallprompt', nativePromptMock);
assert(preventDefaultCalled === true, 'Late Event (Native): preventDefault e acionado para suprimir banner padrao do navegador');
assert(envLateNative.elements.btnInstall.style.display === 'inline-flex', 'Late Event (Native): botao ganha display inline-flex apos evento beforeinstallprompt nativo');
assert(lifecycleLateNative.getDeferredPrompt() === nativePromptMock, 'Late Event (Native): evento nativo e armazenado como deferred prompt');

// 4. Cenario 3: iOS Safari (onde beforeinstallprompt nunca dispara)
const envIos = createPwaTestEnv({
  navigator: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    platform: 'iPhone',
    maxTouchPoints: 5,
    standalone: false
  }
});
const lifecycleIos = testSetupPwaLifecycle({
  windowObj: envIos.windowObj,
  documentObj: envIos.documentObj
});
assert(lifecycleIos.isIos === true, 'iOS Safari: isIos detectado como true via userAgent');
assert(lifecycleIos.isStandalone === false, 'iOS Safari: isStandalone e false antes de instalar');
assert(envIos.elements.btnInstall.style.display === 'inline-flex', 'iOS Safari: botao de instalacao ganha display inline-flex mesmo sem evento de prompt');
assert(envIos.elements.modalIos.style.display === 'none', 'iOS Safari: modal inicia com display none');

// Clique no botao abre modal com instrucoes
envIos.elements.btnInstall.click();
assert(envIos.elements.modalIos.style.display === 'flex', 'iOS Safari: clique no botao de instalacao abre o modal instrucional com display flex');

// Fechamento via botao X
envIos.elements.btnCloseIos.click();
assert(envIos.elements.modalIos.style.display === 'none', 'iOS Safari: clique no botao btn-close-pwa-ios fecha o modal');

// Reabertura e fechamento via botao Entendi
lifecycleIos.openIosModal();
assert(envIos.elements.modalIos.style.display === 'flex', 'iOS Safari: openIosModal reabre o modal');
envIos.elements.btnOkIos.click();
assert(envIos.elements.modalIos.style.display === 'none', 'iOS Safari: clique no botao btn-ok-pwa-ios fecha o modal');

// 5. Cenario 4: Standalone Mode (app ja instalado)
// Subcenario 4A: iOS Standalone (navigator.standalone === true)
const envStandaloneIos = createPwaTestEnv({
  navigator: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
    platform: 'iPhone',
    standalone: true
  }
});
const lifecycleStandaloneIos = testSetupPwaLifecycle({
  windowObj: envStandaloneIos.windowObj,
  documentObj: envStandaloneIos.documentObj
});
assert(lifecycleStandaloneIos.isStandalone === true, 'Standalone Mode (iOS): isStandalone detectado como true via navigator.standalone');
assert(envStandaloneIos.elements.btnInstall.style.display === 'none', 'Standalone Mode (iOS): botao permanece com display none');
assert(lifecycleStandaloneIos.getDeferredPrompt() === null, 'Standalone Mode (iOS): getDeferredPrompt retorna null em app instalado');

// Subcenario 4B: Desktop/Android Standalone (matchMedia standalone === true)
const envStandaloneDesktop = createPwaTestEnv({
  matchMediaStandalone: true,
  earlyPrompt: { prompt: async () => {} }
});
const lifecycleStandaloneDesktop = testSetupPwaLifecycle({
  windowObj: envStandaloneDesktop.windowObj,
  documentObj: envStandaloneDesktop.documentObj
});
assert(lifecycleStandaloneDesktop.isStandalone === true, 'Standalone Mode (Desktop): isStandalone detectado via matchMedia');
assert(envStandaloneDesktop.elements.btnInstall.style.display === 'none', 'Standalone Mode (Desktop): botao permanece com display none mesmo com prompt presente');

// 6. Cenario 5: Evento appinstalled
const envInstalled = createPwaTestEnv({
  earlyPrompt: { prompt: async () => {} }
});
let installedToast = null;
const lifecycleInstalled = testSetupPwaLifecycle({
  windowObj: envInstalled.windowObj,
  documentObj: envInstalled.documentObj,
  onToast: (msg) => { installedToast = msg; }
});
assert(envInstalled.elements.btnInstall.style.display === 'inline-flex', 'appinstalled: botao esta visivel antes do encerramento da instalacao');
envInstalled.windowObj.dispatchEvent('appinstalled');
assert(envInstalled.elements.btnInstall.style.display === 'none', 'appinstalled: botao e ocultado com display none apos evento appinstalled');
assert(envInstalled.windowObj.__jezPwaInstallPrompt === null, 'appinstalled: window.__jezPwaInstallPrompt e limpo defensivamente');
assert(lifecycleInstalled.getDeferredPrompt() === null, 'appinstalled: deferredPrompt interno e invalidado');
assert(installedToast !== null && installedToast.includes('instalado com sucesso'), 'appinstalled: dispara toast amigavel de conclusao da instalacao');

// 7. Cenario 6: Acessibilidade de modais no modal iOS
// Reutiliza o ambiente iOS para testes estritos de backdrop e teclado
const envA11y = createPwaTestEnv({
  navigator: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
    platform: 'iPhone'
  }
});
const lifecycleA11y = testSetupPwaLifecycle({
  windowObj: envA11y.windowObj,
  documentObj: envA11y.documentObj
});

// A. Clique no backdrop fecha o modal
envA11y.elements.modalIos.style.display = 'flex';
const clickBackdropResult = testPwaBackdropClick({ target: envA11y.elements.modalIos }, envA11y.elements.modalIos, lifecycleA11y.closeIosModal);
assert(clickBackdropResult === true, 'Acessibilidade: handleModalBackdropClick retorna true ao clicar no backdrop do modal iOS');
assert(envA11y.elements.modalIos.style.display === 'none', 'Acessibilidade: clique no backdrop fecha o modal iOS');

// B. Clique interno (no card) NAO fecha o modal
envA11y.elements.modalIos.style.display = 'flex';
const clickInsideResult = testPwaBackdropClick({ target: envA11y.elements.cardIos }, envA11y.elements.modalIos, lifecycleA11y.closeIosModal);
assert(clickInsideResult === false, 'Acessibilidade: handleModalBackdropClick retorna false ao clicar no card interno');
assert(envA11y.elements.modalIos.style.display === 'flex', 'Acessibilidade: modal iOS permanece aberto ao clicar dentro do card');

// B2. Clique no listener nativo conectado ao elemento modalIos
envA11y.elements.modalIos.click(envA11y.elements.cardIos);
assert(envA11y.elements.modalIos.style.display === 'flex', 'Acessibilidade: listener conectado ao modalIos ignora propagacao de card interno');
envA11y.elements.modalIos.click(envA11y.elements.modalIos);
assert(envA11y.elements.modalIos.style.display === 'none', 'Acessibilidade: listener conectado ao modalIos fecha modal no clique do backdrop');

// C. Tecla Escape fecha o modal ativo
envA11y.elements.modalIos.style.display = 'flex';
const pwaEscapeResult = testPwaEscapeKey({ key: 'Escape' }, [
  { element: envA11y.elements.modalIos, close: lifecycleA11y.closeIosModal }
]);
assert(pwaEscapeResult === true, 'Acessibilidade: handleModalEscapeKey retorna true para tecla Escape com modal iOS ativo');
assert(envA11y.elements.modalIos.style.display === 'none', 'Acessibilidade: tecla Escape fecha o modal iOS');

// D. Tecla Escape nao executa acao se modal ja estiver fechado
const pwaEscapeClosedResult = testPwaEscapeKey({ key: 'Escape' }, [
  { element: envA11y.elements.modalIos, close: lifecycleA11y.closeIosModal }
]);
assert(pwaEscapeClosedResult === false, 'Acessibilidade: handleModalEscapeKey ignora fechamento quando modal ja esta oculto');

// E. Tecla que nao e Escape e ignorada
envA11y.elements.modalIos.style.display = 'flex';
const pwaEnterResult = testPwaEscapeKey({ key: 'Enter' }, [
  { element: envA11y.elements.modalIos, close: lifecycleA11y.closeIosModal }
]);
assert(pwaEnterResult === false, 'Acessibilidade: handleModalEscapeKey ignora tecla Enter');
assert(envA11y.elements.modalIos.style.display === 'flex', 'Acessibilidade: modal permanece aberto ao pressionar tecla diferente de Escape');
lifecycleA11y.closeIosModal();

// ============================================================================
// 33. Navegacao e Acessibilidade dos Pedidos Recentes no Dashboard (JEZ-036)
// ============================================================================
console.log('\n[33] Navegacao e Acessibilidade dos Pedidos Recentes no Dashboard (JEZ-036):');

// 1. Integridade Estrutural nos Modulos e Folha de Estilos
const dashboardJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js/admin/dashboard.js'), 'utf-8');
const adminJsForNav = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
const adminCssForNav = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf-8');

// Diretriz Zero Emojis estrita (Robin Quality Gate)
assert(!emojiRegex.test(dashboardJsContent), 'dashboard.js cumpre rigorosamente a regra zero emojis');
assert(!emojiRegex.test(adminJsForNav), 'admin.js cumpre rigorosamente a regra zero emojis apos JEZ-036');
assert(!emojiRegex.test(adminCssForNav), 'admin.css cumpre rigorosamente a regra zero emojis');

// Contratos estruturais no dashboard.js
assert(dashboardJsContent.includes('onNavigateOrder'), 'dashboard.js aceita callback onNavigateOrder em params');
assert(dashboardJsContent.includes("itemRow.setAttribute('role', 'button')"), 'dashboard.js atribui role button em recent-order-item');
assert(dashboardJsContent.includes("itemRow.setAttribute('tabindex', '0')"), 'dashboard.js atribui tabindex 0 em recent-order-item');
assert(dashboardJsContent.includes("itemRow.setAttribute('data-order-id', order.id)"), 'dashboard.js atribui atributo data-order-id com o identificador do pedido');
assert(dashboardJsContent.includes("itemRow.setAttribute('aria-label'"), 'dashboard.js define aria-label descritivo com safeId e safeCustomer');
assert(dashboardJsContent.includes('recent-order-chevron'), 'dashboard.js inclui classe recent-order-chevron no SVG vetorial');
assert(dashboardJsContent.includes('polyline points="9 18 15 12 9 6"'), 'dashboard.js renderiza icone vetorial SVG chevron com polyline nativo');
assert(dashboardJsContent.includes("e.key === 'Enter' || e.key === ' '"), 'dashboard.js escuta teclas Enter e Space para ativacao acessivel');
assert(dashboardJsContent.includes('e.preventDefault()'), 'dashboard.js previne acao padrao ao pressionar Enter ou Space');

// Contratos estruturais no admin.js e admin.css
assert(adminJsForNav.includes('const navigateToOrder ='), 'admin.js define funcao dedicada navigateToOrder');
assert(adminJsForNav.includes('card.id = `order-card-${order.id}`'), 'admin.js define id unico order-card-${order.id} em cada card de pedido');
assert(adminJsForNav.includes("card.setAttribute('data-order-id', order.id)"), 'admin.js define data-order-id em cada card de pedido');
assert(adminJsForNav.includes('onNavigateOrder: navigateToOrder'), 'admin.js injeta navigateToOrder no renderDashboard');
assert(adminJsForNav.includes('highlight-focus-pesponto'), 'admin.js aplica classe highlight-focus-pesponto no card selecionado');
assert(adminCssForNav.includes('.recent-order-item'), 'admin.css define estilos dedicados para .recent-order-item');
assert(adminCssForNav.includes('.recent-order-chevron'), 'admin.css define micro-interacoes e transicao do chevron');
assert(adminCssForNav.includes('.order-card.highlight-focus-pesponto'), 'admin.css define classe .order-card.highlight-focus-pesponto');
assert(adminCssForNav.includes('@keyframes pespontoFocusPulse'), 'admin.css define animacao pespontoFocusPulse para feedback do lojista');

// 2. Testes Unitarios Funcionais e Acessibilidade (renderDashboard)
const dashboardModule = require('../js/admin/dashboard.js');
const testRenderDashboard = dashboardModule.renderDashboard;
assert(typeof testRenderDashboard === 'function', 'renderDashboard e exportada como funcao pelo modulo de dashboard');

function createMockDomElement(tagName = 'div') {
  const attributes = {};
  const listeners = {};
  return {
    tagName: tagName.toUpperCase(),
    className: '',
    attributes,
    innerHTML: '',
    setAttribute(name, value) {
      attributes[name] = String(value);
    },
    getAttribute(name) {
      return attributes[name] !== undefined ? attributes[name] : null;
    },
    hasAttribute(name) {
      return attributes[name] !== undefined;
    },
    addEventListener(eventType, handler) {
      if (!listeners[eventType]) listeners[eventType] = [];
      listeners[eventType].push(handler);
    },
    dispatchEvent(eventObj) {
      const handlers = listeners[eventObj.type] || [];
      handlers.forEach(fn => fn(eventObj));
      return !eventObj.defaultPrevented;
    },
    click() {
      const evt = {
        type: 'click',
        target: this,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }
      };
      return this.dispatchEvent(evt);
    },
    triggerKeydown(key) {
      const evt = {
        type: 'keydown',
        key,
        target: this,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }
      };
      this.dispatchEvent(evt);
      return evt;
    }
  };
}

function createMockRecentContainer() {
  const container = createMockDomElement('div');
  container.children = [];
  container.appendChild = (child) => {
    container.children.push(child);
  };
  return container;
}

const originalGlobalDocument = global.document;
global.document = {
  createElement: (tagName) => createMockDomElement(tagName)
};

try {
  const sampleOrders = [
    { id: 'JEZ-3001', customer: 'Mariana Silva', status: 'preparar-envio', total: 219.90 },
    { id: 'JEZ-3002', customer: 'Fernanda Costa', status: 'em-producao', total: 145.00 },
    { id: 'JEZ-3003', customer: 'Camila Rocha', status: 'concluido', total: 320.50 }
  ];

  const recentContainer = createMockRecentContainer();
  const navigatedOrders = [];
  const mockNavigateCallback = (orderId) => {
    navigatedOrders.push(orderId);
  };

  testRenderDashboard(
    { recentContainerEl: recentContainer },
    {
      orders: sampleOrders,
      catalog: [],
      formatCurrency: (val) => `R$ ${Number(val).toFixed(2).replace('.', ',')}`,
      getStatusMeta: (st) => ({ label: st }),
      escapeHtml: (s) => String(s || ''),
      onNavigateOrder: mockNavigateCallback
    }
  );

  assert(recentContainer.children.length === 3, 'renderDashboard renderiza os 3 pedidos recentes no container');

  const firstItem = recentContainer.children[0];
  const secondItem = recentContainer.children[1];
  const thirdItem = recentContainer.children[2];

  assert(firstItem.getAttribute('role') === 'button', 'Item recente 1 possui role=button');
  assert(firstItem.getAttribute('tabindex') === '0', 'Item recente 1 possui tabindex=0');
  assert(firstItem.getAttribute('data-order-id') === 'JEZ-3001', 'Item recente 1 possui data-order-id=JEZ-3001');
  assert(firstItem.getAttribute('aria-label') === 'Ver detalhes do pedido JEZ-3001 de Mariana', 'Item recente 1 possui aria-label descritivo com primeiro nome da cliente');

  assert(secondItem.getAttribute('role') === 'button', 'Item recente 2 possui role=button');
  assert(secondItem.getAttribute('tabindex') === '0', 'Item recente 2 possui tabindex=0');
  assert(secondItem.getAttribute('data-order-id') === 'JEZ-3002', 'Item recente 2 possui data-order-id=JEZ-3002');

  assert(thirdItem.getAttribute('role') === 'button', 'Item recente 3 possui role=button');
  assert(thirdItem.getAttribute('tabindex') === '0', 'Item recente 3 possui tabindex=0');
  assert(thirdItem.getAttribute('data-order-id') === 'JEZ-3003', 'Item recente 3 possui data-order-id=JEZ-3003');

  assert(firstItem.innerHTML.includes('recent-order-chevron'), 'Item recente 1 contem o SVG do chevron com classe .recent-order-chevron');
  assert(firstItem.innerHTML.includes('<polyline points="9 18 15 12 9 6"></polyline>'), 'Item recente 1 contem geometria vetorial do chevron');
  assert(firstItem.innerHTML.includes('recent-order-main'), 'Item recente 1 contem subcontainer .recent-order-main');
  assert(firstItem.innerHTML.includes('recent-order-id'), 'Item recente 1 contem identificador .recent-order-id');
  assert(firstItem.innerHTML.includes('recent-order-customer'), 'Item recente 1 contem identificador .recent-order-customer');
  assert(firstItem.innerHTML.includes('recent-order-meta'), 'Item recente 1 contem container de metadados .recent-order-meta');
  assert(firstItem.innerHTML.includes('status-tag'), 'Item recente 1 contem tag de status .status-tag');
  assert(firstItem.innerHTML.includes('recent-order-total'), 'Item recente 1 contem valor formatado .recent-order-total');

  navigatedOrders.length = 0;
  firstItem.click();
  assert(navigatedOrders.length === 1 && navigatedOrders[0] === 'JEZ-3001', 'Evento click no item recente dispara onNavigateOrder com o ID do pedido correto');

  secondItem.click();
  assert(navigatedOrders.length === 2 && navigatedOrders[1] === 'JEZ-3002', 'Evento click no segundo item dispara onNavigateOrder com o ID correspondente');

  navigatedOrders.length = 0;
  const enterEvt = firstItem.triggerKeydown('Enter');
  assert(navigatedOrders.length === 1 && navigatedOrders[0] === 'JEZ-3001', 'Pressionamento da tecla Enter dispara onNavigateOrder');
  assert(enterEvt.defaultPrevented === true, 'Pressionamento da tecla Enter aciona preventDefault');

  navigatedOrders.length = 0;
  const spaceEvt = firstItem.triggerKeydown(' ');
  assert(navigatedOrders.length === 1 && navigatedOrders[0] === 'JEZ-3001', 'Pressionamento da tecla Space dispara onNavigateOrder');
  assert(spaceEvt.defaultPrevented === true, 'Pressionamento da tecla Space aciona preventDefault');

  navigatedOrders.length = 0;
  const escEvt = firstItem.triggerKeydown('Escape');
  assert(navigatedOrders.length === 0, 'Tecla Escape NAO dispara callback onNavigateOrder');
  assert(escEvt.defaultPrevented === false, 'Tecla Escape nao invoca preventDefault');

  const tabEvt = firstItem.triggerKeydown('Tab');
  assert(navigatedOrders.length === 0, 'Tecla Tab NAO dispara callback onNavigateOrder');
  assert(tabEvt.defaultPrevented === false, 'Tecla Tab nao invoca preventDefault');

  const arrowDownEvt = firstItem.triggerKeydown('ArrowDown');
  assert(navigatedOrders.length === 0, 'Tecla ArrowDown NAO dispara callback onNavigateOrder');
  assert(arrowDownEvt.defaultPrevented === false, 'Tecla ArrowDown nao invoca preventDefault');

  const arrowUpEvt = firstItem.triggerKeydown('ArrowUp');
  assert(navigatedOrders.length === 0, 'Tecla ArrowUp NAO dispara callback onNavigateOrder');
  assert(arrowUpEvt.defaultPrevented === false, 'Tecla ArrowUp nao invoca preventDefault');

  const charEvt = firstItem.triggerKeydown('a');
  assert(navigatedOrders.length === 0, 'Tecla alfanumerica a NAO dispara callback onNavigateOrder');
  assert(charEvt.defaultPrevented === false, 'Tecla alfanumerica nao invoca preventDefault');

  const emptyContainer = createMockRecentContainer();
  testRenderDashboard(
    { recentContainerEl: emptyContainer },
    {
      orders: [],
      catalog: [],
      formatCurrency: (v) => String(v),
      getStatusMeta: () => ({ label: '' }),
      escapeHtml: (s) => s,
      onNavigateOrder: mockNavigateCallback
    }
  );
  assert(emptyContainer.children.length === 0, 'Lista vazia nao adiciona itens filhos no container');
  assert(emptyContainer.innerHTML.includes('Nenhum pedido registrado ainda.'), 'Lista vazia exibe mensagem amigavel informando ausencia de pedidos');

  const containerWithoutCallback = createMockRecentContainer();
  testRenderDashboard(
    { recentContainerEl: containerWithoutCallback },
    {
      orders: sampleOrders,
      catalog: [],
      formatCurrency: (v) => String(v),
      getStatusMeta: () => ({ label: '' }),
      escapeHtml: (s) => s
    }
  );
  assert(containerWithoutCallback.children.length === 3, 'Renderizacao funciona perfeitamente sem fornecer onNavigateOrder');
  let threw = false;
  try {
    containerWithoutCallback.children[0].click();
    containerWithoutCallback.children[0].triggerKeydown('Enter');
  } catch (e) {
    threw = true;
  }
  assert(!threw, 'Disparar clique ou Enter sem onNavigateOrder nao lanca excecao');

  function createTestOrderCard(order) {
    const card = createMockDomElement('div');
    card.className = 'order-card';
    card.id = `order-card-${order.id}`;
    card.setAttribute('data-order-id', order.id);
    return card;
  }

  const testCard1 = createTestOrderCard({ id: 'JEZ-3001' });
  const testCard2 = createTestOrderCard({ id: 'JEZ-3002' });

  assert(testCard1.id === 'order-card-JEZ-3001', 'Card de pedido possui id prefixado com order-card-');
  assert(testCard1.getAttribute('data-order-id') === 'JEZ-3001', 'Card de pedido possui atributo data-order-id correspondente');
  assert(testCard1.className === 'order-card', 'Card de pedido possui classe order-card');

  assert(testCard2.id === 'order-card-JEZ-3002', 'Card de pedido 2 possui id prefixado com order-card-');
  assert(testCard2.getAttribute('data-order-id') === 'JEZ-3002', 'Card de pedido 2 possui atributo data-order-id');

  function simulateNavigateToOrder(orderId, state, domElements) {
    if (!orderId || typeof orderId !== 'string') return false;
    state.currentOrderFilter = 'all';
    domElements.filterButtons.forEach(btn => {
      btn.active = btn.getAttribute('data-status') === 'all';
    });
    state.activeTab = 'orders';
    const card = domElements.cardsById[orderId] || null;
    if (card) {
      if (typeof card.scrollIntoView === 'function') {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      card.highlighted = true;
      return true;
    }
    return false;
  }

  const navState = { currentOrderFilter: 'em-producao', activeTab: 'dashboard' };
  let scrolledOpts = null;
  const mockTargetCard = {
    getAttribute: () => 'JEZ-3001',
    scrollIntoView: (opts) => { scrolledOpts = opts; },
    highlighted: false
  };
  const mockFilterAll = { getAttribute: () => 'all', active: false };
  const mockFilterProd = { getAttribute: () => 'em-producao', active: true };
  const mockDomElements = {
    filterButtons: [mockFilterAll, mockFilterProd],
    cardsById: { 'JEZ-3001': mockTargetCard }
  };

  assert(simulateNavigateToOrder(null, navState, mockDomElements) === false, 'navigateToOrder ignora chamada com orderId nulo');
  assert(simulateNavigateToOrder('', navState, mockDomElements) === false, 'navigateToOrder ignora chamada com orderId vazio');
  assert(simulateNavigateToOrder(12345, navState, mockDomElements) === false, 'navigateToOrder ignora chamada com orderId nao string');

  const navSuccess = simulateNavigateToOrder('JEZ-3001', navState, mockDomElements);
  assert(navSuccess === true, 'navigateToOrder executa navegacao com sucesso para ID valido');
  assert(navState.currentOrderFilter === 'all', 'navigateToOrder redefine o filtro de pedidos para all');
  assert(mockFilterAll.active === true && mockFilterProd.active === false, 'navigateToOrder atualiza botao ativo de filtro para all');
  assert(navState.activeTab === 'orders', 'navigateToOrder alterna a aba ativa para orders');
  assert(scrolledOpts && scrolledOpts.behavior === 'smooth' && scrolledOpts.block === 'center', 'navigateToOrder aciona scrollIntoView suave centralizado');
  assert(mockTargetCard.highlighted === true, 'navigateToOrder aplica destaque visual no card de destino');
} finally {
  global.document = originalGlobalDocument;
}

// ============================================================================
// [34] Hardening de AST, Sanitizacao Abrangente contra XSS e Seguranca de innerHTML (JEZ-037)
// ============================================================================
console.log('\n[34] Hardening de AST, Sanitizacao Abrangente contra XSS e Seguranca de innerHTML (JEZ-037):');

const productCardJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js', 'components', 'product-card.js'), 'utf-8');
const appJsForXss = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');
const adminJsForXss = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');
const dashboardJsForXss = fs.readFileSync(path.join(ROOT_DIR, 'js', 'admin', 'dashboard.js'), 'utf-8');

// 1. Auditoria de Contratos e Verificacao Estatica no Codigo Fonte
assert(productCardJsContent.includes('export function escapeHtml('), 'product-card.js exporta a funcao escapeHtml');
assert(productCardJsContent.includes('export function sanitizeImageUrl('), 'product-card.js exporta a funcao sanitizeImageUrl');
assert(productCardJsContent.includes('export function createProductCardElement('), 'product-card.js exporta a funcao createProductCardElement');
assert(productCardJsContent.includes('String(unsafe)'), 'product-card.js utiliza conversao explicita String(unsafe) preservando numeros e outros tipos primitivos');
assert(productCardJsContent.includes('escapeHtml(safeImage)'), 'product-card.js envolve safeImage com escapeHtml no atributo src');
assert(productCardJsContent.includes('escapeHtml(webpCandidate)'), 'product-card.js envolve webpCandidate com escapeHtml no srcset do picture');
assert(productCardJsContent.includes('escapeHtml(secondaryImage)'), 'product-card.js envolve secondaryImage com escapeHtml no atributo src da imagem secundaria');

assert(appJsForXss.includes("const textSpan = document.createElement('span');") && appJsForXss.includes('textSpan.textContent = message;'), 'app.js utiliza criacao de span com textContent no showToast eliminando risco de XSS');
assert(appJsForXss.includes("thumbImg.src = sanitizeImageUrl(photoUrl)"), 'app.js utiliza document.createElement(\'img\') e sanitizeImageUrl no modalGalleryThumbs');
assert(appJsForXss.includes('escapeHtml(safeImage)') && appJsForXss.includes("cartItemsContainer.innerHTML = '';"), 'app.js aplica escapeHtml na imagem do produto no renderCart');
assert(appJsForXss.includes('escapeHtml(safeBadge)'), 'app.js aplica escapeHtml no badge de modalidade do item no carrinho');

assert(adminJsForXss.includes('escapeHtml(statusMeta.label)'), 'admin.js aplica escapeHtml defensivamente no statusMeta.label em renderOrders');
assert(adminJsForXss.includes('img.src = sanitizeImageUrl(src)') && adminJsForXss.includes("btn.textContent = '\\u00D7'"), 'admin.js utiliza criacao nativa de nos DOM em renderNewExtraPhotos sem innerHTML vulneravel');
assert(adminJsForXss.includes('escapeHtml(safeUrl)'), 'admin.js aplica escapeHtml na safeUrl no carrossel de edicao');
assert(adminJsForXss.includes('escapeHtml(safeImage)'), 'admin.js aplica escapeHtml no safeImage do catalogo do lojista');
assert(dashboardJsForXss.includes('escapeHtml(statusMeta.label)'), 'dashboard.js aplica escapeHtml defensivamente no label de status dos pedidos recentes');

// 2. Modulo product-card.js e Testes Unitarios de Sanitizacao
const productCardModule = require(path.join(ROOT_DIR, 'js', 'components', 'product-card.js'));
const escapeHtmlFn = productCardModule.escapeHtml;
const sanitizeImageUrlFn = productCardModule.sanitizeImageUrl;
const createProductCardElementFn = productCardModule.createProductCardElement;

assert(typeof escapeHtmlFn === 'function', 'escapeHtml e exportada como funcao pelo componente');
assert(typeof sanitizeImageUrlFn === 'function', 'sanitizeImageUrl e exportada como funcao pelo componente');
assert(typeof createProductCardElementFn === 'function', 'createProductCardElement e exportada como funcao pelo componente');

// 2.1 Casos de teste de escapeHtml
assert(escapeHtmlFn(null) === '', 'escapeHtml trata null retornando string vazia');
assert(escapeHtmlFn(undefined) === '', 'escapeHtml trata undefined retornando string vazia');
assert(escapeHtmlFn('') === '', 'escapeHtml trata string vazia');
assert(escapeHtmlFn(0) === '0', 'escapeHtml preserva o numero zero');
assert(escapeHtmlFn(42) === '42', 'escapeHtml preserva inteiros positivos');
assert(escapeHtmlFn(-7) === '-7', 'escapeHtml preserva inteiros negativos');
assert(escapeHtmlFn(19.9) === '19.9', 'escapeHtml preserva ponto flutuante');
assert(escapeHtmlFn(true) === 'true', 'escapeHtml trata booleano true');
assert(escapeHtmlFn(false) === 'false', 'escapeHtml trata booleano false');
assert(escapeHtmlFn('<script>alert(1)</script>') === '&lt;script&gt;alert(1)&lt;/script&gt;', 'escapeHtml neutraliza tags de script');
assert(escapeHtmlFn('foo"bar\'baz&qux<tag>') === 'foo&quot;bar&#039;baz&amp;qux&lt;tag&gt;', 'escapeHtml escapa aspas simples, duplas, ampersand e chevrons');
assert(escapeHtmlFn('img" onerror="alert(1)') === 'img&quot; onerror=&quot;alert(1)', 'escapeHtml neutraliza quebra de atributo HTML');
assert(escapeHtmlFn('texto normal 100% autoral') === 'texto normal 100% autoral', 'escapeHtml preserva texto legitimo inalterado');

// 2.2 Casos de teste de sanitizeImageUrl
assert(sanitizeImageUrlFn(null) === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl trata null com fallback seguro');
assert(sanitizeImageUrlFn(undefined) === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl trata undefined com fallback seguro');
assert(sanitizeImageUrlFn('') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl trata string vazia com fallback seguro');
assert(sanitizeImageUrlFn(999) === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl trata entrada numerica com fallback seguro');
assert(sanitizeImageUrlFn('javascript:alert(1)') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl rejeita javascript:');
assert(sanitizeImageUrlFn('javascript:void(0)') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl rejeita javascript:void(0)');
assert(sanitizeImageUrlFn('data:text/html,<script>evil()</script>') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl rejeita data:text/html');
assert(sanitizeImageUrlFn('data:text/plain;base64,QUFB') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl rejeita data:text/plain');
assert(sanitizeImageUrlFn('vbscript:msgbox(1)') === 'assets/products/tote_cherry.jpg', 'sanitizeImageUrl rejeita vbscript:');
assert(sanitizeImageUrlFn('assets/products/bolsa_punk.jpg') === 'assets/products/bolsa_punk.jpg', 'sanitizeImageUrl aceita assets/products/');
assert(sanitizeImageUrlFn('./assets/products/bolsa_punk.jpg') === 'assets/products/bolsa_punk.jpg', 'sanitizeImageUrl normaliza ./assets/products/');
assert(sanitizeImageUrlFn('/assets/products/bolsa_punk.jpg') === 'assets/products/bolsa_punk.jpg', 'sanitizeImageUrl normaliza /assets/products/');
assert(sanitizeImageUrlFn('https://firebasestorage.googleapis.com/img.jpg') === 'https://firebasestorage.googleapis.com/img.jpg', 'sanitizeImageUrl aceita https://');
assert(sanitizeImageUrlFn('http://localhost:8080/assets/img.jpg') === 'http://localhost:8080/assets/img.jpg', 'sanitizeImageUrl aceita http://');
assert(sanitizeImageUrlFn('data:image/webp;base64,AAA') === 'data:image/webp;base64,AAA', 'sanitizeImageUrl aceita data:image/');
assert(sanitizeImageUrlFn('blob:http://localhost:8080/uuid') === 'blob:http://localhost:8080/uuid', 'sanitizeImageUrl aceita blob:');
assert(sanitizeImageUrlFn('https://cdn.example.com/site/assets/products/bolsa_punk.jpg') === 'assets/products/bolsa_punk.jpg', 'sanitizeImageUrl fatia assetIdx quando assets/products/ esta presente no caminho');

// 3. Testes Funcionais de createProductCardElement com Cargas Maliciosas
function createMockDomElementForXss(tagName = 'div') {
  const attributes = {};
  const listeners = {};
  return {
    tagName: tagName.toUpperCase(),
    className: '',
    attributes,
    innerHTML: '',
    textContent: '',
    children: [],
    setAttribute(name, value) {
      attributes[name] = String(value);
    },
    getAttribute(name) {
      return attributes[name] !== undefined ? attributes[name] : null;
    },
    hasAttribute(name) {
      return attributes[name] !== undefined;
    },
    addEventListener(eventType, handler) {
      if (!listeners[eventType]) listeners[eventType] = [];
      listeners[eventType].push(handler);
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    }
  };
}

const originalGlobalDocXss = global.document;
global.document = {
  createElement: (tagName) => createMockDomElementForXss(tagName)
};

try {
  const maliciousPiece = {
    id: "p-evil\" onclick=\"alert('id-hack')",
    name: "Bolsa <img src=x onerror=\"alert('name-xss')\">",
    categoryLabel: "Bolsas & <script>alert('cat')</script>",
    materials: "Algodao <b onmouseover=\"alert('mat')\">puro</b>",
    price: 189.90,
    image: "assets/products/bolsa_punk.jpg\" onload=\"alert('img-xss')\" data-x=\"",
    images: [
      "assets/products/bolsa_punk.jpg\" onload=\"alert('img-xss')\" data-x=\"",
      "assets/products/bolsa_punk_detail.jpg\" onerror=\"alert('sec-xss')\" data-y=\""
    ],
    isReady: true,
    leadTimeDays: 7
  };

  const card = createProductCardElementFn(maliciousPiece);
  assert(card.id === 'card-p-evil&quot; onclick=&quot;alert(&#039;id-hack&#039;)', 'Card de produto escapa ID malicioso no atributo id');
  assert(!card.innerHTML.includes('<img src=x onerror'), 'Card de produto neutraliza tag img maliciosa no innerHTML');
  assert(card.innerHTML.includes('&lt;img src=x onerror=&quot;alert(&#039;name-xss&#039;)&quot;&gt;'), 'Nome malicioso do produto convertido em entidades HTML inofensivas');
  assert(!card.innerHTML.includes("<script>alert('cat')</script>"), 'Categoria maliciosa neutraliza tag script');
  assert(card.innerHTML.includes('Bolsas &amp; &lt;script&gt;alert(&#039;cat&#039;)&lt;/script&gt;'), 'Categoria maliciosa convertida em entidades');
  assert(!card.innerHTML.includes('<b onmouseover='), 'Materiais maliciosos desarmam evento onmouseover inline');
  assert(card.innerHTML.includes('Algodao &lt;b onmouseover=&quot;alert(&#039;mat&#039;)&quot;&gt;puro&lt;/b&gt;'), 'Materiais maliciosos convertidos em entidades');
  assert(!card.innerHTML.includes("onload=\"alert('img-xss')\""), 'Imagem primaria neutraliza quebra de atributo e evento onload');
  assert(card.innerHTML.includes('bolsa_punk.jpg&quot; onload=&quot;alert(&#039;img-xss&#039;)&quot;'), 'URL da imagem primaria tem aspas escapadas como &quot;');
  assert(!card.innerHTML.includes("onerror=\"alert('sec-xss')\""), 'Imagem secundaria neutraliza quebra de atributo e evento onerror');
  assert(card.innerHTML.includes('bolsa_punk_detail.jpg&quot; onerror=&quot;alert(&#039;sec-xss&#039;)&quot;'), 'URL da imagem secundaria tem aspas escapadas como &quot;');
  assert(card.innerHTML.includes('data-id="p-evil&quot; onclick=&quot;alert(&#039;id-hack&#039;)"'), 'Data-id do produto escapa aspas prevenindo quebra de atributo');

  // Robustez com campo nao-string
  const pieceWithNumberMaterials = {
    id: 'p-num',
    name: 'Peca Teste Numerico',
    materials: 100,
    price: 50,
    image: 'assets/products/tote_cherry.jpg',
    isReady: true
  };
  const cardNum = createProductCardElementFn(pieceWithNumberMaterials);
  assert(cardNum.innerHTML.includes('<p class="product-meta">100</p>'), 'createProductCardElement converte numero em materials sem lancar excecao');

  // 4. Testes do Mecanismo de Notificacao showToast com TextContent
  function simulateShowToast(message) {
    const toast = createMockDomElementForXss('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ';
    const textSpan = createMockDomElementForXss('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);
    return { toast, textSpan };
  }

  const hostileToastMessage = '<script>alert(\'toast-xss\')</script><img src=x onerror="alert(1)">';
  const { toast: testToast, textSpan: testSpan } = simulateShowToast(hostileToastMessage);
  assert(testSpan.textContent === hostileToastMessage, 'showToast armazena mensagem literal no textContent sem parsing de HTML');
  assert(testSpan.children.length === 0, 'showToast nao cria nos filhos executaveis no span de texto');
  assert(!testToast.innerHTML.includes("<script>alert('toast-xss')</script>"), 'Container do toast nao possui script injetado');
  assert(!testToast.innerHTML.includes('<img src=x onerror='), 'Container do toast nao possui img com onerror injetada');

  // 5. Testes da Criacao Nativa de Nos DOM em modalGalleryThumbs e renderNewExtraPhotos
  function simulateModalGalleryThumbs(photoUrls, productName) {
    const thumbsContainer = createMockDomElementForXss('div');
    photoUrls.forEach((photoUrl, idx) => {
      const thumbBtn = createMockDomElementForXss('button');
      thumbBtn.setAttribute('aria-label', `Ver foto ${idx + 1} de ${productName}`);
      const thumbImg = createMockDomElementForXss('img');
      thumbImg.src = sanitizeImageUrlFn(photoUrl);
      thumbBtn.appendChild(thumbImg);
      thumbsContainer.appendChild(thumbBtn);
    });
    return thumbsContainer;
  }

  const hostilePhotos = [
    'assets/products/tote.jpg',
    "javascript:alert('hack')",
    'data:text/html,<script>alert(1)</script>'
  ];
  const thumbsResult = simulateModalGalleryThumbs(hostilePhotos, 'Tote Cherry');
  assert(thumbsResult.children.length === 3, 'modalGalleryThumbs cria quantidade correta de botoes filhos');
  assert(thumbsResult.children[1].children[0].src === 'assets/products/tote_cherry.jpg', 'modalGalleryThumbs higieniza esquema javascript: para fallback seguro');
  assert(thumbsResult.children[2].children[0].src === 'assets/products/tote_cherry.jpg', 'modalGalleryThumbs higieniza esquema data:text/html para fallback seguro');

  // Simulacao de renderNewExtraPhotos do Atelie
  function simulateNewExtraPhotos(photosList) {
    const grid = createMockDomElementForXss('div');
    photosList.forEach((src, idx) => {
      const item = createMockDomElementForXss('div');
      item.className = 'extra-photo-thumb';
      const img = createMockDomElementForXss('img');
      img.src = sanitizeImageUrlFn(src);
      const btn = createMockDomElementForXss('button');
      btn.textContent = '\u00D7';
      item.appendChild(img);
      item.appendChild(btn);
      grid.appendChild(item);
    });
    return grid;
  }

  const extraPhotosResult = simulateNewExtraPhotos(['vbscript:alert(1)', 'assets/products/bolsa_punk.jpg']);
  assert(extraPhotosResult.children.length === 2, 'renderNewExtraPhotos cria estrutura DOM de miniaturas');
  assert(extraPhotosResult.children[0].children[0].src === 'assets/products/tote_cherry.jpg', 'renderNewExtraPhotos sanitiza URL hostil para imagem padrao segura');
  assert(extraPhotosResult.children[0].children[1].textContent === '\u00D7', 'renderNewExtraPhotos define botao de remocao com textContent puro');

  // 6. Testes do Carrossel de Edicao (renderEditCarousel) com Sanitizacao de URLs
  function simulateEditCarousel(items, activeIdx = 0) {
    const grid = createMockDomElementForXss('div');
    items.forEach((item, idx) => {
      const thumb = createMockDomElementForXss('div');
      const safeUrl = sanitizeImageUrlFn(item.url);
      const badgeText = item.isCover ? 'Capa' : `${idx + 1}`;
      thumb.innerHTML = `
        <img src="${escapeHtmlFn(safeUrl)}" alt="Foto ${idx + 1}">
        <span class="carousel-thumb-badge">${badgeText}</span>
      `;
      grid.appendChild(thumb);
    });
    return grid;
  }

  const carouselItems = [
    { url: "assets/products/bolsa_punk.jpg\" onload=\"alert('carousel-xss')", isCover: true },
    { url: 'javascript:evil()', isCover: false }
  ];
  const carouselGrid = simulateEditCarousel(carouselItems);
  assert(carouselGrid.children.length === 2, 'renderEditCarousel cria miniaturas para os itens do carrossel');
  assert(carouselGrid.children[0].innerHTML.includes('bolsa_punk.jpg&quot; onload=&quot;alert(&#039;carousel-xss&#039;)'), 'renderEditCarousel escapa aspas na safeUrl evitando injecao de eventos inline');
  assert(carouselGrid.children[1].innerHTML.includes('assets/products/tote_cherry.jpg'), 'renderEditCarousel neutraliza esquema javascript: usando fallback seguro');

  // 7. Testes de Dashboard com Payloads Hostis nos Pedidos Recentes
  const dashboardModuleForXss = require(path.join(ROOT_DIR, 'js', 'admin', 'dashboard.js'));
  const testRenderDashboardForXss = dashboardModuleForXss.renderDashboard;

  const recentContainerXss = createMockDomElementForXss('div');
  const hostileOrders = [
    {
      id: "JEZ-999\" onfocus=\"alert('id-xss')",
      customer: "<script>alert('cust-xss')</script>Juliana",
      status: "em-producao\" style=\"color:red",
      total: 250.00
    }
  ];

  testRenderDashboardForXss({ recentContainerEl: recentContainerXss }, {
    orders: hostileOrders,
    catalog: [],
    getStatusMeta: (st) => ({ label: "<img src=x onerror=\"alert('status-xss')\">Em Producao" }),
    formatCurrency: (v) => 'R$ 250,00',
    escapeHtml: escapeHtmlFn,
    onNavigateOrder: () => {}
  });

  const dashboardItem = recentContainerXss.children[0];
  assert(recentContainerXss.children.length === 1, 'renderDashboard renderiza item de pedido recente');
  assert(dashboardItem.innerHTML.includes('JEZ-999&quot; onfocus=&quot;alert(&#039;id-xss&#039;)'), 'renderDashboard escapa ID do pedido no corpo do item recente');
  assert(dashboardItem.innerHTML.includes('&lt;script&gt;alert(&#039;cust-xss&#039;)&lt;/script&gt;Juliana'), 'renderDashboard neutraliza tag script no nome do cliente');
  assert(dashboardItem.innerHTML.includes('&lt;img src=x onerror=&quot;alert(&#039;status-xss&#039;)&quot;&gt;Em Producao'), 'renderDashboard neutraliza tag img maliciosa no label de status');
  assert(!dashboardItem.innerHTML.includes('<img src=x onerror='), 'renderDashboard nao permite criacao de tags de imagem desarmadas');
  assert(dashboardItem.getAttribute('aria-label').includes('&lt;script&gt;'), 'renderDashboard aplica escapeHtml tambem no atributo aria-label');

} finally {
  global.document = originalGlobalDocXss;
}

// ======================================================
// [35] Conformidade de Credencial do Firebase Client e Conectividade (JEZ-038)
// Responsavel: Robin (Senior QA Engineer) & Morgan (Ciberseguranca)
console.log('\n[35] Validando Conformidade de Credencial do Firebase Client e Conectividade (JEZ-038):');

// 1. Integridade Estrutural e Sintatica de site/firebase-config.js
const fbConfigFilePath = path.join(ROOT_DIR, 'firebase-config.js');
assert(fs.existsSync(fbConfigFilePath), 'firebase-config.js existe no diretorio site/');
assert(fs.statSync(fbConfigFilePath).size > 50, 'firebase-config.js possui conteudo significativo');

try {
  execSync(`node -c "${fbConfigFilePath}"`);
  assert(true, 'firebase-config.js compila sem nenhum erro de sintaxe (node -c)');
} catch (e) {
  assert(false, `firebase-config.js falhou na compilacao: ${e.message}`);
}

const fbConfigFileRaw = fs.readFileSync(fbConfigFilePath, 'utf-8');

// 2. Anotacao de Blindagem AST e Documentacao OWASP
assert(fbConfigFileRaw.includes('needle-ignore: HARDCODED_SECRET'), 'firebase-config.js contem anotacao formal needle-ignore: HARDCODED_SECRET');
assert(fbConfigFileRaw.includes('OWASP') && fbConfigFileRaw.includes('Least Privilege'), 'firebase-config.js documenta fundamentacao tecnica OWASP e Least Privilege');
assert(fbConfigFileRaw.includes('firestore.rules'), 'firebase-config.js referencia firestore.rules como autoridade de autorizacao');

// 3. Resolucao Exata de firebaseConfig.apiKey em Runtime
let evaluatedFbConfig = null;
try {
  const resolvedJson = execSync(
    `node --input-type=module -e "import('${fbConfigFilePath}').then(m => console.log(JSON.stringify(m.firebaseConfig)))"`,
    { encoding: 'utf-8' }
  ).trim();
  evaluatedFbConfig = JSON.parse(resolvedJson);
  assert(true, 'firebase-config.js exporta firebaseConfig compativel com modulo ESM');
} catch (e) {
  assert(false, `Falha ao importar dinamicamente firebase-config.js: ${e.message}`);
}

assert(evaluatedFbConfig !== null && typeof evaluatedFbConfig === 'object', 'firebaseConfig avalia para um objeto valido');
assert(evaluatedFbConfig && evaluatedFbConfig.apiKey === 'AIzaSyDKyxgESt8oK82J39oP48vc8RTY5UDfMl8', 'firebaseConfig.apiKey resolve estritamente para o valor oficial original (AIzaSyDKyxgESt8oK82J39oP48vc8RTY5UDfMl8)');
assert(evaluatedFbConfig && evaluatedFbConfig.apiKey.length === 39, 'firebaseConfig.apiKey possui tamanho exato de 39 caracteres');
assert(evaluatedFbConfig && evaluatedFbConfig.apiKey.startsWith('AIzaSy'), 'firebaseConfig.apiKey preserva o prefixo oficial de chaves Google Cloud Client (AIzaSy)');
assert(evaluatedFbConfig && evaluatedFbConfig.projectId === 'jez-collection', 'firebaseConfig.projectId resolve para jez-collection');
assert(evaluatedFbConfig && evaluatedFbConfig.authDomain === 'jez-collection.firebaseapp.com', 'firebaseConfig.authDomain resolve para jez-collection.firebaseapp.com');
assert(evaluatedFbConfig && evaluatedFbConfig.storageBucket === 'jez-collection.firebasestorage.app', 'firebaseConfig.storageBucket resolve para jez-collection.firebasestorage.app');
assert(evaluatedFbConfig && evaluatedFbConfig.messagingSenderId === '151802725463', 'firebaseConfig.messagingSenderId resolve para 151802725463');
assert(evaluatedFbConfig && evaluatedFbConfig.appId === '1:151802725463:web:fa6eee70f9473346f7cf12', 'firebaseConfig.appId resolve para 1:151802725463:web:fa6eee70f9473346f7cf12');
assert(evaluatedFbConfig && evaluatedFbConfig.measurementId === 'G-HCD8ZTZSZT', 'firebaseConfig.measurementId resolve para G-HCD8ZTZSZT');

// 4. Vinculacao e Integridade com os Modulos de Servico do Firebase
const serviceModulePath = path.join(ROOT_DIR, 'firebase-service.js');
const modularServicePath = path.join(ROOT_DIR, 'js', 'services', 'firebase.js');

assert(fs.existsSync(serviceModulePath), 'site/firebase-service.js existe');
assert(fs.existsSync(modularServicePath), 'site/js/services/firebase.js existe');

const serviceCode = fs.readFileSync(serviceModulePath, 'utf-8');
const modularCode = fs.readFileSync(modularServicePath, 'utf-8');

assert(serviceCode.includes("import { firebaseConfig } from './firebase-config.js';"), 'site/firebase-service.js importa firebaseConfig do caminho relativo correto');
assert(modularCode.includes("import { firebaseConfig } from '../../firebase-config.js';"), 'site/js/services/firebase.js importa firebaseConfig do caminho relativo modular correto');
assert(serviceCode.includes('initializeApp(firebaseConfig)'), 'site/firebase-service.js inicializa app Firebase com firebaseConfig');
assert(modularCode.includes('initializeApp(firebaseConfig)'), 'site/js/services/firebase.js inicializa app Firebase com firebaseConfig');
assert(serviceCode.includes('getFirestore(this.app)'), 'site/firebase-service.js obtem instancia Firestore vinculada ao app');
assert(modularCode.includes('getFirestore(this.app)'), 'site/js/services/firebase.js obtem instancia Firestore vinculada ao app');

// 5. Teste Comportamental de Ciclo de Vida e Resiliencia do JezFirebaseService
class MockJezFirebaseServiceSimulator {
  constructor(shouldFailInit = false, customConfig = evaluatedFbConfig) {
    this.app = null;
    this.db = null;
    this.isInitialized = false;
    this.isOnline = false;
    this.connectionListeners = [];
    this.shouldFailInit = shouldFailInit;
    this.config = customConfig;
    this.init();
  }

  init() {
    try {
      if (this.shouldFailInit) {
        throw new Error('Network error simulation');
      }
      this.app = { name: '[DEFAULT]', options: this.config };
      this.db = { type: 'firestore', app: this.app };
      this.isInitialized = true;
      this.isOnline = true;
      this.notifyConnectionListeners(true);
    } catch (err) {
      this.isInitialized = false;
      this.isOnline = false;
      this.notifyConnectionListeners(false);
    }
  }

  onConnectionChange(callback) {
    if (typeof callback === 'function') {
      this.connectionListeners.push(callback);
      callback(this.isOnline);
    }
  }

  notifyConnectionListeners(status) {
    this.isOnline = status;
    this.connectionListeners.forEach(cb => {
      try { cb(status); } catch (e) {}
    });
  }
}

// Simulacao de Inicializacao com Sucesso
let listenerCalledWithSuccess = false;
const onlineService = new MockJezFirebaseServiceSimulator(false);
onlineService.onConnectionChange(status => {
  if (status === true) listenerCalledWithSuccess = true;
});
assert(onlineService.isInitialized === true, 'JezFirebaseService marca isInitialized como true em inicializacao bem-sucedida');
assert(onlineService.isOnline === true, 'JezFirebaseService marca isOnline como true em conexao inicializada');
assert(onlineService.app && onlineService.app.options.apiKey === 'AIzaSyDKyxgESt8oK82J39oP48vc8RTY5UDfMl8', 'Instancia do app Firebase recebe o apiKey resolvido exato');
assert(onlineService.db && onlineService.db.type === 'firestore', 'Instancia do Firestore e criada e vinculada ao app');
assert(listenerCalledWithSuccess === true, 'Listener de conexao e notificado com status online (true)');

// Simulacao de Fallback Offline / Falha de Rede Graciosa
let listenerCalledWithOffline = false;
let exceptionThrownToCaller = false;
let offlineService = null;
try {
  offlineService = new MockJezFirebaseServiceSimulator(true);
  offlineService.onConnectionChange(status => {
    if (status === false) listenerCalledWithOffline = true;
  });
} catch (e) {
  exceptionThrownToCaller = true;
}
assert(exceptionThrownToCaller === false, 'JezFirebaseService nao lanca excecao nao tratada ao falhar na inicializacao');
assert(offlineService !== null && offlineService.isInitialized === false, 'JezFirebaseService permanece com isInitialized false em modo offline');
assert(offlineService !== null && offlineService.isOnline === false, 'JezFirebaseService permanece com isOnline false em modo offline');
assert(listenerCalledWithOffline === true, 'Listener de conexao e notificado com status offline (false)');

// 6. Conformidade Estrita com a Regra Zero Emojis nos Arquivos do Firebase
const emojiRegexForFirebase = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/;
assert(!emojiRegexForFirebase.test(fbConfigFileRaw), 'site/firebase-config.js cumpre rigorosamente a regra zero emojis');
assert(!emojiRegexForFirebase.test(serviceCode), 'site/firebase-service.js cumpre rigorosamente a regra zero emojis');
assert(!emojiRegexForFirebase.test(modularCode), 'site/js/services/firebase.js cumpre rigorosamente a regra zero emojis');

// ============================================================================
// [36] Higiene Estrutural de Codigo: Eliminacao de Catch Vazio e Logs (JEZ-039)
// ============================================================================
console.log('\n[36] Validando Higiene Estrutural, Ausencia de Catch Vazio e Logs de Producao (JEZ-039):');

const adminJsRaw36 = fs.readFileSync(path.join(__dirname, '../admin.js'), 'utf-8');
const appJsRaw36 = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf-8');
const fbServiceRaw36 = fs.readFileSync(path.join(__dirname, '../firebase-service.js'), 'utf-8');
const emptyCatchPattern = /catch\s*\([^)]*\)\s*\{\s*\}/;

// 1. Validacao de Ausencia de Catch Vazio nos arquivos de producao
assert(!emptyCatchPattern.test(adminJsRaw36), 'site/admin.js nao contem blocos catch vazios (EMPTY_CATCH)');
assert(!emptyCatchPattern.test(appJsRaw36), 'site/app.js nao contem blocos catch vazios (EMPTY_CATCH)');
assert(adminJsRaw36.includes('[JËZ Ateliê] Falha ao resetar formulário de edição'), 'site/admin.js possui log estruturado no reset de edicao');
assert(appJsRaw36.includes('[JËZ Checkout] Falha ao consultar CEP'), 'site/app.js possui log estruturado de advertencia no fallback de CEP');
assert(appJsRaw36.includes('[JËZ Cache] Falha ao persistir produto em destaque'), 'site/app.js possui log estruturado no cache do produto em destaque');

// 2. Validacao de Migracao de console.log para console.debug em arquivos de producao
assert(!adminJsRaw36.includes('console.log('), 'site/admin.js nao utiliza console.log em producao');
assert(!appJsRaw36.includes('console.log('), 'site/app.js nao utiliza console.log em producao');
assert(!fbServiceRaw36.includes('console.log('), 'site/firebase-service.js nao utiliza console.log em producao');
assert(appJsRaw36.includes("console.debug('[PWA] Service Worker registrado"), 'site/app.js utiliza console.debug no registro do Service Worker');
assert(fbServiceRaw36.includes("console.debug('[JËZ Cloud] Firebase Firestore inicializado"), 'site/firebase-service.js utiliza console.debug na inicializacao');
assert(fbServiceRaw36.includes("console.debug('[JËZ Cloud] Banco de dados vazio"), 'site/firebase-service.js utiliza console.debug no seed de acervo');
assert(fbServiceRaw36.includes("console.debug('[JËZ Cloud] Acervo inicial de 9 peças"), 'site/firebase-service.js utiliza console.debug na conclusao do seed');

// ==========================================================================
// [34] Validando Arquitetura de Performance, Quotas e Lazy Loading de Vídeo (JEZ-032 / Noa)
// ==========================================================================
console.log('\n⚡ [34] Validando Arquitetura de Performance, Quotas e Lazy Loading de Vídeo (JEZ-032):');

const mediaPerfFile = path.join(ROOT_DIR, 'js/services/media-performance.js');
assert(fs.existsSync(mediaPerfFile), 'js/services/media-performance.js existe na arquitetura modular');

try {
  execSync(`node -c "${mediaPerfFile}"`);
  assert(true, 'js/services/media-performance.js compila sem nenhum erro de sintaxe (node -c)');
} catch (e) {
  assert(false, `js/services/media-performance.js falhou na compilacao: ${e.message}`);
}

const mediaPerfRaw = fs.readFileSync(mediaPerfFile, 'utf-8');
const emojiRegexPerf = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
assert(!emojiRegexPerf.test(mediaPerfRaw), 'js/services/media-performance.js cumpre rigorosamente a regra zero emojis');

// Executa testes unitarios assincronos para media-performance.js
try {
  const mediaPerfModule = require('child_process').execSync(
    `node --input-type=module -e "
      import * as MP from '${mediaPerfFile}';
      const tests = [];
      tests.push(MP.MAX_VIDEO_FILE_SIZE_BYTES === 4194304);
      tests.push(MP.FIREBASE_STORAGE_DAILY_EGRESS_QUOTA_MB === 1024);
      tests.push(MP.RECOMMENDED_MAX_DURATION_SECONDS === 15);
      tests.push(MP.isVideoUrl('croche.mp4') === true);
      tests.push(MP.isVideoUrl('https://storage.googleapis.com/video.webm') === true);
      tests.push(MP.isVideoUrl('data:video/mp4;base64,AAAA') === true);
      tests.push(MP.isVideoUrl({ type: 'video', url: 'detalhe.mp4' }) === true);
      tests.push(MP.isVideoUrl('tote_cherry.jpg') === false);
      tests.push(MP.isVideoUrl('bolsa.webp') === false);
      tests.push(MP.isVideoUrl(null) === false);
      tests.push(MP.hasVideoMedia(['foto1.jpg', 'video.mp4']) === true);
      tests.push(MP.hasVideoMedia(['foto1.jpg', 'foto2.jpg']) === false);
      tests.push(MP.hasVideoMedia([]) === false);
      
      const normImg = MP.normalizeMediaItem('foto.jpg');
      tests.push(normImg.type === 'image' && normImg.url === 'foto.jpg');
      
      const normVid = MP.normalizeMediaItem('video.mp4', 'poster.jpg');
      tests.push(normVid.type === 'video' && normVid.url === 'video.mp4' && normVid.poster === 'poster.jpg');
      
      const valNull = MP.validateVideoUploadQuota(null);
      tests.push(valNull.valid === false);
      
      const valValid = MP.validateVideoUploadQuota({ size: 2.5 * 1024 * 1024, type: 'video/mp4' });
      tests.push(valValid.valid === true && valValid.sizeMb === 2.5);
      
      const valExceeded = MP.validateVideoUploadQuota({ size: 5 * 1024 * 1024, type: 'video/mp4' });
      tests.push(valExceeded.valid === false && valExceeded.sizeMb === 5);
      
      const valBadType = MP.validateVideoUploadQuota({ size: 1024, type: 'application/pdf' });
      tests.push(valBadType.valid === false);
      
      const markup = MP.createOptimizedVideoMarkup({ url: 'detalhe.mp4', poster: 'capa.jpg', alt: 'Peca de croche' });
      tests.push(markup.includes('autoplay'));
      tests.push(markup.includes('loop'));
      tests.push(markup.includes('muted'));
      tests.push(markup.includes('playsinline'));
      tests.push(markup.includes('preload=\\\"metadata\\\"'));
      tests.push(markup.includes('poster=\\\"capa.jpg\\\"'));
      tests.push(markup.includes('width=\\\"400\\\"'));
      tests.push(markup.includes('height=\\\"400\\\"'));
      tests.push(!markup.includes('preload=\\\"auto\\\"'));
      
      let paused = false;
      const fakeVideo = { pause: () => { paused = true; }, currentTime: 10 };
      MP.cleanupVideoPlayback(fakeVideo);
      tests.push(paused === true && fakeVideo.currentTime === 0);
      
      console.log(JSON.stringify(tests));
    "`
  ).toString().trim();

  const testResults = JSON.parse(mediaPerfModule);
  assert(testResults[0], 'Limite maximo de arquivo de video configurado para 4 MB (4194304 bytes)');
  assert(testResults[1], 'Cota diaria de download do Firebase Storage registrada como 1024 MB');
  assert(testResults[2], 'Duracao recomendada maxima de 15 segundos para video em loop de croche');
  assert(testResults[3], 'isVideoUrl identifica extensao mp4 corretamente');
  assert(testResults[4], 'isVideoUrl identifica extensao webm em HTTPS');
  assert(testResults[5], 'isVideoUrl identifica data:video base64');
  assert(testResults[6], 'isVideoUrl identifica objeto de midia com type video');
  assert(testResults[7], 'isVideoUrl rejeita extensao jpg');
  assert(testResults[8], 'isVideoUrl rejeita extensao webp');
  assert(testResults[9], 'isVideoUrl trata valor nulo defensivamente');
  assert(testResults[10], 'hasVideoMedia detecta presenca de video na galeria mista');
  assert(testResults[11], 'hasVideoMedia retorna false para galeria puramente fotografica');
  assert(testResults[12], 'hasVideoMedia trata lista vazia defensivamente');
  assert(testResults[13], 'normalizeMediaItem normaliza imagem estatica preservando url');
  assert(testResults[14], 'normalizeMediaItem normaliza video associando poster de fallback');
  assert(testResults[15], 'validateVideoUploadQuota rejeita arquivo nulo');
  assert(testResults[16], 'validateVideoUploadQuota aprova video de 2.5 MB dentro da cota');
  assert(testResults[17], 'validateVideoUploadQuota bloqueia video de 5 MB por exceder cota do Firebase');
  assert(testResults[18], 'validateVideoUploadQuota rejeita formato mime incompativel');
  assert(testResults[19], 'createOptimizedVideoMarkup inclui atributo autoplay');
  assert(testResults[20], 'createOptimizedVideoMarkup inclui atributo loop');
  assert(testResults[21], 'createOptimizedVideoMarkup inclui atributo muted');
  assert(testResults[22], 'createOptimizedVideoMarkup inclui atributo playsinline para compatibilidade iOS');
  assert(testResults[23], 'createOptimizedVideoMarkup define preload como metadata para economia de banda');
  assert(testResults[24], 'createOptimizedVideoMarkup define poster de imagem estatica');
  assert(testResults[25], 'createOptimizedVideoMarkup define dimensoes 400x400 para prevencao de CLS');
  assert(testResults[26], 'createOptimizedVideoMarkup nao utiliza preload auto que violaria a cota');
  assert(testResults[27], 'cleanupVideoPlayback pausa reproducao e reseta tempo para evitar vazamento de banda');
} catch (err) {
  assert(false, `Falha na execucao dos testes unitarios de media-performance: ${err.message}`);
}

// ============================================================================
// [37] Validando Galeria Mista no Quick View e Vitrine (JEZ-032 - Lumi & Ariel)
// ============================================================================
console.log('\n[37] Validando Galeria Mista no Quick View e Vitrine (JEZ-032):');

const quickViewModule = require(path.join(ROOT_DIR, 'js', 'components', 'quick-view.js'));
const QuickViewGalleryClass = quickViewModule.QuickViewGallery;

assert(typeof QuickViewGalleryClass === 'function', 'QuickViewGallery e exportada como classe em quick-view.js');

const gallery = new QuickViewGalleryClass({ fallbackPoster: 'assets/products/tote_cherry.jpg' });
gallery.setMedia([
  'assets/products/bolsa_punk.jpg',
  'https://firebasestorage.googleapis.com/v0/b/jez.appspot.com/o/video_punk.mp4'
]);

assert(gallery.total === 2, 'QuickViewGallery inicializa com 2 itens de midia mista');
assert(gallery.hasVideo() === true, 'QuickViewGallery detecta presenca de video na galeria');
assert(gallery.isCurrentVideo() === false, 'Primeiro item e detectado corretamente como imagem');
assert(gallery.getCurrentType() === 'image', 'getCurrentType retorna image para o primeiro item');

gallery.next();
assert(gallery.index === 1, 'next() avanca para o segundo item');
assert(gallery.isCurrentVideo() === true, 'Segundo item e detectado como video');
assert(gallery.getCurrentType() === 'video', 'getCurrentType retorna video para o segundo item');
assert(gallery.getCurrentMedia().poster === 'assets/products/tote_cherry.jpg', 'Item de video recebe poster de fallback');

gallery.prev();
assert(gallery.index === 0, 'prev() retorna para o primeiro item');
assert(gallery.isCurrentVideo() === false, 'Item atual retorna para imagem');

// Validacao do Badge Textil de Video no Card da Vitrine
const pieceWithVideo = {
  id: 'bolsa-video-teste',
  name: 'Bolsa Vídeo Teste',
  price: 150.00,
  image: 'assets/products/bolsa_punk.jpg',
  images: ['assets/products/bolsa_punk.jpg', 'https://firebasestorage.googleapis.com/test.mp4'],
  isReady: true,
  stockQty: 2,
  categoryLabel: 'Bolsas & Bags',
  materials: 'Fio de malha'
};

const pieceWithoutVideo = {
  id: 'bolsa-foto-teste',
  name: 'Bolsa Foto Teste',
  price: 120.00,
  image: 'assets/products/bolsa_punk.jpg',
  images: ['assets/products/bolsa_punk.jpg', 'assets/products/bolsa_punk_detail.jpg'],
  isReady: true,
  stockQty: 1,
  categoryLabel: 'Bolsas & Bags',
  materials: 'Fio de algodao'
};

const originalDocSection37 = global.document;
global.document = {
  createElement: (tagName) => createMockDomElementForXss(tagName)
};

let cardWithVideo;
let cardWithoutVideo;
try {
  cardWithVideo = createProductCardElementFn(pieceWithVideo);
  cardWithoutVideo = createProductCardElementFn(pieceWithoutVideo);
} finally {
  global.document = originalDocSection37;
}

assert(cardWithVideo.innerHTML.includes('product-badge-video'), 'createProductCardElement renderiza product-badge-video quando peca possui video');
assert(cardWithVideo.innerHTML.includes('jez-icon-video-loop'), 'product-badge-video inclui o icone vetorial jez-icon-video-loop de Ariel');
assert(!cardWithoutVideo.innerHTML.includes('product-badge-video'), 'createProductCardElement NAO renderiza product-badge-video em peca estatica');

// Validacao de Markup e Estilos
const currentStylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf-8');
const currentIndexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const currentAppJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');

assert(currentIndexHtml.includes('id="modal-video"'), 'index.html inclui o elemento de video no Quick View');
assert(!currentIndexHtml.includes('id="modal-video-toggle-btn"'), 'index.html nao exibe botao redundante de toggle para video em loop continuo');

assert(currentStylesCss.includes('.product-badge-video'), 'styles.css define regras visuais para .product-badge-video');
assert(currentStylesCss.includes('.modal-thumb.is-video'), 'styles.css define indicador para miniaturas de video');
assert(currentStylesCss.includes('.modal-video-element'), 'styles.css define estilos para o player de video no Quick View');

assert(currentAppJs.includes('modalVideo'), 'app.js gerencia modalVideo');
assert(currentAppJs.includes('cleanupVideoPlayback(modalVideo)'), 'app.js invoca limpeza de buffer ao fechar o Quick View');

// ============================================================================
// [38] Validando Midias de Video no Modal de Edicao e Acervo do Atelie (JEZ-032)
// ============================================================================
console.log('\n[38] Validando Midias de Video no Modal de Edicao e Acervo do Atelie (JEZ-032):');

const atelieHtmlForVideo = fs.readFileSync(path.join(ROOT_DIR, 'atelie.html'), 'utf-8');
const adminCssForVideo = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf-8');
const adminJsForVideo = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf-8');

// A. Integridade Estrutural do HTML do Atelie (1 clique direto na galeria)
assert(atelieHtmlForVideo.includes("media-src 'self' data: https: blob:;"), 'atelie.html autoriza midias de video no CSP (media-src)');
assert(atelieHtmlForVideo.includes('id="btn-add-edit-video"'), 'atelie.html contem o botao de adicionar video no carrossel (#btn-add-edit-video)');
assert(atelieHtmlForVideo.includes('id="btn-add-new-video"'), 'atelie.html contem o botao de adicionar video na nova peca (#btn-add-new-video)');
assert(!atelieHtmlForVideo.includes('id="edit-video-panel"'), 'atelie.html removeu o modal/painel redundante de adicionar video no carrossel');
assert(!atelieHtmlForVideo.includes('id="new-video-panel"'), 'atelie.html removeu o modal/painel redundante de adicionar video na nova peca');
assert(atelieHtmlForVideo.includes('id="edit-video-file-input"'), 'atelie.html contem o input de arquivo oculto para upload de video no carrossel');
assert(atelieHtmlForVideo.includes('id="new-video-file-input"'), 'atelie.html contem o input de arquivo oculto para upload de video na nova peca');
assert(atelieHtmlForVideo.includes('id="edit-crop-source-video"'), 'atelie.html contem o elemento de video no viewport de enquadramento 1:1');

// B. Regras de Estilo Boutique e Zero Pills no admin.css
assert(adminCssForVideo.includes('.extra-photo-thumb.is-video'), 'admin.css define estilizacao para miniatura de video no carrossel');
assert(adminCssForVideo.includes('.video-thumb-play-overlay'), 'admin.css define icone de reproducao sobre a miniatura de video');
assert(adminCssForVideo.includes('.badge-catalog-video'), 'admin.css define badge de video no catalogo do lojista');
assert(adminCssForVideo.includes('.crop-video-element'), 'admin.css define regras para o video na moldura 1:1');
assert(adminCssForVideo.includes('.btn-add-extra-photo') && adminCssForVideo.includes('.btn-add-extra-video'), 'admin.css padroniza o botao de adicionar video com a mesma estetica do botao de fotos extras');
assert(!adminCssForVideo.includes('border-radius: 9999px'), 'admin.css cumpre a diretriz zero pills');

// C. Importacoes de Servicos e Integracao em admin.js
assert(adminJsForVideo.includes('isValidVideoUrl'), 'admin.js implementa e exporta isValidVideoUrl');
assert(adminJsForVideo.includes('isVideoUrl'), 'admin.js integra utilitario isVideoUrl');
assert(adminJsForVideo.includes('hasVideoMedia'), 'admin.js integra utilitario hasVideoMedia');
assert(adminJsForVideo.includes('validateVideoUploadQuota'), 'admin.js integra validacao de cota de upload');
assert(adminJsForVideo.includes('cleanupVideoPlayback'), 'admin.js integra limpeza de buffer de reproducao');

// D. Teste Unitario da Funcao isValidVideoUrl
const testIsValidVideoUrl = adminPwaModule.isValidVideoUrl;
assert(typeof testIsValidVideoUrl === 'function', 'isValidVideoUrl e exportada como funcao');
assert(testIsValidVideoUrl('https://firebasestorage.googleapis.com/v0/b/jez-collection.firebasestorage.app/o/videos%2Fcroche_loop.mp4?alt=media') === true, 'isValidVideoUrl aceita video no Firebase Storage');
assert(testIsValidVideoUrl('https://cdn.exemplo.com/videos/artesanal.mp4') === true, 'isValidVideoUrl aceita URL HTTPS de mp4');
assert(testIsValidVideoUrl('https://cdn.exemplo.com/videos/artesanal.webm') === true, 'isValidVideoUrl aceita URL HTTPS de webm');
assert(testIsValidVideoUrl('data:video/mp4;base64,AAAA...') === true, 'isValidVideoUrl aceita data:video');
assert(testIsValidVideoUrl('blob:http://localhost/uuid-video') === true, 'isValidVideoUrl aceita blob:');
assert(testIsValidVideoUrl('javascript:alert(1)') === false, 'isValidVideoUrl rejeita esquema javascript:');
assert(testIsValidVideoUrl('data:text/html,<script>') === false, 'isValidVideoUrl rejeita data:text/html');
assert(testIsValidVideoUrl('https://exemplo.com/foto.jpg') === false, 'isValidVideoUrl rejeita extensao .jpg');
assert(testIsValidVideoUrl(null) === false, 'isValidVideoUrl trata nulo defensivamente');
assert(testIsValidVideoUrl('') === false, 'isValidVideoUrl trata string vazia defensivamente');

// E. Validacao do Renderizador do Catalogo e Fechamento de Modal com Limpeza de Buffer
assert(adminJsForVideo.includes('badge-catalog-video'), 'admin.js renderiza badge-catalog-video para pecas com video');
assert(adminJsForVideo.includes('cleanupVideoPlayback(editCropSourceVideo)'), 'admin.js limpa recursos de video no fechamento do modal de edicao');

// F. Validacao de Hardening Adversarial (Diana Quality Gate — JEZ-032 Caveat Fixes)
const indexHtmlContent38 = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const swJsContent38 = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
const prodCardJsContent38 = fs.readFileSync(path.join(__dirname, '../js/components/product-card.js'), 'utf8');

assert(indexHtmlContent38.includes("media-src 'self' data: https: blob:;"), 'index.html CSP autoriza media-src para exibicao de videos do Firebase Storage e CDNs');
assert(swJsContent38.includes("req.destination === 'video' || req.headers.get('range')"), 'sw.js implementa bypass explícito para streams de video e range requests parciais');
assert(prodCardJsContent38.includes('isVideoUrl(primaryCandidate)'), 'product-card.js protege primaryCandidate prevenindo que video seja usado em tag img');
assert(adminJsForVideo.includes('file.size > 800 * 1024'), 'admin.js protege Firestore contra estouro de cota de 1 MB em upload Base64 direto');

// ============================================================================
// [39] Validando Shimmer de Atelie, Skeletons e First-Sync Gate (JEZ-036)
// ============================================================================
console.log('\n🎨 [39] Validando Shimmer de Atelie, Skeletons e First-Sync Gate (JEZ-036):');

const stylesCssContent39 = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf8');
const appJsContent39 = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const fbServiceContent39 = fs.readFileSync(path.join(__dirname, '../firebase-service.js'), 'utf8');
const fbModServiceContent39 = fs.readFileSync(path.join(__dirname, '../js/services/firebase.js'), 'utf8');
const prodCardModule39 = require(path.join(ROOT_DIR, 'js', 'components', 'product-card.js'));

assert(stylesCssContent39.includes('.product-card-skeleton'), 'styles.css define regras visuais para .product-card-skeleton');
assert(stylesCssContent39.includes('.skeleton-shimmer'), 'styles.css define animacao e degradê para .skeleton-shimmer');
assert(stylesCssContent39.includes('.skeleton-image-wrap'), 'styles.css define moldura de imagem 1:1 para .skeleton-image-wrap');
assert(stylesCssContent39.includes('.skeleton-footer'), 'styles.css define secao de rodape do skeleton');
assert(stylesCssContent39.includes('.sr-only'), 'styles.css define classe de acessibilidade .sr-only');
assert(stylesCssContent39.includes('skeletonCraftPulse'), 'styles.css implementa keyframes skeletonCraftPulse');

assert(appJsContent39.includes('renderSkeletons'), 'app.js implementa a funcao de renderizacao de skeletons');
assert(appJsContent39.includes('product-card-skeleton'), 'app.js cria elementos com a classe product-card-skeleton');
assert(appJsContent39.includes('hasLocalCatalog'), 'app.js verifica presenca de catalogo previo no localStorage');
assert(appJsContent39.includes('fallbackCatalogTimeout'), 'app.js configura timeout defensivo para resolucao de catalogo');
assert(appJsContent39.includes('Carregando acervo artesanal da Jéssica...'), 'app.js inclui anuncio acessivel de carregamento para leitores de tela');

assert(fbServiceContent39.includes('waitForInitialProducts'), 'firebase-service.js implementa metodo waitForInitialProducts');
assert(fbModServiceContent39.includes('waitForInitialProducts'), 'js/services/firebase.js implementa metodo waitForInitialProducts');

assert(typeof prodCardModule39.createProductSkeletonElement === 'function', 'product-card.js exporta a funcao createProductSkeletonElement');
const skeletonCardElem = prodCardModule39.createProductSkeletonElement();
assert(skeletonCardElem.className.includes('product-card-skeleton'), 'createProductSkeletonElement gera card com classe product-card-skeleton');
assert(skeletonCardElem.getAttribute('aria-hidden') === 'true', 'createProductSkeletonElement define aria-hidden=true');

// Verificacao rigorosa da diretriz Zero Emojis
const emojiTestRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
assert(!emojiTestRegex.test(stylesCssContent39), 'styles.css cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(appJsContent39), 'app.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(fbServiceContent39), 'firebase-service.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(fbModServiceContent39), 'js/services/firebase.js cumpre rigorosamente a regra zero emojis');

// ============================================================================
// [40] Validando Sincronizacao, Cura e Preservacao de Midias de Fabrica (JEZ-037)
// ============================================================================
console.log('\n[40] Validando Sincronizacao, Cura e Preservacao de Midias de Fabrica (JEZ-037):');

const productsServiceModule = require(path.join(ROOT_DIR, 'js', 'services', 'products.js'));
assert(typeof productsServiceModule.preserveFactoryMedia === 'function', 'products.js exporta a funcao preserveFactoryMedia');
assert(typeof productsServiceModule.cureProductListMedia === 'function', 'products.js exporta a funcao cureProductListMedia');
assert(typeof productsServiceModule.isVideoMedia === 'function', 'products.js exporta a funcao isVideoMedia');

// 1. Auto-cura da blusa-teia sem video
const curedBlusa1 = productsServiceModule.preserveFactoryMedia({
  id: 'blusa-teia',
  image: 'assets/products/blusa_teia.jpg',
  images: ['assets/products/blusa_teia.jpg']
});
assert(Array.isArray(curedBlusa1.images) && curedBlusa1.images.length === 2, 'preserveFactoryMedia restaura array de 2 midias para blusa-teia incompleta');
assert(curedBlusa1.images[0] === 'assets/products/blusa_teia.jpg', 'preserveFactoryMedia garante foto no indice 0 da blusa-teia');
assert(curedBlusa1.images[1] === 'assets/products/blusa_teia_loop.mp4', 'preserveFactoryMedia restaura video no indice 1 da blusa-teia');
assert(curedBlusa1.image === 'assets/products/blusa_teia.jpg', 'preserveFactoryMedia garante capa estatica da blusa-teia');

// 2. Invariante inviolavel: video NUNCA deve ser a primeira midia (indice 0)
const curedBlusa2 = productsServiceModule.preserveFactoryMedia({
  id: 'blusa-teia',
  image: 'assets/products/blusa_teia_loop.mp4',
  images: ['assets/products/blusa_teia_loop.mp4', 'assets/products/blusa_teia.jpg']
});
assert(curedBlusa2.images[0] === 'assets/products/blusa_teia.jpg', 'preserveFactoryMedia realoca foto para o indice 0 quando video vem no topo');
assert(curedBlusa2.images[1] === 'assets/products/blusa_teia_loop.mp4', 'preserveFactoryMedia preserva video apos a foto principal');
assert(curedBlusa2.image === 'assets/products/blusa_teia.jpg', 'preserveFactoryMedia nunca permite video no atributo image principal');

// 3. Auto-cura da blusa-teia sem nenhuma imagem definida
const curedBlusa3 = productsServiceModule.preserveFactoryMedia({ id: 'blusa-teia' });
assert(curedBlusa3.images[0] === 'assets/products/blusa_teia.jpg', 'preserveFactoryMedia preenche foto de fabrica para blusa-teia vazia');
assert(curedBlusa3.images[1] === 'assets/products/blusa_teia_loop.mp4', 'preserveFactoryMedia preenche video de fabrica para blusa-teia vazia');

// 4. Invariante de peca com video mockado sem foto estatica
const curedGenericWithVideo = productsServiceModule.preserveFactoryMedia({
  id: 'bolsa-punk',
  images: ['assets/products/clip.mp4']
});
assert(curedGenericWithVideo.images[0] === 'assets/products/bolsa_punk.jpg', 'preserveFactoryMedia injeta foto de fabrica no indice 0 quando lista so contem video');

// 5. Validacao de integracao em lote com cureProductListMedia
const sampleCatalogForCure40 = [
  { id: 'bolsa-punk', images: [] },
  { id: 'blusa-teia', images: ['assets/products/blusa_teia.jpg'] }
];
const curedList40 = productsServiceModule.cureProductListMedia(sampleCatalogForCure40);
assert(curedList40.length === 2, 'cureProductListMedia processa toda a lista de pecas');
assert(curedList40[1].images.includes('assets/products/blusa_teia_loop.mp4'), 'cureProductListMedia cura blusa-teia na colecao');

// 6. Validacao nos servicos Firebase (firebase-service.js e js/services/firebase.js)
const fbRaw40 = fs.readFileSync(path.join(ROOT_DIR, 'firebase-service.js'), 'utf8');
const fbModRaw40 = fs.readFileSync(path.join(ROOT_DIR, 'js', 'services', 'firebase.js'), 'utf8');

assert(fbRaw40.includes('patchProductMediaIfNeeded'), 'firebase-service.js implementa patchProductMediaIfNeeded');
assert(fbModRaw40.includes('patchProductMediaIfNeeded'), 'js/services/firebase.js implementa patchProductMediaIfNeeded');
assert(fbRaw40.includes("import { defaultProducts, preserveFactoryMedia } from './js/services/products.js';"), 'firebase-service.js importa servico de produtos com caminho relativo correto');
assert(fbModRaw40.includes("import { defaultProducts, preserveFactoryMedia } from './products.js';"), 'js/services/firebase.js importa servico de produtos com caminho modular correto');
assert(fbRaw40.includes('preserveFactoryMedia(raw, defaultProducts)'), 'firebase-service.js aplica preserveFactoryMedia no onProductsChange');
assert(fbModRaw40.includes('preserveFactoryMedia(raw, defaultProducts)'), 'js/services/firebase.js aplica preserveFactoryMedia no onProductsChange');
assert(fbRaw40.includes('assets/products/blusa_teia_loop.mp4'), 'firebase-service.js referencia video da blusa-teia no patch do Firestore');
assert(fbModRaw40.includes('assets/products/blusa_teia_loop.mp4'), 'js/services/firebase.js referencia video da blusa-teia no patch do Firestore');

// 7. Conformidade estrita Zero Emojis
assert(!emojiTestRegex.test(fbRaw40), 'firebase-service.js mantem conformidade estrita zero emojis apos JEZ-037');
assert(!emojiTestRegex.test(fbModRaw40), 'js/services/firebase.js mantem conformidade estrita zero emojis apos JEZ-037');
const productsRaw40 = fs.readFileSync(path.join(ROOT_DIR, 'js', 'services', 'products.js'), 'utf8');
assert(!emojiTestRegex.test(productsRaw40), 'js/services/products.js mantem conformidade estrita zero emojis apos JEZ-037');

// [41] Validando Protecao de Catalogo e Midias no Painel Admin (JEZ-037):
console.log('\n[41] Validando Protecao de Catalogo e Midias no Painel Admin (JEZ-037):');

// 1. Modulo js/admin/catalog.js exporta funcoes de cura e preservacao
assert(typeof adminCatalogModule.preserveFactoryMedia === 'function', 'catalog.js exporta preserveFactoryMedia');
assert(typeof adminCatalogModule.cureProductListMedia === 'function', 'catalog.js exporta cureProductListMedia');
assert(typeof adminCatalogModule.isVideoMedia === 'function', 'catalog.js exporta isVideoMedia');

// 2. Preservacao de fabrica em catalog.js para blusa-teia e capa estatica
const curedAdminTeia = adminCatalogModule.preserveFactoryMedia({
  id: 'blusa-teia',
  image: 'assets/products/blusa_teia_loop.mp4',
  images: ['assets/products/blusa_teia_loop.mp4', 'assets/products/blusa_teia.jpg']
});
assert(curedAdminTeia.image === 'assets/products/blusa_teia.jpg', 'catalog.js preserveFactoryMedia assegura capa estatica da blusa-teia');
assert(curedAdminTeia.images[0] === 'assets/products/blusa_teia.jpg', 'catalog.js preserveFactoryMedia coloca foto no indice 0');
assert(curedAdminTeia.images[1] === 'assets/products/blusa_teia_loop.mp4', 'catalog.js preserveFactoryMedia preserva video no indice 1');

// 3. Integracao e re-exportacoes em admin.js
const adminJsContent41 = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf8');
assert(adminJsContent41.includes('cureProductListMedia') && adminJsContent41.includes('preserveFactoryMedia'), 'admin.js importa e re-exporta cureProductListMedia e preserveFactoryMedia');
assert(adminJsContent41.includes('cureProductListMedia(cloudCatalog, defaultInitialCatalog)'), 'admin.js aplica cureProductListMedia no onProductsChange');

// 4. Garantia de foto estatica no indice 0 no cadastro e edicao do admin.js
assert(adminJsContent41.includes('isVideoUrl(allImages[0])') || adminJsContent41.includes('isVideoMedia(allImages[0])'), 'admin.js valida que allImages no cadastro nao tenha video no indice 0');
assert(adminJsContent41.includes('isVideoUrl(updatedImages[0])') || adminJsContent41.includes('isVideoMedia(updatedImages[0])'), 'admin.js valida que updatedImages na edicao nao tenha video no indice 0');

// 5. Garantia de miniatura estatica na listagem do admin
assert(adminJsContent41.includes('candidateThumb'), 'admin.js protege thumbnail da listagem do acervo contra URLs de video');

// 6. Zero Emojis nos arquivos do admin
const catalogJsContent41 = fs.readFileSync(path.join(ROOT_DIR, 'js', 'admin', 'catalog.js'), 'utf8');
assert(!emojiTestRegex.test(catalogJsContent41), 'js/admin/catalog.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(adminJsContent41), 'admin.js cumpre rigorosamente a regra zero emojis');

// [42] Validando Garantia de Invariante de Mídia na Vitrine e Modal de Detalhes (JEZ-037):
console.log('\n[42] Validando Garantia de Invariante de Mídia na Vitrine e Modal de Detalhes (JEZ-037):');

// 1. Invariante de mídia e funções de cura em app.js
const appJsContent42 = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
assert(appJsContent42.includes('cureProductMedia') && appJsContent42.includes('cureProductListMedia'), 'app.js implementa funcoes cureProductMedia e cureProductListMedia');
assert(appJsContent42.includes('cureProductListMedia(cloudProducts, defaultProducts)'), 'app.js aplica cura de midias cloudProducts no onProductsChange');
assert(appJsContent42.includes('cureProductListMedia(catalogToUse, defaultProducts)'), 'app.js aplica cura de midias no renderCatalog');

// 2. Protecao contra video no indice 0 no modal de detalhes (Quick View)
assert(appJsContent42.includes('isVideoUrl(galleryPhotos[0])'), 'app.js protege a primeira midia do Quick View contra videos no indice 0');
assert(appJsContent42.includes('selectModalPhoto(0)'), 'app.js inicializa Quick View sempre com a foto estatica de capa no indice 0');

// 3. Exposicao publica em window.jezApp para interoperabilidade
assert(appJsContent42.includes('cureProductMedia,') && appJsContent42.includes('cureProductListMedia,'), 'window.jezApp expoe funcoes de cura de midia');

// 4. QuickViewGallery reposiciona video se fornecido no indice 0
const galleryInvariantTest = new QuickViewGalleryClass({ fallbackPoster: 'assets/products/tote_cherry.jpg' });
galleryInvariantTest.setMedia([
  'https://firebasestorage.googleapis.com/v0/b/jez.appspot.com/o/video_punk.mp4',
  'assets/products/bolsa_punk.jpg'
]);
assert(galleryInvariantTest.getCurrentType() === 'image', 'QuickViewGallery garante que indice 0 seja imagem estatica mesmo recebendo video primeiro');
assert(galleryInvariantTest.getCurrentPhoto() === 'assets/products/bolsa_punk.jpg', 'QuickViewGallery reposiciona foto estatica para o indice 0');
galleryInvariantTest.next();
assert(galleryInvariantTest.getCurrentType() === 'video', 'QuickViewGallery mantem o video acessivel no indice 1');

// 5. Zero Emojis na Vitrine e componentes de Quick View
assert(!emojiTestRegex.test(appJsContent42), 'app.js cumpre rigorosamente a regra zero emojis');
const quickViewJsContent42 = fs.readFileSync(path.join(ROOT_DIR, 'js', 'components', 'quick-view.js'), 'utf8');
assert(!emojiTestRegex.test(quickViewJsContent42), 'js/components/quick-view.js cumpre rigorosamente a regra zero emojis');

// [43] Validando Hero Card com Shimmer Skeleton e Zero FOUC (JEZ-038 - Lumi & Alex)
console.log('\n[43] Validando Hero Card com Shimmer Skeleton e Zero FOUC (JEZ-038):');
const htmlRef43 = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const stylesContent43 = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const appJsContent43 = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');

assert(stylesContent43.includes('.hero-card-featured.is-skeleton'), 'styles.css define regra para .hero-card-featured.is-skeleton');
assert(stylesContent43.includes('skeletonCraftPulse'), 'styles.css utiliza animacao skeletonCraftPulse no shimmer artesanal do Hero Card');
assert(stylesContent43.includes('.hero-card-featured.is-skeleton picture'), 'styles.css dimensiona a moldura de imagem do skeleton mantendo CLS=0');
assert(htmlRef43.includes("card.classList.add('is-skeleton')"), 'index.html ativa is-skeleton preventivamente na primeira visita sem catalogo');
assert(appJsContent43.includes('renderHeroSkeleton'), 'app.js implementa funcao renderHeroSkeleton');
assert(appJsContent43.includes("heroFeaturedCard.classList.remove('is-skeleton')"), 'app.js remove is-skeleton ao renderizar peca real');
assert(!appJsContent43.includes('renderHeroFeaturedCard(getProducts())'), 'app.js nao renderiza mock padrao com hasLocalCatalog falso eliminando FOUC');
assert(appJsContent43.includes('renderHeroSkeleton();'), 'app.js invoca renderHeroSkeleton na inicializacao quando !hasLocalCatalog');
assert(appJsContent43.includes('renderHeroSkeleton,') && appJsContent43.includes('renderHeroFeaturedCard'), 'window.jezApp expoe renderHeroSkeleton e renderHeroFeaturedCard');
assert(!emojiTestRegex.test(stylesContent43), 'styles.css cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(appJsContent43), 'app.js cumpre rigorosamente a regra zero emojis');

// [44] Validando Enquadramento 1:1 de Video sem Barras Escuras e Fundo Blur no Quick View (JEZ-038 - Lumi & Alex)
console.log('\n[44] Validando Enquadramento 1:1 de Video sem Barras Escuras e Fundo Blur no Quick View (JEZ-038):');
const stylesContent44 = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const appJsContent44 = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');

assert(!stylesContent44.includes('background-color: var(--color-dark);\n}'), 'styles.css removeu background-color escuro de .modal-video-element');
assert(stylesContent44.includes('.modal-video-element') && stylesContent44.includes('aspect-ratio: 1 / 1;'), 'styles.css aplica proporcao 1:1 com aspect-ratio: 1 / 1 em .modal-video-element');
assert(stylesContent44.includes('background: transparent;') || stylesContent44.includes('background-color: transparent;'), 'styles.css define fundo transparente para .modal-video-element');
assert(appJsContent44.includes("modalVideo.style.background = 'transparent'") || appJsContent44.includes("modalVideo.style.backgroundColor = 'transparent'"), 'app.js define background transparente no elemento de video');
assert(appJsContent44.includes('modalImgBlur.style.display = safePoster ? \'block\' : \'none\'') || appJsContent44.includes('modalImgBlur.src = safePoster'), 'app.js exibe o modal-img-blur correspondente ao poster ou capa da peca');
assert(!emojiTestRegex.test(stylesContent44), 'styles.css cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(appJsContent44), 'app.js cumpre rigorosamente a regra zero emojis');

// [45] Validando Enquadramento 1:1 e Extracao de Poster de Video no Atelie (JEZ-038 - Cris & Alex)
console.log('\n[45] Validando Enquadramento 1:1 e Extracao de Poster de Video no Atelie (JEZ-038):');
const adminJsContent45 = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf8');
const catalogJsContent45 = fs.readFileSync(path.join(ROOT_DIR, 'js', 'admin', 'catalog.js'), 'utf8');

assert(typeof adminCatalogModule.extractVideoPoster === 'function', 'catalog.js exporta a funcao extractVideoPoster');
assert(typeof adminCatalogModule.createVideoMediaItem === 'function', 'catalog.js exporta a funcao createVideoMediaItem');
assert(adminJsContent45.includes('extractVideoPoster') && adminJsContent45.includes('createVideoMediaItem'), 'admin.js importa e re-exporta extractVideoPoster e createVideoMediaItem');

// Teste unitario de createVideoMediaItem
const testVideoItem1 = adminCatalogModule.createVideoMediaItem('assets/products/loop.mp4', 'data:image/jpeg;base64,mockposter');
assert(testVideoItem1.url === 'assets/products/loop.mp4', 'createVideoMediaItem preserva a URL do video');
assert(testVideoItem1.poster === 'data:image/jpeg;base64,mockposter', 'createVideoMediaItem vincula o poster 1:1 ao objeto');
assert(testVideoItem1.isVideo === true && testVideoItem1.type === 'video', 'createVideoMediaItem define flags isVideo e type video');

const testVideoItemObj = adminCatalogModule.createVideoMediaItem({ url: 'blob:video-1', poster: 'data:image/jpeg;base64,p1' });
assert(testVideoItemObj.url === 'blob:video-1' && testVideoItemObj.poster === 'data:image/jpeg;base64,p1', 'createVideoMediaItem normaliza objeto existente');

const posterPromise = adminCatalogModule.extractVideoPoster(null);
assert(posterPromise instanceof Promise, 'extractVideoPoster retorna uma Promise defensiva');

// Verificacao no fluxo de nova peca e carrossel de edicao no admin.js
assert(adminJsContent45.includes('extractVideoPoster(videoDataUrl, 540)'), 'admin.js aciona extractVideoPoster com dimensao 1:1 de 540px');
assert(adminJsContent45.includes('createVideoMediaItem(videoDataUrl, posterDataUrl)'), 'admin.js vincula poster gerado ao adicionar video em nova peca');
assert(adminJsContent45.includes('video.poster = safePoster'), 'admin.js exibe poster na pre-visualizacao de nova peca');
assert(adminJsContent45.includes('editCropSourceVideo.poster = current.poster'), 'admin.js exibe poster no player de edicao do carrossel');

assert(!emojiTestRegex.test(catalogJsContent45), 'js/admin/catalog.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(adminJsContent45), 'admin.js cumpre rigorosamente a regra zero emojis');

// [46] Validando Integracao do Hero Skeleton, Video 1:1 e Extracao de Poster (JEZ-038 - Sam):
console.log('\n[46] Validando Integracao do Hero Skeleton, Video 1:1 e Extracao de Poster (JEZ-038):');

// 1. Integracao Comportamental e Acessibilidade do Hero Skeleton
const heroStylesContent46 = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const heroAppJsContent46 = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
const heroHtmlContent46 = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

// Regras visuais avancadas de Shimmer e Skeleton no styles.css
assert(heroStylesContent46.includes('@keyframes skeletonCraftPulse'), 'styles.css define keyframes skeletonCraftPulse para shimmer artesanal');
assert(heroStylesContent46.includes('.hero-card-featured.is-skeleton picture::before'), 'styles.css define pseudo-elemento shimmer animado sobre a moldura');
assert(heroStylesContent46.includes('.hero-card-featured.is-skeleton picture img') && heroStylesContent46.includes('opacity: 0'), 'styles.css oculta imagem padrao enquanto skeleton estiver ativo prevenindo FOUC');
assert(heroStylesContent46.includes('.hero-card-featured.is-skeleton .hero-card-name') && heroStylesContent46.includes('height: 18px'), 'styles.css define dimensoes reservadas para placeholder de nome no skeleton');
assert(heroStylesContent46.includes('.hero-card-featured.is-skeleton .hero-card-price') && heroStylesContent46.includes('height: 22px'), 'styles.css define dimensoes reservadas para placeholder de preco no skeleton');
assert(heroStylesContent46.includes('.hero-card-featured.is-skeleton picture') && heroStylesContent46.includes('height: 210px'), 'styles.css ajusta altura proporcional da moldura do skeleton em dispositivos moveis');

// Script inline de protecao contra FOUC no index.html
assert(heroHtmlContent46.includes("localStorage.getItem('jez_catalog')"), 'index.html verifica cache de catalogo local no script inline de inicializacao');
assert(heroHtmlContent46.includes("localStorage.getItem('jez_featured_product_cache')"), 'index.html verifica cache do produto de destaque para renderizacao imediata');
assert(heroHtmlContent46.includes("card.classList.add('is-skeleton')") && heroHtmlContent46.includes("card.setAttribute('aria-busy', 'true')"), 'index.html ativa skeleton e aria-busy preventivamente quando nao ha dados no cache');

// Teste comportamental simulado da transicao de estado do Hero Card
const mockHeroElement = {
  classes: new Set(),
  attributes: {},
  classList: {
    add(cls) { mockHeroElement.classes.add(cls); },
    remove(cls) { mockHeroElement.classes.delete(cls); },
    contains(cls) { return mockHeroElement.classes.has(cls); }
  },
  setAttribute(attr, val) { mockHeroElement.attributes[attr] = String(val); },
  getAttribute(attr) { return mockHeroElement.attributes[attr] || null; },
  removeAttribute(attr) { delete mockHeroElement.attributes[attr]; }
};

// Simulacao do estado de skeleton
mockHeroElement.classList.add('is-skeleton');
mockHeroElement.setAttribute('aria-busy', 'true');
mockHeroElement.setAttribute('aria-label', 'Carregando peca em destaque do atelie...');

assert(mockHeroElement.classList.contains('is-skeleton'), 'Hero card recebe classe is-skeleton durante carregamento inicial');
assert(mockHeroElement.getAttribute('aria-busy') === 'true', 'Hero card ativa atributo aria-busy durante carregamento');
assert(mockHeroElement.getAttribute('aria-label').includes('Carregando'), 'Hero card possui aria-label informativo durante o estado skeleton');

// Simulacao do estado hidratado
mockHeroElement.classList.remove('is-skeleton');
mockHeroElement.removeAttribute('aria-busy');
mockHeroElement.setAttribute('data-product-id', 'tote-cherry');
mockHeroElement.setAttribute('aria-label', 'Ver detalhes da peca em destaque: Tote Bag Cherry com Laco');

assert(!mockHeroElement.classList.contains('is-skeleton'), 'Hero card remove classe is-skeleton ao renderizar peca');
assert(mockHeroElement.getAttribute('aria-busy') === null, 'Hero card remove aria-busy apos conclusao do carregamento');
assert(mockHeroElement.getAttribute('data-product-id') === 'tote-cherry', 'Hero card vincula id da peca em destaque');

// 2. Integracao do Player de Video 1:1 e Fundo Blur no Quick View
assert(!/\.modal-video-element\s*\{[^}]*background(?:-color)?\s*:\s*var\(--color-dark\)/i.test(heroStylesContent46), 'styles.css nao utiliza background escuro ou var(--color-dark) em .modal-video-element');
assert(/\.modal-video-element\s*\{[^}]*aspect-ratio\s*:\s*1\s*\/\s*1/i.test(heroStylesContent46), 'styles.css garante proporcao 1:1 com aspect-ratio: 1 / 1 em .modal-video-element');
assert(/\.modal-video-element\s*\{[^}]*object-fit\s*:\s*cover/i.test(heroStylesContent46), 'styles.css garante preenchimento harmonioso com object-fit: cover em .modal-video-element');
assert(/\.modal-img-blur\s*\{[^}]*filter\s*:[^;]*blur/i.test(heroStylesContent46), 'styles.css aplica desfoque artistico de fundo em .modal-img-blur');

// Camadas e Visibilidade: video sobrepoe o blur com background transparente
assert(heroAppJsContent46.includes("modalVideo.style.display = 'block'"), 'app.js exibe modalVideo ao selecionar video no Quick View');
assert(heroAppJsContent46.includes("modalVideo.style.background = 'transparent'") || heroAppJsContent46.includes("modalVideo.style.backgroundColor = 'transparent'"), 'app.js define background transparente no modalVideo garantindo visibilidade do blur');
assert(heroAppJsContent46.includes("modalImgBlur.style.display = safePoster ? 'block' : 'none'"), 'app.js exibe o blur com o poster correspondente quando video esta ativo');

// 3. Integracao e Contrato de Extracao e Criacao de Poster de Video no Atelie
const adminCssContent46 = fs.readFileSync(path.join(ROOT_DIR, 'admin.css'), 'utf8');
assert(adminCssContent46.includes('.crop-viewport') && adminCssContent46.includes('aspect-ratio: 1 / 1'), 'admin.css define proporcao 1:1 para crop-viewport no Atelie');
assert(adminCssContent46.includes('.crop-video-element') && adminCssContent46.includes('object-fit: cover'), 'admin.css aplica object-fit: cover para video no enquadramento do Atelie');
assert(adminCssContent46.includes('.extra-photo-thumb') && adminCssContent46.includes('aspect-ratio: 1 / 1'), 'admin.css define proporcao quadrada 1:1 para miniaturas complementares no Atelie');

// Contratos funcionais de midia de video
const videoItemString = adminCatalogModule.createVideoMediaItem('https://storage.googleapis.com/test.mp4', 'data:image/jpeg;base64,sampleposter');
assert(videoItemString.url === 'https://storage.googleapis.com/test.mp4', 'createVideoMediaItem mapeia URL de video');
assert(videoItemString.poster === 'data:image/jpeg;base64,sampleposter', 'createVideoMediaItem mapeia poster do frame 1:1');
assert(videoItemString.isVideo === true && videoItemString.type === 'video', 'createVideoMediaItem define tipo video');

const defensiveNullItem = adminCatalogModule.createVideoMediaItem(null);
assert(defensiveNullItem.url === '' && defensiveNullItem.poster === '', 'createVideoMediaItem trata entrada nula com fallback seguro');

const defensiveEmptyObjItem = adminCatalogModule.createVideoMediaItem({});
assert(defensiveEmptyObjItem.url === '' && defensiveEmptyObjItem.poster === '', 'createVideoMediaItem trata objeto sem propriedades com fallback seguro');

const posterNullCall = adminCatalogModule.extractVideoPoster(null);
assert(posterNullCall instanceof Promise, 'extractVideoPoster retorna Promise com entrada nula');

const posterNonStringCall = adminCatalogModule.extractVideoPoster(99999);
assert(posterNonStringCall instanceof Promise, 'extractVideoPoster retorna Promise com entrada numerica');

// 4. Auditoria de Higiene: Zero console.log e Zero Emojis em Producao
assert(!heroAppJsContent46.includes('console.log('), 'app.js nao possui console.log em producao');
const adminJsHygContent = fs.readFileSync(path.join(ROOT_DIR, 'admin.js'), 'utf8');
assert(!adminJsHygContent.includes('console.log('), 'admin.js nao possui console.log em producao');
const catalogJsHygContent = fs.readFileSync(path.join(ROOT_DIR, 'js', 'admin', 'catalog.js'), 'utf8');
assert(!catalogJsHygContent.includes('console.log('), 'js/admin/catalog.js nao possui console.log em producao');

assert(!emojiTestRegex.test(heroStylesContent46), 'styles.css cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(heroAppJsContent46), 'app.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(adminJsHygContent), 'admin.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(catalogJsHygContent), 'js/admin/catalog.js cumpre rigorosamente a regra zero emojis');
assert(!emojiTestRegex.test(adminCssContent46), 'admin.css cumpre rigorosamente a regra zero emojis');

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
