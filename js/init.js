// ==========================================================================
// INICIALIZACIÓN GLOBAL DEL SISTEMA
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {

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
  document.getElementById('paintColorPrimario').style.background = paintColorPrimario;
  document.getElementById('paintColorSecundario').style.background = paintColorSecundario;

  // Renderizar opciones de la herramienta inicial (lápiz)
  paintRenderizarOpciones();

  // Observador para ajustar el canvas cuando la ventana cambia de tamaño
  const observadorPaint = new ResizeObserver(() => {
    if (document.getElementById('paint').style.display === 'block') {
      paintAjustarCanvas();
    }
  });
  observadorPaint.observe(paintAreaCanvas);

  // --- Galería / My Pictures ---
  inicializarCargaGaleria();
  inicializarEventosGaleria();

  console.log('✨ Escritorio XP iniciado correctamente');
});