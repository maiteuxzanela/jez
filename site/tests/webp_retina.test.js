/**
 * ==========================================================================
 * JEZ-041 — Testes Deterministicos Reais do Pipeline WebP Retina 800px / 0.82
 * Responsavel: Hugo (SDET) | Suite executada por smoke_test.js
 * ==========================================================================
 *
 * Diferente das checagens estaticas por substring, esta suite EXECUTA os
 * modulos reais de producao:
 *   - site/js/admin/image-compression.js  (compressImageFile)
 *   - site/js/admin/cropper.js            (setupPhotoCropper -> getCroppedDataUrl)
 *
 * Como o Node nao possui Canvas/Image/FileReader nativos, instalamos um
 * ambiente de navegador hermetico (harness de teste, equivalente ao jsdom)
 * que reproduz a semantica das APIs do browser. A logica de negocio sob
 * teste e sempre a real, importada dos arquivos de producao — nenhuma
 * funcao de compressao/recorte e substituida por dublê.
 *
 * Saida: uma unica linha JSON prefixada para consumo do smoke_test.js.
 */

const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const RESULTS_PREFIX = '__JEZ_WEBP_RETINA_RESULTS__';

const results = [];

const run = async (name, fn) => {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail: detail || '' });
  } catch (err) {
    results.push({ name, ok: false, detail: (err && err.message) || String(err) });
  }
};

const assertTrue = (condition, label) => {
  if (!condition) throw new Error(label);
};

const assertEqual = (actual, expected, label) => {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${JSON.stringify(expected)}, obtido ${JSON.stringify(actual)}`);
  }
};

const assertClose = (actual, expected, label) => {
  if (typeof actual !== 'number' || Math.abs(actual - expected) > 1e-9) {
    throw new Error(`${label}: esperado ${expected}, obtido ${JSON.stringify(actual)}`);
  }
};

/**
 * Recorder de borda de processo: captura o que a producao escreve em stderr
 * (console.warn) sem substituir nenhuma funcao de negocio. Usado para provar
 * a observabilidade dos caminhos defensivos.
 */
const captureStderr = async (fn) => {
  const chunks = [];
  const original = process.stderr.write;
  process.stderr.write = (chunk, ...rest) => {
    chunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
    const callback = rest.find((item) => typeof item === 'function');
    if (callback) callback();
    return true;
  };
  try {
    await fn();
  } finally {
    process.stderr.write = original;
  }
  return chunks.join('');
};

/**
 * Ambiente de navegador hermetico.
 * - Canvas 2D registra fillStyle/fillRect/drawImage e simula a capacidade de
 *   codificacao WebP do navegador ('supported' | 'png-fallback' | 'throws').
 * - Image respeita a ordem real: onload e disparado em microtask apos a
 *   atribuicao de src, com as dimensoes naturais informadas pelo cenario.
 * - FileReader entrega um data URL real derivado do arquivo (Blob/File real).
 */
function createBrowserEnvironment() {
  const state = {
    calls: [],
    canvases: [],
    imageDims: { width: 400, height: 400 },
    webpMode: 'supported'
  };

  const createCanvas = () => {
    const canvas = { width: 0, height: 0, fillRectArgs: null, drawImageArgs: null, ctx: null };
    const ctx = {
      fillStyle: null,
      fillRect(...args) { canvas.fillRectArgs = args; },
      drawImage(...args) { canvas.drawImageArgs = args; }
    };
    canvas.ctx = ctx;
    canvas.getContext = (type) => (type === '2d' ? ctx : null);
    canvas.toDataURL = (mime, quality) => {
      state.calls.push({ mime, quality });
      if (state.webpMode === 'throws-all') throw new Error('Canvas de origem contaminado (SecurityError)');
      if (mime === 'image/webp') {
        if (state.webpMode === 'throws') throw new Error('Codificador WebP indisponivel neste navegador');
        if (state.webpMode === 'png-fallback') return 'data:image/png;base64,ENCODER-WEBP-AUSENTE';
        return `data:image/webp;base64,${canvas.width}x${canvas.height}-q${quality}`;
      }
      if (mime === 'image/jpeg') {
        return `data:image/jpeg;base64,${canvas.width}x${canvas.height}-q${quality}`;
      }
      throw new Error(`MIME inesperado solicitado ao Canvas: ${mime}`);
    };
    state.canvases.push(canvas);
    return canvas;
  };

  class EnvironmentImage {
    constructor() {
      this.style = {};
      this.complete = true;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this.onload = null;
      this.onerror = null;
      this._src = '';
    }
    get src() { return this._src; }
    set src(value) {
      this._src = value;
      this.naturalWidth = state.imageDims.width;
      this.naturalHeight = state.imageDims.height;
      if (this.onload) queueMicrotask(() => this.onload());
    }
    addEventListener() {}
  }

  class EnvironmentFileReader {
    readAsDataURL(file) {
      const mime = (file && file.type) || 'application/octet-stream';
      const label = (file && file.name) || 'arquivo';
      this.result = `data:${mime};base64,${Buffer.from(label).toString('base64')}`;
      queueMicrotask(() => { if (this.onload) this.onload({ target: this }); });
    }
  }

  return {
    state,
    install() {
      this.previous = {
        FileReader: global.FileReader,
        Image: global.Image,
        document: global.document
      };
      global.FileReader = EnvironmentFileReader;
      global.Image = EnvironmentImage;
      global.document = {
        createElement: (tag) => (tag === 'canvas' ? createCanvas() : { style: {} })
      };
      return this;
    },
    uninstall() {
      global.FileReader = this.previous.FileReader;
      global.Image = this.previous.Image;
      global.document = this.previous.document;
    },
    reset(imageDims, webpMode) {
      state.calls.length = 0;
      state.canvases.length = 0;
      state.imageDims = { width: imageDims.width, height: imageDims.height };
      state.webpMode = webpMode || 'supported';
    }
  };
}

(async () => {
  const env = createBrowserEnvironment().install();

  const { compressImageFile, compressImageDataUrl } = require(path.join(ROOT_DIR, 'js', 'admin', 'image-compression.js'));
  const { optimizeStoredProductsMedia, isLegacyJpegMedia, buildFactoryWebpLegacyMap } = require(path.join(ROOT_DIR, 'js', 'admin', 'media-migration.js'));
  const { setupPhotoCropper } = require(path.join(ROOT_DIR, 'js', 'admin', 'cropper.js'));

  const makeFile = (name, type = 'image/jpeg') =>
    new File([Buffer.from(`JEZ-041:${name}`)], name, { type });

  const compress = async ({ dims, webpMode = 'supported', args }) => {
    env.reset(dims, webpMode);
    const output = await compressImageFile(...args);
    return { output, canvas: env.state.canvases[0], calls: env.state.calls.slice() };
  };

  const makeCropper = ({ dims, webpMode = 'supported' }) => {
    env.reset(dims, webpMode);
    const imgEl = new global.Image();
    const viewportEl = { clientWidth: 240, clientHeight: 240, addEventListener() {} };
    const cropper = setupPhotoCropper({
      viewportEl,
      imgEl,
      zoomSlider: null,
      btnZoomIn: null,
      btnZoomOut: null,
      btnReset: null,
      zoomValEl: null
    });
    return { cropper, imgEl, viewportEl };
  };

  // ---------------------------------------------------------------- compress
  await run('compressImageFile: paisagem 1600x1200 reduzida para 800x600 em WebP 0.82', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      args: [makeFile('paisagem.jpg')]
    });
    assertEqual(canvas.width, 800, 'largura do canvas');
    assertEqual(canvas.height, 600, 'altura do canvas');
    assertEqual(canvas.drawImageArgs.length, 5, 'assinatura de drawImage');
    assertEqual(canvas.drawImageArgs[1], 0, 'drawImage dx');
    assertEqual(canvas.drawImageArgs[2], 0, 'drawImage dy');
    assertEqual(canvas.drawImageArgs[3], 800, 'drawImage largura');
    assertEqual(canvas.drawImageArgs[4], 600, 'drawImage altura');
    assertEqual(calls.length, 1, 'quantidade de codificacoes');
    assertEqual(calls[0].mime, 'image/webp', 'mime da primeira codificacao');
    assertClose(calls[0].quality, 0.82, 'qualidade WebP');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: retrato 1200x1600 reduzida para 600x800 em WebP 0.82', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1200, height: 1600 },
      args: [makeFile('retrato.jpg')]
    });
    assertEqual(canvas.width, 600, 'largura do canvas');
    assertEqual(canvas.height, 800, 'altura do canvas');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.82, 'qualidade WebP');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: quadrada 2000x2000 reduzida para 800x800', async () => {
    const { canvas } = await compress({
      dims: { width: 2000, height: 2000 },
      args: [makeFile('quadrada.jpg')]
    });
    assertEqual(canvas.width, 800, 'largura do canvas');
    assertEqual(canvas.height, 800, 'altura do canvas');
  });

  await run('compressImageFile: imagem pequena 400x300 nao sofre upscale', async () => {
    const { canvas } = await compress({
      dims: { width: 400, height: 300 },
      args: [makeFile('pequena.jpg')]
    });
    assertEqual(canvas.width, 400, 'largura preservada');
    assertEqual(canvas.height, 300, 'altura preservada');
  });

  await run('compressImageFile: fallback defensivo para JPEG 0.82 quando WebP retorna PNG', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      webpMode: 'png-fallback',
      args: [makeFile('safari.jpg')]
    });
    assertEqual(canvas.width, 800, 'largura do canvas');
    assertEqual(canvas.height, 600, 'altura do canvas');
    assertEqual(calls.length, 2, 'tentativa WebP seguida de JPEG');
    assertEqual(calls[0].mime, 'image/webp', 'primeira tentativa WebP');
    assertEqual(calls[1].mime, 'image/jpeg', 'fallback JPEG');
    assertClose(calls[1].quality, 0.82, 'qualidade do fallback');
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('compressImageFile: fallback defensivo para JPEG 0.82 quando WebP lanca excecao', async () => {
    const { output, calls } = await compress({
      dims: { width: 1200, height: 1600 },
      webpMode: 'throws',
      args: [makeFile('antigo.jpg')]
    });
    assertEqual(calls[0].mime, 'image/webp', 'primeira tentativa WebP');
    assertEqual(calls[1].mime, 'image/jpeg', 'fallback JPEG');
    assertClose(calls[1].quality, 0.82, 'qualidade do fallback');
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('compressImageFile: chamada real do Atelie (file, 800, 0.82) mantem 800px e WebP 0.82', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      args: [makeFile('atelie-nova-peca.jpg'), 800, 0.82]
    });
    assertEqual(canvas.width, 800, 'largura do canvas');
    assertEqual(canvas.height, 600, 'altura do canvas');
    assertEqual(calls.length, 1, 'quantidade de codificacoes');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.82, 'qualidade WebP');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: chamada real do Atelie em retrato (file, 800, 0.82)', async () => {
    const { canvas } = await compress({
      dims: { width: 1200, height: 1600 },
      args: [makeFile('atelie-retrato.jpg'), 800, 0.82]
    });
    assertEqual(canvas.width, 600, 'largura do canvas');
    assertEqual(canvas.height, 800, 'altura do canvas');
  });

  await run('compressImageFile: assinatura legada (file, 540, 0.68) sem regressao', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      args: [makeFile('legado.jpg'), 540, 0.68]
    });
    assertEqual(canvas.width, 540, 'largura do canvas');
    assertEqual(canvas.height, 405, 'altura do canvas');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.68, 'qualidade legada preservada');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: 3 argumentos com qualidade nao padrao (file, 600, 0.9)', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      args: [makeFile('qualidade-custom.jpg'), 600, 0.9]
    });
    assertEqual(canvas.width, 600, 'largura do canvas');
    assertEqual(canvas.height, 450, 'altura do canvas');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.9, 'qualidade de 3 argumentos interpretada como quality');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: 4 argumentos explicitos (file, 500, 500, 0.75) nao caem na heuristica legada', async () => {
    const { output, canvas, calls } = await compress({
      dims: { width: 1600, height: 1200 },
      args: [makeFile('explicito.jpg'), 500, 500, 0.75]
    });
    assertEqual(canvas.width, 500, 'largura do canvas');
    assertEqual(canvas.height, 375, 'altura do canvas');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.75, 'qualidade de 4 argumentos');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('compressImageFile: fallback WebP registra aviso observavel em stderr', async () => {
    env.reset({ width: 1600, height: 1200 }, 'throws');
    let output = '';
    const stderr = await captureStderr(async () => {
      output = await compressImageFile(makeFile('aviso.jpg'));
    });
    assertTrue(stderr.includes('WebP indisponivel'), `aviso de WebP ausente no stderr: ${JSON.stringify(stderr)}`);
    assertTrue(stderr.includes('fallback JPEG'), `aviso de fallback ausente no stderr: ${JSON.stringify(stderr)}`);
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('compressImageFile: falha total de codificacao resolve vazio e registra aviso', async () => {
    env.reset({ width: 1600, height: 1200 }, 'throws-all');
    let output = 'nao-resolvido';
    const stderr = await captureStderr(async () => {
      output = await compressImageFile(makeFile('corrompida.jpg'));
    });
    assertEqual(output, '', 'saida em falha total de codificacao');
    assertTrue(stderr.includes('Erro no processamento de Canvas'), `aviso de erro de canvas ausente no stderr: ${JSON.stringify(stderr)}`);
  });

  await run('compressImageFile: arquivo nulo resolve string vazia', async () => {
    env.reset({ width: 400, height: 400 }, 'supported');
    const output = await compressImageFile(null);
    assertEqual(output, '', 'saida para arquivo nulo');
    assertEqual(env.state.canvases.length, 0, 'nenhum canvas criado');
  });

  // ----------------------------------------------------------------- cropper
  const loadCropper = async (dims, webpMode) => {
    const ctx = makeCropper({ dims, webpMode });
    await ctx.cropper.loadImage('data:image/jpeg;base64,JEZ041FOTO');
    return ctx;
  };

  await run('getCroppedDataUrl: recorte padrao gera canvas 800x800', async () => {
    const { cropper } = await loadCropper({ width: 1600, height: 1200 });
    const output = cropper.getCroppedDataUrl();
    const canvas = env.state.canvases[0];
    assertEqual(canvas.width, 800, 'largura do canvas');
    assertEqual(canvas.height, 800, 'altura do canvas');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('getCroppedDataUrl: fundo #23192d e area 1:1 exata preservados', async () => {
    const { cropper, imgEl } = await loadCropper({ width: 1600, height: 1200 });
    cropper.getCroppedDataUrl(800);
    const canvas = env.state.canvases[0];
    assertEqual(canvas.ctx.fillStyle, '#23192d', 'cor de preenchimento');
    assertEqual(canvas.fillRectArgs.length, 4, 'assinatura de fillRect');
    assertEqual(canvas.fillRectArgs[0], 0, 'fillRect x');
    assertEqual(canvas.fillRectArgs[1], 0, 'fillRect y');
    assertEqual(canvas.fillRectArgs[2], 800, 'fillRect largura');
    assertEqual(canvas.fillRectArgs[3], 800, 'fillRect altura');
    assertTrue(canvas.drawImageArgs[0] === imgEl, 'drawImage deve usar a imagem real carregada');
    assertEqual(canvas.drawImageArgs[1], 200, 'srcX do recorte');
    assertEqual(canvas.drawImageArgs[2], 0, 'srcY do recorte');
    assertEqual(canvas.drawImageArgs[3], 1200, 'srcW do recorte');
    assertEqual(canvas.drawImageArgs[4], 1200, 'srcH do recorte');
    assertEqual(canvas.drawImageArgs[5], 0, 'destino x');
    assertEqual(canvas.drawImageArgs[6], 0, 'destino y');
    assertEqual(canvas.drawImageArgs[7], 800, 'destino largura');
    assertEqual(canvas.drawImageArgs[8], 800, 'destino altura');
  });

  await run('getCroppedDataUrl: exporta WebP 0.82', async () => {
    const { cropper } = await loadCropper({ width: 1600, height: 1200 });
    const output = cropper.getCroppedDataUrl(800);
    const calls = env.state.calls.slice();
    assertEqual(calls.length, 1, 'quantidade de codificacoes');
    assertEqual(calls[0].mime, 'image/webp', 'mime da codificacao');
    assertClose(calls[0].quality, 0.82, 'qualidade WebP');
    assertTrue(output.startsWith('data:image/webp'), `saida deveria ser WebP, obtido ${output}`);
  });

  await run('getCroppedDataUrl: fallback JPEG 0.82 quando WebP retorna PNG', async () => {
    const { cropper } = await loadCropper({ width: 1600, height: 1200 }, 'png-fallback');
    const output = cropper.getCroppedDataUrl(800);
    const calls = env.state.calls.slice();
    assertEqual(calls.length, 2, 'tentativa WebP seguida de JPEG');
    assertEqual(calls[0].mime, 'image/webp', 'primeira tentativa WebP');
    assertEqual(calls[1].mime, 'image/jpeg', 'fallback JPEG');
    assertClose(calls[1].quality, 0.82, 'qualidade do fallback');
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('getCroppedDataUrl: fallback JPEG 0.82 quando WebP lanca excecao', async () => {
    const { cropper } = await loadCropper({ width: 1600, height: 1200 }, 'throws');
    const output = cropper.getCroppedDataUrl(800);
    const calls = env.state.calls.slice();
    assertEqual(calls.length, 2, 'tentativa WebP seguida de JPEG');
    assertEqual(calls[1].mime, 'image/jpeg', 'fallback JPEG');
    assertClose(calls[1].quality, 0.82, 'qualidade do fallback');
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('getCroppedDataUrl: fallback WebP registra aviso observavel em stderr', async () => {
    const { cropper } = await loadCropper({ width: 1600, height: 1200 }, 'throws');
    let output = '';
    const stderr = await captureStderr(async () => {
      output = cropper.getCroppedDataUrl(800);
    });
    assertTrue(stderr.includes('WebP indisponivel'), `aviso de WebP ausente no stderr: ${JSON.stringify(stderr)}`);
    assertTrue(stderr.includes('fallback JPEG'), `aviso de fallback ausente no stderr: ${JSON.stringify(stderr)}`);
    assertTrue(output.startsWith('data:image/jpeg'), `saida deveria ser JPEG, obtido ${output}`);
  });

  await run('getCroppedDataUrl: falha total de codificacao devolve a fonte original e registra aviso', async () => {
    const { cropper, imgEl } = await loadCropper({ width: 1600, height: 1200 }, 'throws-all');
    const fonteOriginal = imgEl.src;
    let output = '';
    const stderr = await captureStderr(async () => {
      output = cropper.getCroppedDataUrl(800);
    });
    assertEqual(output, fonteOriginal, 'saida em falha total de codificacao');
    assertTrue(stderr.includes('WebP indisponivel'), `aviso de WebP ausente no stderr: ${JSON.stringify(stderr)}`);
    assertTrue(stderr.includes('Erro ao recortar imagem no canvas'), `aviso de erro de recorte ausente no stderr: ${JSON.stringify(stderr)}`);
  });

  await run('getCroppedDataUrl: sem imagem carregada devolve a fonte original', async () => {
    const { cropper } = makeCropper({ dims: { width: 400, height: 400 } });
    const output = cropper.getCroppedDataUrl(800);
    assertEqual(output, '', 'saida sem imagem');
    assertEqual(env.state.canvases.length, 0, 'nenhum canvas criado');
  });

  // ------------------------------------------------------------- migracao em lote
  await run('media-migration: reconhece somente Base64 de imagem fora do formato WebP', async () => {
    assertTrue(isLegacyJpegMedia('data:image/jpeg;base64,LEGACY') === true, 'JPEG Base64 deveria ser legado');
    assertTrue(isLegacyJpegMedia('data:image/png;base64,LEGACY') === true, 'PNG Base64 deveria ser legado');
    assertTrue(isLegacyJpegMedia('data:image/webp;base64,OK') === false, 'WebP Base64 nao e legado');
    assertTrue(isLegacyJpegMedia('assets/products/bolsa_punk.jpg') === false, 'ativo de fabrica nao e Base64 legado');
    assertTrue(isLegacyJpegMedia({ url: 'data:image/jpeg;base64,LEGACY' }) === true, 'objeto com url Base64 JPEG deveria ser legado');
    assertTrue(isLegacyJpegMedia(null) === false, 'entrada nula nao e legado');
  });

  await run('media-migration: mapa de ativos de fabrica deriva .jpg -> .webp real', async () => {
    const map = buildFactoryWebpLegacyMap();
    assertEqual(map.get('assets/products/bolsa_punk.jpg'), 'assets/products/bolsa_punk.webp', 'par bolsa-punk');
    assertEqual(map.get('assets/products/blusa_teia_detail.jpg'), undefined, 'nao inventa ativo inexistente');
    assertEqual(map.get('assets/products/tote_cherry_detail.jpg'), 'assets/products/tote_cherry_detail.webp', 'par de detalhe');
  });

  await run('optimizeStoredProductsMedia: converte Base64 legado e remapeia ativos de fabrica', async () => {
    const legacySource = [
      {
        id: 'peca-legada',
        image: 'data:image/jpeg;base64,COVER-LEGADO',
        images: ['data:image/jpeg;base64,GALERIA-LEGADA', 'assets/products/bolsa_punk_detail.jpg']
      },
      {
        id: 'blusa-teia',
        image: 'assets/products/blusa_teia.jpg',
        images: [{ url: 'assets/products/blusa_teia_loop.mp4', poster: 'assets/products/blusa_teia_loop_poster.jpg' }]
      },
      {
        id: 'peca-ja-otimizada',
        image: 'data:image/webp;base64,JA-EM-WEBP',
        images: ['data:image/webp;base64,JA-EM-WEBP', 'assets/products/bolsa_punk.webp']
      }
    ];

    env.reset({ width: 1600, height: 1200 }, 'supported');
    const result = await optimizeStoredProductsMedia(legacySource);
    assertEqual(result.total, 3, 'total de pecas');
    assertEqual(result.scanned, 3, 'pecas escaneadas');
    assertEqual(result.converted, 2, 'fotos Base64 convertidas');
    assertEqual(result.remapped, 3, 'ativos de fabrica remapeados');
    assertEqual(result.failed, 0, 'nenhuma falha');
    assertTrue(result.updated === true, 'resultado marcado como atualizado');

    const [legacy, blusa, alreadyWebp] = result.catalog;
    assertTrue(legacy.image.startsWith('data:image/webp'), `capa legada deveria virar WebP: ${legacy.image}`);
    assertTrue(legacy.images[0].startsWith('data:image/webp'), 'galeria legada deveria virar WebP');
    assertEqual(legacy.images[1], 'assets/products/bolsa_punk_detail.webp', 'detalhe de fabrica remapeado para WebP');
    assertEqual(blusa.image, 'assets/products/blusa_teia.webp', 'capa de fabrica remapeada para WebP');
    assertEqual(blusa.images[0].poster, 'assets/products/blusa_teia_loop_poster.webp', 'poster do video remapeado para WebP');
    assertEqual(blusa.images[0].url, 'assets/products/blusa_teia_loop.mp4', 'video preservado');
    assertEqual(alreadyWebp.image, 'data:image/webp;base64,JA-EM-WEBP', 'WebP existente nao e convertido');
    assertEqual(legacySource[0].image, 'data:image/jpeg;base64,COVER-LEGADO', 'entrada original nao e mutada');
    assertEqual(env.state.canvases[0].width, 800, 'largura Retina do canvas');
    assertEqual(env.state.canvases[0].height, 600, 'altura proporcional do canvas');
  });

  await run('optimizeStoredProductsMedia: segunda execucao e idempotente', async () => {
    const input = [{
      id: 'idempotente',
      image: 'data:image/jpeg;base64,LEGADO',
      images: ['assets/products/tote_cherry.jpg']
    }];
    env.reset({ width: 1600, height: 1200 }, 'supported');
    const first = await optimizeStoredProductsMedia(input);
    const second = await optimizeStoredProductsMedia(first.catalog);
    assertTrue(second.updated === false, 'segunda execucao nao deveria alterar nada');
    assertEqual(second.converted, 0, 'nenhuma conversao na segunda execucao');
    assertEqual(second.remapped, 0, 'nenhum remapeamento na segunda execucao');
    assertEqual(JSON.stringify(second.catalog), JSON.stringify(first.catalog), 'estado final identico');
  });

  await run('optimizeStoredProductsMedia: falha de codificacao preserva a foto original', async () => {
    env.reset({ width: 1600, height: 1200 }, 'throws-all');
    const input = [{ id: 'corrompida', image: 'data:image/jpeg;base64,LEGADO' }];
    let result = null;
    await captureStderr(async () => {
      result = await optimizeStoredProductsMedia(input);
    });
    assertEqual(result.failed, 1, 'falha contabilizada');
    assertEqual(result.converted, 0, 'nenhuma conversao em falha');
    assertTrue(result.updated === false, 'sem atualizacao quando a conversao falha');
    assertEqual(result.catalog[0].image, 'data:image/jpeg;base64,LEGADO', 'foto original preservada em falha');
  });

  await run('optimizeStoredProductsMedia: entradas nulas sao ignoradas defensivamente', async () => {
    const result = await optimizeStoredProductsMedia([null, undefined, 'texto', 42]);
    assertEqual(result.total, 4, 'total preservado');
    assertEqual(result.scanned, 0, 'nenhuma peca escaneada');
    assertTrue(result.updated === false, 'sem atualizacao');
  });

  env.uninstall();
  console.log(RESULTS_PREFIX + JSON.stringify({ results }));
})().catch((err) => {
  console.log(RESULTS_PREFIX + JSON.stringify({
    results: [{ name: 'execucao do harness JEZ-041', ok: false, detail: (err && err.stack) || String(err) }]
  }));
});
