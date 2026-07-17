// ==========================================================================
// PAINT - GESTIÓN DE ARCHIVO
// ==========================================================================

function paintNuevo() {
  if (paintHayCambios) {
    paintAbrirDialogoSave(function(respuesta) {
      if (respuesta === 'yes') {
        paintGuardar(function() { paintLimpiarCanvas(); });
      } else if (respuesta === 'no') {
        paintLimpiarCanvas();
      }
    });
  } else {
    paintLimpiarCanvas();
  }
}

function paintLimpiarCanvas() {
  if (paintSeleccionActiva) {
    paintSeleccionActiva = false;
    paintSeleccionImg = null;
    paintSeleccionMascara = null;
    if (paintSeleccionAntsInterval) {
      clearInterval(paintSeleccionAntsInterval);
      paintSeleccionAntsInterval = null;
    }
  }
  if (paintTextoActivo) paintCerrarTextarea();
  paintCancelarOperaciones();

  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);
  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);

  paintHistorial.length = 0;
  paintHistorialRedo.length = 0;
  paintHayCambios = false;
  paintNombreArchivo = 'untitled';
  paintActualizarTitulo();
}

function paintGuardar(callback) {
  paintDescargarPNG(paintNombreArchivo);
  paintHayCambios = false;
  if (callback) callback();
}

function paintGuardarComo(callback) {
  paintAbrirDialogoSaveAs(function(nombre) {
    if (nombre) {
      paintNombreArchivo = nombre;
      paintDescargarPNG(nombre);
      paintHayCambios = false;
      paintActualizarTitulo();
      if (callback) callback();
    }
  });
}

function paintDescargarPNG(nombre) {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = paintCanvas.width;
  exportCanvas.height = paintCanvas.height;
  exportCanvas.getContext('2d').drawImage(paintBuffer, 0, 0);

  const link = document.createElement('a');
  link.download = nombre + '.png';
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
}

function paintActualizarTitulo() {
  const titulo = document.querySelector('#paint .ventana-titulo');
  if (titulo) titulo.textContent = paintNombreArchivo + ' - Paint';
  const btnTarea = document.querySelector('#tarea-paint span');
  if (btnTarea) btnTarea.textContent = paintNombreArchivo + ' - Paint';
}

function paintSelectAll() {
  if (paintSeleccionActiva) paintConfirmarSeleccion();
  paintSeleccionarHerramienta('seleccion-rect');
  paintCrearSeleccionRect(0, 0, paintCanvas.width, paintCanvas.height);
}


// ==========================================================================
// PAINT - CERRAR VENTANA CON "Save changes?"
// ==========================================================================

let _cerrarVentanaNativaOriginal;

function inicializarCierrePaint() {
  _cerrarVentanaNativaOriginal = cerrarVentanaNativa;

  cerrarVentanaNativa = function(id) {
    if (id === 'paint' && paintHayCambios) {
      paintAbrirDialogoSave(function(respuesta) {
        if (respuesta === 'yes') {
          paintGuardar(function() {
            _cerrarVentanaNativaOriginal('paint');
            paintLimpiarSinDialogo();
          });
        } else if (respuesta === 'no') {
          _cerrarVentanaNativaOriginal('paint');
          paintLimpiarSinDialogo();
        }
      });
    } else {
      _cerrarVentanaNativaOriginal(id);
    }
  };
}

function paintLimpiarSinDialogo() {
  if (paintSeleccionActiva) {
    paintSeleccionActiva = false;
    paintSeleccionImg = null;
    paintSeleccionMascara = null;
    if (paintSeleccionAntsInterval) {
      clearInterval(paintSeleccionAntsInterval);
      paintSeleccionAntsInterval = null;
    }
  }
  if (paintTextoActivo) paintCerrarTextarea();
  paintCancelarOperaciones();

  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, paintBuffer.width, paintBuffer.height);
  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);

  paintHistorial.length = 0;
  paintHistorialRedo.length = 0;
  paintHayCambios = false;
  paintNombreArchivo = 'untitled';
  paintActualizarTitulo();
}