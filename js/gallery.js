// ==========================================================================
// MY PICTURES - ESTADO GLOBAL
// ==========================================================================

let galeriaDibujos = [];
let galeriaSeleccionado = null;
let galeriaViewerId = null;
let galeriaAdminActivo = false;


// ==========================================================================
// MY PICTURES - CARGA EN TIEMPO REAL
// ==========================================================================

function inicializarCargaGaleria() {
  galeriaRef.on('value', function(snapshot) {
    const data = snapshot.val();
    galeriaDibujos = [];
    if (data) {
      for (const id in data) {
        galeriaDibujos.push({ id, ...data[id] });
      }
      galeriaDibujos.sort((a, b) => b.timestamp - a.timestamp);
    }
    galeriaRenderizar();
  });
}


// ==========================================================================
// MY PICTURES - RENDERIZADO
// ==========================================================================

function galeriaEscapar(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function galeriaRenderizar() {
  const contenedor = document.getElementById('mypicturesGaleria');
  const statusCount = document.getElementById('mypicturesStatusCount');
  const totalDetails = document.getElementById('mypicturesTotal');

  if (galeriaDibujos.length === 0) {
    contenedor.innerHTML = `
      <div class="mypictures-vacio">
        <div class="mypictures-vacio-icono">🖼️</div>
        <div>This folder is empty.</div>
        <div style="margin-top: 10px; font-size: 11px; color: #999;">
          Click <b>Publish new drawing</b> in the sidebar to add your first picture!
        </div>
      </div>
    `;
    statusCount.textContent = '0 objects';
    totalDetails.textContent = '0 pictures';
    return;
  }

  contenedor.innerHTML = '';
  galeriaDibujos.forEach(dibujo => {
    const thumb = document.createElement('div');
    thumb.className = 'mypictures-thumb';
    thumb.dataset.id = dibujo.id;
    thumb.innerHTML = `
      <div class="mypictures-thumb-preview">
        <img src="${dibujo.imagen}" alt="${dibujo.titulo || 'Untitled'}">
      </div>
      <div class="mypictures-thumb-nombre">${galeriaEscapar(dibujo.titulo || 'Untitled')}</div>
    `;

    thumb.addEventListener('click', function(e) {
      e.stopPropagation();
      galeriaSeleccionar(dibujo.id);
    });

    thumb.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      galeriaAbrirViewer(dibujo.id);
    });

    contenedor.appendChild(thumb);
  });

  statusCount.textContent = galeriaDibujos.length + ' object' + (galeriaDibujos.length === 1 ? '' : 's');
  totalDetails.textContent = galeriaDibujos.length + ' picture' + (galeriaDibujos.length === 1 ? '' : 's');
}


// ==========================================================================
// MY PICTURES - SELECCIÓN
// ==========================================================================

function galeriaSeleccionar(id) {
  galeriaSeleccionado = id;

  document.querySelectorAll('.mypictures-thumb').forEach(t => t.classList.remove('seleccionado'));
  const thumb = document.querySelector(`.mypictures-thumb[data-id="${id}"]`);
  if (thumb) thumb.classList.add('seleccionado');

  document.getElementById('mypicturesPanelSeleccion').style.display = 'block';
  document.getElementById('mypicturesBtnDelete').style.display = galeriaAdminActivo ? 'flex' : 'none';

  const dibujo = galeriaDibujos.find(d => d.id === id);
  if (dibujo) {
    const fecha = new Date(dibujo.timestamp);
    document.getElementById('mypicturesDetails').innerHTML = `
      <div class="mypictures-details-titulo"><b>${galeriaEscapar(dibujo.titulo || 'Untitled')}</b></div>
      <div class="mypictures-details-tipo">PNG Image</div>
      <div class="mypictures-details-info">Date: ${galeriaFormatearFecha(fecha)}</div>
    `;
  }
}

function galeriaDeseleccionar() {
  galeriaSeleccionado = null;
  document.querySelectorAll('.mypictures-thumb').forEach(t => t.classList.remove('seleccionado'));
  document.getElementById('mypicturesPanelSeleccion').style.display = 'none';

  const total = galeriaDibujos.length;
  document.getElementById('mypicturesDetails').innerHTML = `
    <div class="mypictures-details-titulo"><b>My Pictures</b></div>
    <div class="mypictures-details-tipo">File Folder</div>
    <div class="mypictures-details-info">${total} picture${total === 1 ? '' : 's'}</div>
  `;
}

function galeriaFormatearFecha(fecha) {
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const meses = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  const hora = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  return `${dias[fecha.getDay()]}, ${meses[fecha.getMonth()]} ${fecha.getDate()}, ${fecha.getFullYear()}, ${hora}:${min}`;
}


// ==========================================================================
// MY PICTURES - VIEWER
// ==========================================================================

function galeriaAbrirViewer(id) {
  const dibujo = galeriaDibujos.find(d => d.id === id);
  if (!dibujo) return;

  galeriaViewerId = id;
  document.getElementById('galeriaViewerTitulo').textContent = (dibujo.titulo || 'Untitled') + ' - Windows Picture Viewer';
  document.getElementById('galeriaViewerImagen').src = dibujo.imagen;
  document.getElementById('galeriaViewerFecha').textContent = '📅 ' + galeriaFormatearFecha(new Date(dibujo.timestamp));
  document.getElementById('galeriaViewerDelete').style.display = galeriaAdminActivo ? 'block' : 'none';

  document.getElementById('galeriaDialogOverlay').style.display = 'block';
  document.getElementById('galeriaViewer').style.display = 'flex';
}

function galeriaCerrarViewer() {
  galeriaViewerId = null;
  document.getElementById('galeriaDialogOverlay').style.display = 'none';
  document.getElementById('galeriaViewer').style.display = 'none';
}

function mypicturesAbrirActual() {
  if (galeriaSeleccionado) galeriaAbrirViewer(galeriaSeleccionado);
}

function mypicturesAbrirPaint() {
  abrirVentanaNativa('paint');
}


// ==========================================================================
// MY PICTURES - PUBLICAR DIBUJO
// ==========================================================================

function galeriaAbrirPublish() {
  if (!paintHayCambios && galeriaEstaBlancoElCanvas()) {
    alert('The canvas is empty. Draw something before publishing!');
    return;
  }

  document.getElementById('galeriaPublishTitulo').value = '';
  document.getElementById('galeriaDialogOverlay').style.display = 'block';
  document.getElementById('galeriaDialogPublish').style.display = 'block';
  setTimeout(() => document.getElementById('galeriaPublishTitulo').focus(), 10);
}

function galeriaEstaBlancoElCanvas() {
  const w = paintCanvas.width;
  const h = paintCanvas.height;
  const imgData = paintBufferCtx.getImageData(0, 0, w, h);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== 255 || data[i+1] !== 255 || data[i+2] !== 255) return false;
  }
  return true;
}

function galeriaCerrarPublish(publicar) {
  document.getElementById('galeriaDialogOverlay').style.display = 'none';
  document.getElementById('galeriaDialogPublish').style.display = 'none';
  if (!publicar) return;
  const titulo = document.getElementById('galeriaPublishTitulo').value.trim() || 'Untitled';
  galeriaSubirDibujo(titulo);
}

function galeriaSubirDibujo(titulo) {
  // Verificar que estamos autenticados
  if (!galeriaUsuarioActual) {
    alert('Connecting... Please try again in a moment.');
    return;
  }

  if (paintSeleccionActiva) paintConfirmarSeleccion();

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = paintCanvas.width;
  exportCanvas.height = paintCanvas.height;
  exportCanvas.getContext('2d').drawImage(paintBuffer, 0, 0);

  let imagenBase64;
  const pngData = exportCanvas.toDataURL('image/png');
  if (pngData.length > 500 * 1024) {
    imagenBase64 = exportCanvas.toDataURL('image/jpeg', 0.85);
  } else {
    imagenBase64 = pngData;
  }

  galeriaRef.push({
    titulo: titulo,
    imagen: imagenBase64,
    timestamp: Date.now(),
    uid: galeriaUsuarioActual.uid
  })
  .then(() => alert('Drawing published to My Pictures! 🎉'))
  .catch(error => {
    console.error('Error publishing:', error);
    alert('Error publishing drawing. Try again.');
  });
}


// ==========================================================================
// MY PICTURES - ADMIN
// ==========================================================================

function galeriaAbrirAdmin() {
  if (galeriaAdminActivo) {
    if (confirm('Admin mode is active. Deactivate?')) galeriaDesactivarAdmin();
  } else {
    alert('You are not an admin on this device.');
  }
}

function galeriaDesactivarAdmin() {
  galeriaAdminActivo = false;
  const indicador = document.getElementById('galeriaAdminIndicador');
  if (indicador) indicador.remove();
  document.getElementById('mypicturesBtnDelete').style.display = 'none';
  document.getElementById('galeriaViewerDelete').style.display = 'none';
}

function galeriaMostrarIndicadorAdmin() {
  if (document.getElementById('galeriaAdminIndicador')) return;

  const indicador = document.createElement('div');
  indicador.id = 'galeriaAdminIndicador';
  indicador.className = 'galeria-admin-activo';
  indicador.textContent = '🔒 ADMIN MODE';
  indicador.title = 'Click to deactivate admin mode';
  indicador.addEventListener('click', function() {
    if (confirm('Deactivate admin mode?')) galeriaDesactivarAdmin();
  });
  document.body.appendChild(indicador);
}


// ==========================================================================
// MY PICTURES - ELIMINAR DIBUJOS (admin)
// ==========================================================================

function galeriaEliminar(id, callbackDespues) {
  const dibujo = galeriaDibujos.find(d => d.id === id);
  if (!dibujo) return;

  if (confirm(`Delete "${dibujo.titulo || 'Untitled'}"?\n\nThis cannot be undone.`)) {
    galeriaRef.child(id).remove()
      .then(() => { if (callbackDespues) callbackDespues(); })
      .catch(error => {
        console.error('Error deleting:', error);
        alert('Error deleting picture.');
      });
  }
}

function galeriaEliminarActual() {
  if (!galeriaAdminActivo || !galeriaViewerId) return;
  galeriaEliminar(galeriaViewerId, galeriaCerrarViewer);
}


// ==========================================================================
// MY PICTURES - EVENTOS INICIALES
// ==========================================================================

function inicializarEventosGaleria() {
  // Deseleccionar al hacer clic en área vacía
  document.getElementById('mypicturesGaleria').addEventListener('click', function(e) {
    if (e.target === this) galeriaDeseleccionar();
  });

  // Cerrar viewer con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('galeriaViewer').style.display === 'flex') {
      galeriaCerrarViewer();
      e.preventDefault();
    }
  });

  // Publish dialog: Enter/Escape
  document.getElementById('galeriaPublishTitulo').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); galeriaCerrarPublish(true); }
    else if (e.key === 'Escape') { e.preventDefault(); galeriaCerrarPublish(false); }
  });

  // Botón delete en sidebar
  document.getElementById('mypicturesBtnDelete').addEventListener('click', function() {
    if (!galeriaAdminActivo || !galeriaSeleccionado) return;
    galeriaEliminar(galeriaSeleccionado, galeriaDeseleccionar);
  });
}