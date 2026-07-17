// ==========================================================================
// PAINT - SELECCIÓN
// ==========================================================================

function paintDibujarRectanguloAnts(x, y, w, h, offset) {
  paintCtx.save();
  paintCtx.strokeStyle = '#000';
  paintCtx.lineWidth = 1;
  paintCtx.setLineDash([4, 4]);
  paintCtx.lineDashOffset = -offset;
  paintCtx.strokeRect(x + 0.5, y + 0.5, w, h);
  paintCtx.strokeStyle = '#fff';
  paintCtx.lineDashOffset = -offset + 4;
  paintCtx.strokeRect(x + 0.5, y + 0.5, w, h);
  paintCtx.restore();
}

function paintIniciarAnts() {
  if (paintSeleccionAntsInterval) clearInterval(paintSeleccionAntsInterval);
  paintSeleccionAntsInterval = setInterval(() => {
    if (!paintSeleccionActiva) {
      clearInterval(paintSeleccionAntsInterval);
      paintSeleccionAntsInterval = null;
      return;
    }
    paintSeleccionAntsOffset = (paintSeleccionAntsOffset + 1) % 8;
    paintRedibujarSeleccion();
  }, 100);
}

function paintRedibujarSeleccion() {
  paintCtx.drawImage(paintBuffer, 0, 0);
  if (paintSeleccionImg) {
    if (paintSeleccionModoOpaco) {
      paintCtx.drawImage(paintSeleccionImg, paintSeleccionX, paintSeleccionY);
    } else {
      paintDibujarSeleccionTransparente();
    }
  }
  paintDibujarRectanguloAnts(
    paintSeleccionX, paintSeleccionY,
    paintSeleccionAncho, paintSeleccionAlto,
    paintSeleccionAntsOffset
  );
}

function paintDibujarSeleccionTransparente() {
  const tmp = document.createElement('canvas');
  tmp.width = paintSeleccionImg.width;
  tmp.height = paintSeleccionImg.height;
  const tmpCtx = tmp.getContext('2d');
  tmpCtx.drawImage(paintSeleccionImg, 0, 0);
  const imgData = tmpCtx.getImageData(0, 0, tmp.width, tmp.height);
  const data = imgData.data;
  const secR = parseInt(paintColorSecundario.slice(1, 3), 16);
  const secG = parseInt(paintColorSecundario.slice(3, 5), 16);
  const secB = parseInt(paintColorSecundario.slice(5, 7), 16);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === secR && data[i+1] === secG && data[i+2] === secB) {
      data[i+3] = 0;
    }
  }
  tmpCtx.putImageData(imgData, 0, 0);
  paintCtx.drawImage(tmp, paintSeleccionX, paintSeleccionY);
}

function paintCrearSeleccionRect(x, y, w, h) {
  paintGuardarEnHistorial();
  paintSeleccionImg = document.createElement('canvas');
  paintSeleccionImg.width = w;
  paintSeleccionImg.height = h;
  paintSeleccionImg.getContext('2d').drawImage(paintBuffer, x, y, w, h, 0, 0, w, h);
  paintSeleccionMascara = null;

  paintBufferCtx.fillStyle = paintColorSecundario;
  paintBufferCtx.fillRect(x, y, w, h);

  paintSeleccionX = x;
  paintSeleccionY = y;
  paintSeleccionAncho = w;
  paintSeleccionAlto = h;
  paintSeleccionActiva = true;
  paintSnapshot = null;
  paintRedibujarSeleccion();
  paintIniciarAnts();
}

function paintCrearSeleccionLibre() {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  paintSeleccionPuntosLasso.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });
  const w = maxX - minX;
  const h = maxY - minY;

  if (w < 2 || h < 2) {
    paintCtx.drawImage(paintSnapshot, 0, 0);
    paintSnapshot = null;
    paintSeleccionPuntosLasso = [];
    return;
  }

  paintGuardarEnHistorial();

  const mascara = document.createElement('canvas');
  mascara.width = w;
  mascara.height = h;
  const mctx = mascara.getContext('2d');
  mctx.fillStyle = '#fff';
  mctx.beginPath();
  mctx.moveTo(paintSeleccionPuntosLasso[0].x - minX, paintSeleccionPuntosLasso[0].y - minY);
  for (let i = 1; i < paintSeleccionPuntosLasso.length; i++) {
    mctx.lineTo(paintSeleccionPuntosLasso[i].x - minX, paintSeleccionPuntosLasso[i].y - minY);
  }
  mctx.closePath();
  mctx.fill();

  paintSeleccionImg = document.createElement('canvas');
  paintSeleccionImg.width = w;
  paintSeleccionImg.height = h;
  const sctx = paintSeleccionImg.getContext('2d');
  sctx.drawImage(mascara, 0, 0);
  sctx.globalCompositeOperation = 'source-in';
  sctx.drawImage(paintBuffer, minX, minY, w, h, 0, 0, w, h);
  sctx.globalCompositeOperation = 'source-over';
  paintSeleccionMascara = mascara;

  paintBufferCtx.save();
  paintBufferCtx.beginPath();
  paintBufferCtx.moveTo(paintSeleccionPuntosLasso[0].x, paintSeleccionPuntosLasso[0].y);
  for (let i = 1; i < paintSeleccionPuntosLasso.length; i++) {
    paintBufferCtx.lineTo(paintSeleccionPuntosLasso[i].x, paintSeleccionPuntosLasso[i].y);
  }
  paintBufferCtx.closePath();
  paintBufferCtx.clip();
  paintBufferCtx.fillStyle = paintColorSecundario;
  paintBufferCtx.fillRect(minX, minY, w, h);
  paintBufferCtx.restore();

  paintSeleccionX = minX;
  paintSeleccionY = minY;
  paintSeleccionAncho = w;
  paintSeleccionAlto = h;
  paintSeleccionActiva = true;
  paintSeleccionPuntosLasso = [];
  paintSnapshot = null;
  paintRedibujarSeleccion();
  paintIniciarAnts();
}

function paintConfirmarSeleccion() {
  if (!paintSeleccionActiva) return;
  if (paintSeleccionModoOpaco) {
    paintBufferCtx.drawImage(paintSeleccionImg, paintSeleccionX, paintSeleccionY);
  } else {
    const tmp = document.createElement('canvas');
    tmp.width = paintSeleccionImg.width;
    tmp.height = paintSeleccionImg.height;
    const tmpCtx = tmp.getContext('2d');
    tmpCtx.drawImage(paintSeleccionImg, 0, 0);
    const imgData = tmpCtx.getImageData(0, 0, tmp.width, tmp.height);
    const data = imgData.data;
    const secR = parseInt(paintColorSecundario.slice(1, 3), 16);
    const secG = parseInt(paintColorSecundario.slice(3, 5), 16);
    const secB = parseInt(paintColorSecundario.slice(5, 7), 16);
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === secR && data[i+1] === secG && data[i+2] === secB) {
        data[i+3] = 0;
      }
    }
    tmpCtx.putImageData(imgData, 0, 0);
    paintBufferCtx.drawImage(tmp, paintSeleccionX, paintSeleccionY);
  }
  paintSeleccionActiva = false;
  paintSeleccionImg = null;
  paintSeleccionMascara = null;
  if (paintSeleccionAntsInterval) {
    clearInterval(paintSeleccionAntsInterval);
    paintSeleccionAntsInterval = null;
  }
  paintCtx.drawImage(paintBuffer, 0, 0);
}

function paintBorrarSeleccion() {
  if (!paintSeleccionActiva) return;
  paintSeleccionActiva = false;
  paintSeleccionImg = null;
  paintSeleccionMascara = null;
  if (paintSeleccionAntsInterval) {
    clearInterval(paintSeleccionAntsInterval);
    paintSeleccionAntsInterval = null;
  }
  paintCtx.drawImage(paintBuffer, 0, 0);
}

function paintCopiarSeleccion() {
  if (!paintSeleccionActiva) return;
  paintPortapapeles = document.createElement('canvas');
  paintPortapapeles.width = paintSeleccionImg.width;
  paintPortapapeles.height = paintSeleccionImg.height;
  paintPortapapeles.getContext('2d').drawImage(paintSeleccionImg, 0, 0);
}

function paintCortarSeleccion() {
  paintCopiarSeleccion();
  paintBorrarSeleccion();
}

function paintPegarPortapapeles() {
  if (!paintPortapapeles) return;
  paintGuardarEnHistorial();
  if (paintSeleccionActiva) paintConfirmarSeleccion();

  paintSeleccionImg = document.createElement('canvas');
  paintSeleccionImg.width = paintPortapapeles.width;
  paintSeleccionImg.height = paintPortapapeles.height;
  paintSeleccionImg.getContext('2d').drawImage(paintPortapapeles, 0, 0);

  paintSeleccionX = 10;
  paintSeleccionY = 10;
  paintSeleccionAncho = paintPortapapeles.width;
  paintSeleccionAlto = paintPortapapeles.height;
  paintSeleccionActiva = true;
  paintSeleccionarHerramienta('seleccion-rect');
  paintRedibujarSeleccion();
  paintIniciarAnts();
}