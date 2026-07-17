// ==========================================================================
// PAINT - HISTORIAL (Undo/Redo)
// ==========================================================================

function paintGuardarEnHistorial() {
  const snapshot = document.createElement('canvas');
  snapshot.width = paintBuffer.width;
  snapshot.height = paintBuffer.height;
  snapshot.getContext('2d').drawImage(paintBuffer, 0, 0);

  paintHistorial.push(snapshot);

  if (paintHistorial.length > PAINT_HISTORIAL_MAX) {
    paintHistorial.shift();
  }

  paintHistorialRedo.length = 0;
  paintHayCambios = true;
}

function paintUndo() {
  if (paintHistorial.length === 0) return;

  const estadoActual = document.createElement('canvas');
  estadoActual.width = paintBuffer.width;
  estadoActual.height = paintBuffer.height;
  estadoActual.getContext('2d').drawImage(paintBuffer, 0, 0);
  paintHistorialRedo.push(estadoActual);

  const estadoAnterior = paintHistorial.pop();
  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);
  paintBufferCtx.drawImage(estadoAnterior, 0, 0);

  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);

  if (paintSeleccionActiva) {
    paintSeleccionActiva = false;
    paintSeleccionImg = null;
    paintSeleccionMascara = null;
    if (paintSeleccionAntsInterval) {
      clearInterval(paintSeleccionAntsInterval);
      paintSeleccionAntsInterval = null;
    }
  }
}

function paintRedo() {
  if (paintHistorialRedo.length === 0) return;

  const estadoActual = document.createElement('canvas');
  estadoActual.width = paintBuffer.width;
  estadoActual.height = paintBuffer.height;
  estadoActual.getContext('2d').drawImage(paintBuffer, 0, 0);
  paintHistorial.push(estadoActual);

  const estadoSiguiente = paintHistorialRedo.pop();
  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);
  paintBufferCtx.drawImage(estadoSiguiente, 0, 0);

  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);
  paintHayCambios = true;
}