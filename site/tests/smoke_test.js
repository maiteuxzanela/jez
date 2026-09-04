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
const requiredFiles = ['index.html', 'styles.css', 'app.js'];
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
