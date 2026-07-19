// ==========================================================================
// INICIALIZACIÓN GLOBAL DEL SISTEMA
// ==========================================================================

async function iniciarEscritorioXP() {
  console.log('📦 Cargando componentes...');

  // Cargar todas las ventanas y diálogos dinámicamente
  const componentesCargados = await loadAllComponents();

  if (!componentesCargados) {
    console.error('❌ No se pudieron cargar todos los componentes. La aplicación puede no funcionar correctamente.');
  }

  // Dar un pequeño respiro al DOM para que los elementos se inserten completamente
  await new Promise(resolve => requestAnimationFrame(resolve));
  await new Promise(resolve => setTimeout(resolve, 50));

  // --- Referencias del Paint (con chequeos defensivos) ---
  paintCanvas = document.getElementById('paintCanvas');
  paintAreaCanvas = document.getElementById('paintAreaCanvas');

  if (!paintCanvas) {
    console.error('❌ No se encontró el canvas de Paint después de cargar los componentes.');
    console.warn('Paint no se inicializará.');
  } else {
    paintCtx = paintCanvas.getContext('2d');
    if (!paintCtx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas de Paint.');
    } else {
      console.log('✅ Canvas de Paint inicializado correctamente');
    }
  }

  const paintDisponible = !!(paintCanvas && paintCtx);

  // --- Ventanas y escritorio ---
  inicializarVentanas();
  inicializarEscritorio();

  // --- Reloj ---
  iniciarReloj();

  // --- VLC ---
  inicializarVLC();

  // --- Paint (solo si el canvas existe) ---
  if (paintDisponible) {
    inicializarPaletaPaint();
    inicializarColoresPaint();
    inicializarHerramientasPaint();
    inicializarEventosCanvasPaint();
    inicializarTextoPaint();
    inicializarMenusPaint();
    inicializarAtajosPaint();
    inicializarCierrePaint();
    inicializarEditColors();
  } else {
    console.warn('⚠️ Saltando inicialización de Paint (canvas no disponible)');
  }

  // Colores iniciales del Paint (solo si Paint está disponible)
  if (paintDisponible) {
    const colorPrimario = document.getElementById('paintColorPrimario');
    const colorSecundario = document.getElementById('paintColorSecundario');
    if (colorPrimario) colorPrimario.style.background = paintColorPrimario;
    if (colorSecundario) colorSecundario.style.background = paintColorSecundario;

    // Renderizar opciones de la herramienta inicial (lápiz)
    if (typeof paintRenderizarOpciones === 'function') {
      paintRenderizarOpciones();
    }
  }

  // Observador para ajustar el canvas cuando la ventana cambia de tamaño
  if (paintAreaCanvas) {
    const observadorPaint = new ResizeObserver(() => {
      const paintWindow = document.getElementById('paint');
      if (paintWindow && paintWindow.style.display === 'block') {
        paintAjustarCanvas();
      }
    });
    observadorPaint.observe(paintAreaCanvas);
  }

  // --- Galería / My Pictures ---
  if (typeof inicializarCargaGaleria === 'function') {
    inicializarCargaGaleria();
  }
  if (typeof inicializarEventosGaleria === 'function') {
    inicializarEventosGaleria();
  }

  console.log('✨ Escritorio XP iniciado correctamente');
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciarEscritorioXP);