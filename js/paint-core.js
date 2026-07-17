// ==========================================================================
// PAINT - REFERENCIAS Y ESTADO GLOBAL
// ==========================================================================

let paintCanvas;
let paintCtx;
let paintAreaCanvas;

// Herramienta y colores
let paintHerramientaActual = 'lapiz';
let paintUltimaHerramienta = 'lapiz';
let paintColorPrimario = '#000000';
let paintColorSecundario = '#FFFFFF';

// Estado del dibujo
let paintDibujando = false;
let paintBotonMouse = 0;
let paintUltimoX = 0;
let paintUltimoY = 0;
let paintSnapshot = null;
let paintModoRelleno = 'borde';

// Categorías de herramientas
const paintHerramientasBasicas = ['lapiz', 'pincel', 'goma', 'aerografo'];
const paintHerramientasForma = ['linea', 'rectangulo', 'elipse', 'rect-redondeado'];
const paintHerramientasConRelleno = ['rectangulo', 'elipse', 'rect-redondeado', 'poligono'];

// Formas
let paintFormaInicioX = 0;
let paintFormaInicioY = 0;
let paintDibujandoForma = false;

// Curva
let paintCurvaEstado = 0;
let paintCurvaX1 = 0, paintCurvaY1 = 0;
let paintCurvaX2 = 0, paintCurvaY2 = 0;
let paintCurvaCX1 = 0, paintCurvaCY1 = 0;

// Polígono
let paintPoligonoPuntos = [];
let paintPoligonoActivo = false;

// Pincel
let paintPincelForma = 'circulo';
let paintPincelTamano = 'medio';
const paintPincelTamanos = { chico: 3, medio: 5, grande: 8 };

// Aerógrafo
let paintAerografoTamano = 'medio';
const paintAerografoConfig = {
  chico:  { radio: 5,  cantidad: 4 },
  medio:  { radio: 9,  cantidad: 8 },
  grande: { radio: 14, cantidad: 14 }
};

// Goma y grosor
let paintGomaTamano = 8;
let paintGrosorLinea = 1;

// Lupa
let paintZoom = 1;
let paintAnchoBase = 0;
let paintAltoBase = 0;

// Texto
let paintTextoActivo = false;
let paintTextoX = 0;
let paintTextoY = 0;
let paintTextoAncho = 0;
let paintTextoAlto = 0;
let paintTextoFondoOpaco = false;

// Selección
let paintSeleccionActiva = false;
let paintSeleccionDibujando = false;
let paintSeleccionArrastrando = false;
let paintSeleccionX = 0;
let paintSeleccionY = 0;
let paintSeleccionAncho = 0;
let paintSeleccionAlto = 0;
let paintSeleccionOffsetX = 0;
let paintSeleccionOffsetY = 0;
let paintSeleccionImg = null;
let paintSeleccionMascara = null;
let paintSeleccionModoOpaco = true;
let paintSeleccionPuntosLasso = [];
let paintSeleccionAntsOffset = 0;
let paintSeleccionAntsInterval = null;
let paintPortapapeles = null;

// Historial
const paintHistorial = [];
const paintHistorialRedo = [];
const PAINT_HISTORIAL_MAX = 15;

// Archivo
let paintNombreArchivo = 'untitled';
let paintHayCambios = false;
let paintDialogSaveCallback = null;
let paintDialogSaveAsCallback = null;


// ==========================================================================
// PAINT - BUFFER PERSISTENTE
// ==========================================================================

const paintBuffer = document.createElement('canvas');
paintBuffer.width = 2000;
paintBuffer.height = 2000;
const paintBufferCtx = paintBuffer.getContext('2d');
paintBufferCtx.fillStyle = '#FFFFFF';
paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);


// ==========================================================================
// PAINT - PALETA DE COLORES INICIAL
// ==========================================================================

const coloresPaleta = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080',
  '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080',
  '#4000FF', '#804000',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF',
  '#0000FF', '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#8080FF',
  '#FF0080', '#FF8040'
];

function inicializarPaletaPaint() {
  const paletaContenedor = document.querySelector('.paint-paleta');
  coloresPaleta.forEach(color => {
    const celda = document.createElement('div');
    celda.className = 'paint-color-celda';
    celda.style.background = color;
    celda.dataset.color = color;
    paletaContenedor.appendChild(celda);
  });
}


// ==========================================================================
// PAINT - AJUSTAR CANVAS
// ==========================================================================

function paintAjustarCanvas() {
  const rect = paintAreaCanvas.getBoundingClientRect();
  let nuevoAncho, nuevoAlto;

  if (paintZoom === 1) {
    nuevoAncho = Math.max(1, Math.floor(rect.width - 4));
    nuevoAlto = Math.max(1, Math.floor(rect.height - 4));
    paintAnchoBase = nuevoAncho;
    paintAltoBase = nuevoAlto;
  } else {
    nuevoAncho = paintAnchoBase;
    nuevoAlto = paintAltoBase;
  }

  if (nuevoAncho > paintBuffer.width || nuevoAlto > paintBuffer.height) {
    const bufferAnterior = document.createElement('canvas');
    bufferAnterior.width = paintBuffer.width;
    bufferAnterior.height = paintBuffer.height;
    bufferAnterior.getContext('2d').drawImage(paintBuffer, 0, 0);

    paintBuffer.width = Math.max(nuevoAncho, paintBuffer.width);
    paintBuffer.height = Math.max(nuevoAlto, paintBuffer.height);
    paintBufferCtx.fillStyle = '#FFFFFF';
    paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);
    paintBufferCtx.drawImage(bufferAnterior, 0, 0);
  }

  if (paintCanvas.width !== nuevoAncho || paintCanvas.height !== nuevoAlto) {
    paintCanvas.width = nuevoAncho;
    paintCanvas.height = nuevoAlto;
  }

  paintCanvas.style.width = (nuevoAncho * paintZoom) + 'px';
  paintCanvas.style.height = (nuevoAlto * paintZoom) + 'px';

  paintCtx.drawImage(paintBuffer, 0, 0);

  if (paintSeleccionActiva) paintRedibujarSeleccion();

  document.getElementById('paintTamano').textContent =
    paintCanvas.width + ' x ' + paintCanvas.height;
}


// ==========================================================================
// PAINT - HELPERS GENERALES
// ==========================================================================

function paintGuardarSnapshot() {
  paintSnapshot = document.createElement('canvas');
  paintSnapshot.width = paintCanvas.width;
  paintSnapshot.height = paintCanvas.height;
  paintSnapshot.getContext('2d').drawImage(paintCanvas, 0, 0);
}

function paintSeleccionarHerramienta(tool) {
  const btn = document.querySelector(`.paint-btn[data-tool="${tool}"]`);
  if (btn) btn.click();
}

function paintCancelarOperaciones() {
  if (paintCurvaEstado !== 0) {
    paintCurvaEstado = 0;
    if (paintSnapshot) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintSnapshot = null;
    }
  }
  if (paintPoligonoActivo) {
    paintPoligonoActivo = false;
    paintPoligonoPuntos = [];
    if (paintSnapshot) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintSnapshot = null;
    }
  }
  paintDibujandoForma = false;
}

function paintRgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function paintObtenerCoords(e) {
  const rect = paintCanvas.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - rect.left) / paintZoom),
    y: Math.floor((e.clientY - rect.top) / paintZoom)
  };
}


// ==========================================================================
// PAINT - APLICAR ZOOM
// ==========================================================================

function paintAplicarZoom(nuevoZoom, centroX, centroY) {
  paintZoom = nuevoZoom;
  paintCanvas.style.width = (paintAnchoBase * paintZoom) + 'px';
  paintCanvas.style.height = (paintAltoBase * paintZoom) + 'px';

  if (centroX !== undefined && centroY !== undefined) {
    setTimeout(() => {
      const areaRect = paintAreaCanvas.getBoundingClientRect();
      const scrollX = (centroX * paintZoom) - (areaRect.width / 2);
      const scrollY = (centroY * paintZoom) - (areaRect.height / 2);
      paintAreaCanvas.scrollLeft = Math.max(0, scrollX);
      paintAreaCanvas.scrollTop = Math.max(0, scrollY);
    }, 0);
  }

  if (paintHerramientaActual === 'lupa') {
    document.querySelectorAll('#paintOpcionesHerramienta .paint-fill-btn').forEach(b => {
      if (parseInt(b.dataset.zoom) === paintZoom) b.classList.add('activo');
      else b.classList.remove('activo');
    });
  }

  if (paintSeleccionActiva) paintRedibujarSeleccion();
}


// ==========================================================================
// PAINT - COLORES (paleta y editor)
// ==========================================================================

function paintActualizarColorPrimario(color) {
  paintColorPrimario = color;
  document.getElementById('paintColorPrimario').style.background = color;
}

function paintActualizarColorSecundario(color) {
  paintColorSecundario = color;
  document.getElementById('paintColorSecundario').style.background = color;
}

function inicializarColoresPaint() {
  document.getElementById('paintColorPrimario').addEventListener('dblclick', function() {
    paintAbrirDialogoEditColors('primario');
  });

  document.getElementById('paintColorSecundario').addEventListener('dblclick', function() {
    paintAbrirDialogoEditColors('secundario');
  });

  document.querySelectorAll('.paint-color-celda').forEach(celda => {
    celda.addEventListener('click', () => paintActualizarColorPrimario(celda.dataset.color));
    celda.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      paintActualizarColorSecundario(celda.dataset.color);
    });
  });
}