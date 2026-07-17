// ==========================================================================
// PAINT - DIBUJO DE FORMAS
// ==========================================================================

function paintDibujarForma(ctx, x1, y1, x2, y2) {
  let colorBorde, colorRelleno;
  if (paintBotonMouse === 2) {
    colorBorde = paintColorSecundario;
    colorRelleno = paintColorPrimario;
  } else {
    colorBorde = paintColorPrimario;
    colorRelleno = paintColorSecundario;
  }
  const grosor = paintGrosorLinea;

  if (paintHerramientaActual === 'linea') {
    ctx.strokeStyle = colorBorde;
    ctx.lineWidth = grosor;
    ctx.lineCap = (grosor === 1) ? 'butt' : 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }

  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);

  const rellenoActivo = (paintModoRelleno === 'relleno' || paintModoRelleno === 'borde-relleno');
  const bordeActivo   = (paintModoRelleno === 'borde'   || paintModoRelleno === 'borde-relleno');

  if (paintHerramientaActual === 'rectangulo') {
    if (rellenoActivo) {
      ctx.fillStyle = colorRelleno;
      ctx.fillRect(x, y, w, h);
    }
    if (bordeActivo) {
      ctx.strokeStyle = colorBorde;
      ctx.lineWidth = grosor;
      ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    }
  }
  else if (paintHerramientaActual === 'elipse') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (rellenoActivo) { ctx.fillStyle = colorRelleno; ctx.fill(); }
    if (bordeActivo)   { ctx.strokeStyle = colorBorde; ctx.lineWidth = grosor; ctx.stroke(); }
  }
  else if (paintHerramientaActual === 'rect-redondeado') {
    const radio = Math.min(10, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radio, y);
    ctx.lineTo(x + w - radio, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radio);
    ctx.lineTo(x + w, y + h - radio);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radio, y + h);
    ctx.lineTo(x + radio, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radio);
    ctx.lineTo(x, y + radio);
    ctx.quadraticCurveTo(x, y, x + radio, y);
    ctx.closePath();
    if (rellenoActivo) { ctx.fillStyle = colorRelleno; ctx.fill(); }
    if (bordeActivo)   { ctx.strokeStyle = colorBorde; ctx.lineWidth = grosor; ctx.stroke(); }
  }
}


// ==========================================================================
// PAINT - CURVA (Bézier)
// ==========================================================================

function paintDibujarLineaSimple(ctx, x1, y1, x2, y2) {
  const color = (paintBotonMouse === 2) ? paintColorSecundario : paintColorPrimario;
  ctx.strokeStyle = color;
  ctx.lineWidth = paintGrosorLinea;
  ctx.lineCap = (paintGrosorLinea === 1) ? 'butt' : 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function paintDibujarCurva(ctx, x1, y1, arg3, arg4, arg5, arg6) {
  const color = (paintBotonMouse === 2) ? paintColorSecundario : paintColorPrimario;
  ctx.strokeStyle = color;
  ctx.lineWidth = paintGrosorLinea;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  if (paintCurvaEstado === 1) {
    ctx.quadraticCurveTo(arg5, arg6, arg3, arg4);
  } else if (paintCurvaEstado === 2) {
    ctx.bezierCurveTo(arg3, arg4, arg5, arg6, paintCurvaX2, paintCurvaY2);
  }
  ctx.stroke();
}


// ==========================================================================
// PAINT - POLÍGONO
// ==========================================================================

function paintDibujarPoligonoPreview(mouseX, mouseY) {
  const colorBorde = (paintBotonMouse === 2) ? paintColorSecundario : paintColorPrimario;
  paintCtx.strokeStyle = colorBorde;
  paintCtx.lineWidth = paintGrosorLinea;
  paintCtx.lineCap = 'round';
  paintCtx.beginPath();
  paintCtx.moveTo(paintPoligonoPuntos[0].x, paintPoligonoPuntos[0].y);
  for (let i = 1; i < paintPoligonoPuntos.length; i++) {
    paintCtx.lineTo(paintPoligonoPuntos[i].x, paintPoligonoPuntos[i].y);
  }
  paintCtx.lineTo(mouseX, mouseY);
  paintCtx.stroke();
}

function paintFinalizarPoligono() {
  if (paintPoligonoPuntos.length < 2) {
    paintPoligonoActivo = false;
    paintPoligonoPuntos = [];
    if (paintSnapshot) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintSnapshot = null;
    }
    return;
  }

  let colorBorde, colorRelleno;
  if (paintBotonMouse === 2) {
    colorBorde = paintColorSecundario;
    colorRelleno = paintColorPrimario;
  } else {
    colorBorde = paintColorPrimario;
    colorRelleno = paintColorSecundario;
  }

  paintCtx.drawImage(paintSnapshot, 0, 0);
  [paintCtx, paintBufferCtx].forEach(ctx => {
    ctx.beginPath();
    ctx.moveTo(paintPoligonoPuntos[0].x, paintPoligonoPuntos[0].y);
    for (let i = 1; i < paintPoligonoPuntos.length; i++) {
      ctx.lineTo(paintPoligonoPuntos[i].x, paintPoligonoPuntos[i].y);
    }
    ctx.closePath();
    if (paintModoRelleno === 'relleno' || paintModoRelleno === 'borde-relleno') {
      ctx.fillStyle = colorRelleno;
      ctx.fill();
    }
    if (paintModoRelleno === 'borde' || paintModoRelleno === 'borde-relleno') {
      ctx.strokeStyle = colorBorde;
      ctx.lineWidth = paintGrosorLinea;
      ctx.stroke();
    }
  });

  paintPoligonoActivo = false;
  paintPoligonoPuntos = [];
  paintSnapshot = null;
}