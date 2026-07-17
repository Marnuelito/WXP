// ==========================================================================
// PAINT - SELECCIÓN DE HERRAMIENTA
// ==========================================================================

function inicializarHerramientasPaint() {
  document.querySelectorAll('.paint-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const nuevaHerramienta = btn.dataset.tool;

      if (paintSeleccionActiva &&
          nuevaHerramienta !== 'seleccion-rect' &&
          nuevaHerramienta !== 'seleccion-libre') {
        paintConfirmarSeleccion();
      }

      if (paintTextoActivo && nuevaHerramienta !== 'texto') {
        paintEstamparTexto();
      }

      paintCancelarOperaciones();

      document.querySelectorAll('.paint-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      paintHerramientaActual = nuevaHerramienta;

      if (nuevaHerramienta !== 'cuentagotas') {
        paintUltimaHerramienta = nuevaHerramienta;
      }

      paintAreaCanvas.className = 'paint-area-canvas tool-' + paintHerramientaActual;
      paintRenderizarOpciones();
    });
  });

  paintAreaCanvas.classList.add('tool-lapiz');
}


// ==========================================================================
// PAINT - EVENTOS DEL CANVAS
// ==========================================================================

function inicializarEventosCanvasPaint() {

  paintCanvas.addEventListener('mousedown', function(e) {
    paintBotonMouse = e.button;
    const coords = paintObtenerCoords(e);
    paintUltimoX = coords.x;
    paintUltimoY = coords.y;
    const color = (e.button === 2) ? paintColorSecundario : paintColorPrimario;

    if (paintHerramientaActual === 'lupa') {
      if (e.button === 2) {
        paintAplicarZoom(1, coords.x, coords.y);
      } else {
        let nuevoZoom = paintZoom;
        if (paintZoom === 1) nuevoZoom = 2;
        else if (paintZoom === 2) nuevoZoom = 6;
        else if (paintZoom === 6) nuevoZoom = 8;
        else nuevoZoom = 1;
        paintAplicarZoom(nuevoZoom, coords.x, coords.y);
      }
      return;
    }

    if (paintHerramientasBasicas.includes(paintHerramientaActual)) {
      paintGuardarEnHistorial();
      paintDibujando = true;
      paintDibujarPunto(coords.x, coords.y, color);
    }
    else if (paintHerramientasForma.includes(paintHerramientaActual)) {
      paintGuardarEnHistorial();
      paintDibujandoForma = true;
      paintFormaInicioX = coords.x;
      paintFormaInicioY = coords.y;
      paintGuardarSnapshot();
    }
    else if (paintHerramientaActual === 'balde') {
      paintGuardarEnHistorial();
      paintFloodFill(coords.x, coords.y, color);
    }
    else if (paintHerramientaActual === 'cuentagotas') {
      const pixel = paintCtx.getImageData(coords.x, coords.y, 1, 1).data;
      const colorHex = paintRgbToHex(pixel[0], pixel[1], pixel[2]);
      if (e.button === 2) paintActualizarColorSecundario(colorHex);
      else paintActualizarColorPrimario(colorHex);
      paintSeleccionarHerramienta(paintUltimaHerramienta);
    }
    else if (paintHerramientaActual === 'curva') {
      if (paintCurvaEstado === 0) {
        paintGuardarEnHistorial();
        paintDibujandoForma = true;
        paintCurvaX1 = coords.x;
        paintCurvaY1 = coords.y;
        paintGuardarSnapshot();
      } else if (paintCurvaEstado === 1 || paintCurvaEstado === 2) {
        paintDibujandoForma = true;
      }
    }
    else if (paintHerramientaActual === 'poligono') {
      if (!paintPoligonoActivo) {
        paintGuardarEnHistorial();
        paintPoligonoActivo = true;
        paintPoligonoPuntos = [{x: coords.x, y: coords.y}];
        paintDibujandoForma = true;
        paintGuardarSnapshot();
      } else {
        paintPoligonoPuntos.push({x: coords.x, y: coords.y});
      }
    }
    else if (paintHerramientaActual === 'texto') {
      if (paintTextoActivo) paintEstamparTexto();
      paintDibujandoForma = true;
      paintFormaInicioX = coords.x;
      paintFormaInicioY = coords.y;
      paintGuardarSnapshot();
    }
    else if (paintHerramientaActual === 'seleccion-rect') {
      if (paintSeleccionActiva) {
        const dentro =
          coords.x >= paintSeleccionX &&
          coords.x <= paintSeleccionX + paintSeleccionAncho &&
          coords.y >= paintSeleccionY &&
          coords.y <= paintSeleccionY + paintSeleccionAlto;
        if (dentro) {
          paintSeleccionArrastrando = true;
          paintSeleccionOffsetX = coords.x - paintSeleccionX;
          paintSeleccionOffsetY = coords.y - paintSeleccionY;
          return;
        } else {
          paintConfirmarSeleccion();
        }
      }
      paintSeleccionDibujando = true;
      paintFormaInicioX = coords.x;
      paintFormaInicioY = coords.y;
      paintGuardarSnapshot();
    }
    else if (paintHerramientaActual === 'seleccion-libre') {
      if (paintSeleccionActiva) {
        const dentro =
          coords.x >= paintSeleccionX &&
          coords.x <= paintSeleccionX + paintSeleccionAncho &&
          coords.y >= paintSeleccionY &&
          coords.y <= paintSeleccionY + paintSeleccionAlto;
        if (dentro) {
          paintSeleccionArrastrando = true;
          paintSeleccionOffsetX = coords.x - paintSeleccionX;
          paintSeleccionOffsetY = coords.y - paintSeleccionY;
          return;
        } else {
          paintConfirmarSeleccion();
        }
      }
      paintSeleccionDibujando = true;
      paintSeleccionPuntosLasso = [{x: coords.x, y: coords.y}];
      paintGuardarSnapshot();
    }
  });

  paintCanvas.addEventListener('mousemove', function(e) {
    const coords = paintObtenerCoords(e);
    document.getElementById('paintCoords').textContent = coords.x + ', ' + coords.y;

    if (paintDibujando && paintHerramientasBasicas.includes(paintHerramientaActual)) {
      const color = (paintBotonMouse === 2) ? paintColorSecundario : paintColorPrimario;
      if (paintHerramientaActual === 'lapiz') {
        paintDibujarLineaPersonal(paintUltimoX, paintUltimoY, coords.x, coords.y, color, 1, 'circulo');
      } else if (paintHerramientaActual === 'pincel') {
        paintDibujarLineaPersonal(paintUltimoX, paintUltimoY, coords.x, coords.y,
          color, paintPincelTamanos[paintPincelTamano], paintPincelForma);
      } else if (paintHerramientaActual === 'goma') {
        paintDibujarLineaPersonal(paintUltimoX, paintUltimoY, coords.x, coords.y,
          paintColorSecundario, paintGomaTamano, 'cuadrado');
      } else if (paintHerramientaActual === 'aerografo') {
        paintAerografo(coords.x, coords.y, color);
      }
      paintUltimoX = coords.x;
      paintUltimoY = coords.y;
    }

    if (paintDibujandoForma && paintHerramientasForma.includes(paintHerramientaActual)) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintDibujarForma(paintCtx, paintFormaInicioX, paintFormaInicioY, coords.x, coords.y);
    }

    if (paintHerramientaActual === 'curva' && paintDibujandoForma) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      if (paintCurvaEstado === 0) {
        paintDibujarLineaSimple(paintCtx, paintCurvaX1, paintCurvaY1, coords.x, coords.y);
      } else if (paintCurvaEstado === 1) {
        paintDibujarCurva(paintCtx, paintCurvaX1, paintCurvaY1,
          paintCurvaX2, paintCurvaY2, coords.x, coords.y);
      } else if (paintCurvaEstado === 2) {
        paintDibujarCurva(paintCtx, paintCurvaX1, paintCurvaY1,
          paintCurvaCX1, paintCurvaCY1, coords.x, coords.y);
      }
    }

    if (paintPoligonoActivo && paintPoligonoPuntos.length > 0) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintDibujarPoligonoPreview(coords.x, coords.y);
    }

    if (paintHerramientaActual === 'texto' && paintDibujandoForma) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintCtx.strokeStyle = '#000';
      paintCtx.setLineDash([4, 2]);
      paintCtx.lineWidth = 1;
      const x = Math.min(paintFormaInicioX, coords.x);
      const y = Math.min(paintFormaInicioY, coords.y);
      const w = Math.abs(coords.x - paintFormaInicioX);
      const h = Math.abs(coords.y - paintFormaInicioY);
      paintCtx.strokeRect(x + 0.5, y + 0.5, w, h);
      paintCtx.setLineDash([]);
    }

    if (paintSeleccionDibujando && paintHerramientaActual === 'seleccion-rect') {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintDibujarRectanguloAnts(
        Math.min(paintFormaInicioX, coords.x),
        Math.min(paintFormaInicioY, coords.y),
        Math.abs(coords.x - paintFormaInicioX),
        Math.abs(coords.y - paintFormaInicioY), 0
      );
    }

    if (paintSeleccionDibujando && paintHerramientaActual === 'seleccion-libre') {
      paintSeleccionPuntosLasso.push({x: coords.x, y: coords.y});
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintCtx.strokeStyle = '#000';
      paintCtx.setLineDash([4, 2]);
      paintCtx.lineWidth = 1;
      paintCtx.beginPath();
      paintCtx.moveTo(paintSeleccionPuntosLasso[0].x, paintSeleccionPuntosLasso[0].y);
      for (let i = 1; i < paintSeleccionPuntosLasso.length; i++) {
        paintCtx.lineTo(paintSeleccionPuntosLasso[i].x, paintSeleccionPuntosLasso[i].y);
      }
      paintCtx.stroke();
      paintCtx.setLineDash([]);
    }

    if (paintSeleccionArrastrando) {
      paintSeleccionX = coords.x - paintSeleccionOffsetX;
      paintSeleccionY = coords.y - paintSeleccionOffsetY;
      paintRedibujarSeleccion();
    }
  });

  paintCanvas.addEventListener('mouseleave', function() {
    document.getElementById('paintCoords').textContent = '';
  });

  paintCanvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  paintCanvas.addEventListener('dblclick', function() {
    if (paintHerramientaActual === 'poligono' && paintPoligonoActivo) {
      paintFinalizarPoligono();
    }
  });

  document.addEventListener('mouseup', function(e) {
    const coords = paintObtenerCoords(e);

    if (paintDibujandoForma && paintHerramientasForma.includes(paintHerramientaActual)) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      paintDibujarForma(paintCtx, paintFormaInicioX, paintFormaInicioY, coords.x, coords.y);
      paintDibujarForma(paintBufferCtx, paintFormaInicioX, paintFormaInicioY, coords.x, coords.y);
      paintDibujandoForma = false;
      paintSnapshot = null;
    }

    if (paintHerramientaActual === 'curva' && paintDibujandoForma) {
      if (paintCurvaEstado === 0) {
        paintCurvaX2 = coords.x;
        paintCurvaY2 = coords.y;
        paintCurvaCX1 = coords.x;
        paintCurvaCY1 = coords.y;
        paintCurvaEstado = 1;
        paintDibujandoForma = false;
        paintCtx.drawImage(paintSnapshot, 0, 0);
        paintDibujarLineaSimple(paintCtx, paintCurvaX1, paintCurvaY1, paintCurvaX2, paintCurvaY2);
      } else if (paintCurvaEstado === 1) {
        paintCurvaCX1 = coords.x;
        paintCurvaCY1 = coords.y;
        paintCurvaEstado = 2;
        paintDibujandoForma = false;
        paintCtx.drawImage(paintSnapshot, 0, 0);
        paintDibujarCurva(paintCtx, paintCurvaX1, paintCurvaY1,
          paintCurvaX2, paintCurvaY2, paintCurvaCX1, paintCurvaCY1);
      } else if (paintCurvaEstado === 2) {
        paintCtx.drawImage(paintSnapshot, 0, 0);
        paintDibujarCurva(paintCtx, paintCurvaX1, paintCurvaY1,
          paintCurvaCX1, paintCurvaCY1, coords.x, coords.y);
        paintDibujarCurva(paintBufferCtx, paintCurvaX1, paintCurvaY1,
          paintCurvaCX1, paintCurvaCY1, coords.x, coords.y);
        paintCurvaEstado = 0;
        paintDibujandoForma = false;
        paintSnapshot = null;
      }
    }

    if (paintHerramientaActual === 'texto' && paintDibujandoForma) {
      paintCtx.drawImage(paintSnapshot, 0, 0);
      const x = Math.min(paintFormaInicioX, coords.x);
      const y = Math.min(paintFormaInicioY, coords.y);
      const w = Math.max(20, Math.abs(coords.x - paintFormaInicioX));
      const h = Math.max(20, Math.abs(coords.y - paintFormaInicioY));
      paintDibujandoForma = false;
      paintAbrirTextarea(x, y, w, h);
    }

    if (paintSeleccionDibujando && paintHerramientaActual === 'seleccion-rect') {
      const x = Math.min(paintFormaInicioX, coords.x);
      const y = Math.min(paintFormaInicioY, coords.y);
      const w = Math.abs(coords.x - paintFormaInicioX);
      const h = Math.abs(coords.y - paintFormaInicioY);
      paintSeleccionDibujando = false;
      if (w > 2 && h > 2) {
        paintCrearSeleccionRect(x, y, w, h);
      } else {
        paintCtx.drawImage(paintSnapshot, 0, 0);
        paintSnapshot = null;
      }
    }

    if (paintSeleccionDibujando && paintHerramientaActual === 'seleccion-libre') {
      paintSeleccionDibujando = false;
      if (paintSeleccionPuntosLasso.length > 3) {
        paintCrearSeleccionLibre();
      } else {
        paintCtx.drawImage(paintSnapshot, 0, 0);
        paintSnapshot = null;
        paintSeleccionPuntosLasso = [];
      }
    }

    if (paintSeleccionArrastrando) paintSeleccionArrastrando = false;
    paintDibujando = false;
  });
}


// ==========================================================================
// PAINT - FLOOD FILL (Balde)
// ==========================================================================

function paintFloodFill(startX, startY, colorHex) {
  const ancho = paintCanvas.width;
  const alto = paintCanvas.height;
  const imgData = paintCtx.getImageData(0, 0, ancho, alto);
  const data = imgData.data;
  const idx = (startY * ancho + startX) * 4;
  const targetR = data[idx];
  const targetG = data[idx + 1];
  const targetB = data[idx + 2];
  const fillR = parseInt(colorHex.slice(1, 3), 16);
  const fillG = parseInt(colorHex.slice(3, 5), 16);
  const fillB = parseInt(colorHex.slice(5, 7), 16);

  if (targetR === fillR && targetG === fillG && targetB === fillB) return;

  const pila = [[startX, startY]];
  while (pila.length > 0) {
    const [x, y] = pila.pop();
    if (x < 0 || x >= ancho || y < 0 || y >= alto) continue;
    const i = (y * ancho + x) * 4;
    if (data[i] !== targetR || data[i+1] !== targetG || data[i+2] !== targetB) continue;
    data[i] = fillR;
    data[i+1] = fillG;
    data[i+2] = fillB;
    data[i+3] = 255;
    pila.push([x+1, y]);
    pila.push([x-1, y]);
    pila.push([x, y+1]);
    pila.push([x, y-1]);
  }
  paintCtx.putImageData(imgData, 0, 0);
  paintBufferCtx.drawImage(paintCanvas, 0, 0);
}


// ==========================================================================
// PAINT - DIBUJO BÁSICO (lápiz/pincel/goma/aerógrafo)
// ==========================================================================

function paintDibujarPuntoConForma(ctx, x, y, size, color, forma) {
  ctx.fillStyle = color;
  if (forma === 'circulo') {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  } else if (forma === 'cuadrado') {
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  } else if (forma === 'diag1' || forma === 'diag2') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (forma === 'diag1') {
      ctx.moveTo(x - size, y + size);
      ctx.lineTo(x + size, y - size);
    } else {
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function paintDibujarPunto(x, y, color) {
  if (paintHerramientaActual === 'lapiz') {
    [paintCtx, paintBufferCtx].forEach(ctx => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  } else if (paintHerramientaActual === 'pincel') {
    const s = paintPincelTamanos[paintPincelTamano];
    [paintCtx, paintBufferCtx].forEach(ctx => {
      paintDibujarPuntoConForma(ctx, x, y, s, color, paintPincelForma);
    });
  } else if (paintHerramientaActual === 'goma') {
    const s = paintGomaTamano;
    [paintCtx, paintBufferCtx].forEach(ctx => {
      ctx.fillStyle = paintColorSecundario;
      ctx.fillRect(x - s/2, y - s/2, s, s);
    });
  } else if (paintHerramientaActual === 'aerografo') {
    paintAerografo(x, y, color);
  }
}

function paintDibujarLineaPersonal(x1, y1, x2, y2, color, size, forma) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.max(Math.abs(dx), Math.abs(dy));
  const steps = Math.max(1, Math.ceil(dist));

  [paintCtx, paintBufferCtx].forEach(ctx => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.round(x1 + dx * t);
      const y = Math.round(y1 + dy * t);
      if (size === 1 && forma === 'circulo') {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      } else if (forma === 'cuadrado') {
        ctx.fillStyle = color;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      } else {
        paintDibujarPuntoConForma(ctx, x, y, size, color, forma);
      }
    }
  });
}

function paintAerografo(x, y, color) {
  const cfg = paintAerografoConfig[paintAerografoTamano];
  const puntos = [];
  for (let i = 0; i < cfg.cantidad; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * cfg.radio;
    puntos.push({
      x: Math.floor(x + Math.cos(a) * d),
      y: Math.floor(y + Math.sin(a) * d)
    });
  }
  [paintCtx, paintBufferCtx].forEach(ctx => {
    ctx.fillStyle = color;
    puntos.forEach(p => ctx.fillRect(p.x, p.y, 1, 1));
  });
}