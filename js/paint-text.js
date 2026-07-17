// ==========================================================================
// PAINT - TEXTO
// ==========================================================================

let paintTextarea;
let paintTextToolbar;
let paintTextFuente;
let paintTextTamano;
let paintTextBold;
let paintTextItalic;
let paintTextUnderline;

function paintAplicarEstiloTextarea() {
  paintTextarea.style.fontFamily = paintTextFuente.value;
  paintTextarea.style.fontSize = paintTextTamano.value + 'px';
  paintTextarea.style.fontWeight = paintTextBold.classList.contains('activo') ? 'bold' : 'normal';
  paintTextarea.style.fontStyle = paintTextItalic.classList.contains('activo') ? 'italic' : 'normal';
  paintTextarea.style.textDecoration = paintTextUnderline.classList.contains('activo') ? 'underline' : 'none';
  paintTextarea.style.color = paintColorPrimario;
  paintTextarea.style.background = paintTextoFondoOpaco ? paintColorSecundario : 'transparent';
}

function inicializarTextoPaint() {
  paintTextarea = document.getElementById('paintTextarea');
  paintTextToolbar = document.getElementById('paintTextToolbar');
  paintTextFuente = document.getElementById('paintTextFuente');
  paintTextTamano = document.getElementById('paintTextTamano');
  paintTextBold = document.getElementById('paintTextBold');
  paintTextItalic = document.getElementById('paintTextItalic');
  paintTextUnderline = document.getElementById('paintTextUnderline');

  paintTextFuente.addEventListener('change', paintAplicarEstiloTextarea);
  paintTextTamano.addEventListener('change', paintAplicarEstiloTextarea);

  [paintTextBold, paintTextItalic, paintTextUnderline].forEach(btn => {
    btn.addEventListener('click', function() {
      btn.classList.toggle('activo');
      paintAplicarEstiloTextarea();
    });
  });
}

function paintAbrirTextarea(x, y, w, h) {
  paintTextoActivo = true;
  paintTextoX = x;
  paintTextoY = y;
  paintTextoAncho = w;
  paintTextoAlto = h;

  paintTextarea.value = '';
  paintTextarea.style.display = 'block';
  paintTextarea.style.left = (x + 2) + 'px';
  paintTextarea.style.top = (y + 2) + 'px';
  paintTextarea.style.width = w + 'px';
  paintTextarea.style.height = h + 'px';
  paintAplicarEstiloTextarea();

  paintTextToolbar.style.display = 'flex';
  setTimeout(() => {
    const toolbarAlto = paintTextToolbar.offsetHeight;
    let toolbarTop = y + 2 - toolbarAlto - 4;
    if (toolbarTop < 0) toolbarTop = y + 2 + h + 4;
    paintTextToolbar.style.left = (x + 2) + 'px';
    paintTextToolbar.style.top = toolbarTop + 'px';
  }, 0);

  paintTextarea.focus();
}

function paintEstamparTexto() {
  if (!paintTextoActivo) return;
  const texto = paintTextarea.value;
  if (texto.trim() !== '') {
    paintGuardarEnHistorial();
    const fuente = paintTextFuente.value;
    const tam = parseInt(paintTextTamano.value);
    const bold = paintTextBold.classList.contains('activo') ? 'bold ' : '';
    const italic = paintTextItalic.classList.contains('activo') ? 'italic ' : '';
    const underline = paintTextUnderline.classList.contains('activo');
    const fontStr = italic + bold + tam + 'px "' + fuente + '"';

    [paintCtx, paintBufferCtx].forEach(ctx => {
      if (paintTextoFondoOpaco) {
        ctx.fillStyle = paintColorSecundario;
        ctx.fillRect(paintTextoX, paintTextoY, paintTextoAncho, paintTextoAlto);
      }
      ctx.fillStyle = paintColorPrimario;
      ctx.font = fontStr;
      ctx.textBaseline = 'top';
      const lineas = texto.split('\n');
      const lineHeight = tam * 1.15;
      lineas.forEach((linea, i) => {
        ctx.fillText(linea, paintTextoX + 2, paintTextoY + 2 + i * lineHeight);
        if (underline && linea.length > 0) {
          const anchoTexto = ctx.measureText(linea).width;
          ctx.fillRect(paintTextoX + 2, paintTextoY + 2 + i * lineHeight + tam, anchoTexto, 1);
        }
      });
    });
  }
  paintCerrarTextarea();
}

function paintCerrarTextarea() {
  paintTextoActivo = false;
  paintTextarea.style.display = 'none';
  paintTextToolbar.style.display = 'none';
}