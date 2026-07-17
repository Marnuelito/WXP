// ==========================================================================
// INICIALIZACIÓN GLOBAL DEL SISTEMA
// ==========================================================================

async function iniciarEscritorioXP() {
  console.log('📦 Cargando componentes...');

  // Cargar todas las ventanas y diálogos dinámicamente
  const componentesCargados = await loadAllComponents();

  if (!componentesCargados) {
    console.error('❌ No se pudieron cargar todos los componentes. La aplicación puede no funcionar correctamente.');
    // Continuamos de todas formas por si acaso
  }

  // --- Referencias del Paint ---
  paintCanvas = document.getElementById('paintCanvas');
  paintCtx = paintCanvas.getContext('2d');
  paintAreaCanvas = document.getElementById('paintAreaCanvas');

  // --- Ventanas y escritorio ---
  inicializarVentanas();
  inicializarEscritorio();

  // --- Reloj ---
  iniciarReloj();

  // --- VLC ---
  inicializarVLC();

  // --- Paint ---
  inicializarPaletaPaint();
  inicializarColoresPaint();
  inicializarHerramientasPaint();
  inicializarEventosCanvasPaint();
  inicializarTextoPaint();
  inicializarMenusPaint();
  inicializarAtajosPaint();
  inicializarCierrePaint();
  inicializarEditColors();

  // Colores iniciales del Paint
  const colorPrimario = document.getElementById('paintColorPrimario');
  const colorSecundario = document.getElementById('paintColorSecundario');
  if (colorPrimario) colorPrimario.style.background = paintColorPrimario;
  if (colorSecundario) colorSecundario.style.background = paintColorSecundario;

  // Renderizar opciones de la herramienta inicial (lápiz)
  if (typeof paintRenderizarOpciones === 'function') {
    paintRenderizarOpciones();
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