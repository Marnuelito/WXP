// ==========================================================================
// VENTANAS - FUNCIONES GENERALES
// ==========================================================================

function cerrarVentana(id) {
  const ventana = document.getElementById(id);
  ventana.style.display = 'none';
  const video = ventana.querySelector('video');
  if (video) video.pause();
  quitarBotonTarea(id);
  actualizarBotonActivoSegunVentanaFrente();
}

function minimizarVentana(id) {
  const ventana = document.getElementById(id);
  ventana.style.display = 'none';
  const boton = document.getElementById('tarea-' + id);
  if (boton) boton.classList.remove('activo');
  actualizarBotonActivoSegunVentanaFrente();
}

function abrirVentanaNativa(id) {
  const ventana = document.getElementById(id);
  ventana.style.display = 'block';
  traerAlFrente(ventana);
  agregarBotonTarea(id);

  if (id === 'vlc-nativo') {
    const video = document.getElementById('vlcVideoNativo');
    if (primeraAperturaNativo) {
      video.volume = 0.25;
      video.muted = false;
      primeraAperturaNativo = false;
    }
    const volumenActual = video.volume;
    const estabaMuteado = video.muted;
    cargarVideoNativo(videoActualNativo);
    video.volume = volumenActual;
    video.muted = estabaMuteado;
  }

  if (id === 'paint') {
    setTimeout(paintAjustarCanvas, 10);
  }
}

function cerrarVentanaNativa(id) {
  const ventana = document.getElementById(id);
  ventana.style.display = 'none';
  ventana.classList.remove('maximizada');
  const video = ventana.querySelector('video');
  if (video) video.pause();
  quitarBotonTarea(id);
  actualizarBotonActivoSegunVentanaFrente();
}

function minimizarVentanaNativa(id) {
  const ventana = document.getElementById(id);
  ventana.style.display = 'none';
  const boton = document.getElementById('tarea-' + id);
  if (boton) boton.classList.remove('activo');
  actualizarBotonActivoSegunVentanaFrente();
}

function maximizarVentanaNativa(id) {
  const ventana = document.getElementById(id);
  if (ventana.classList.contains('maximizada')) {
    ventana.classList.remove('maximizada');
    ventana.style.width = ventana.dataset.anchoAnterior;
    ventana.style.height = ventana.dataset.altoAnterior;
    ventana.style.top = ventana.dataset.topAnterior;
    ventana.style.left = ventana.dataset.leftAnterior;
  } else {
    ventana.dataset.anchoAnterior = ventana.style.width;
    ventana.dataset.altoAnterior = ventana.style.height;
    ventana.dataset.topAnterior = ventana.style.top;
    ventana.dataset.leftAnterior = ventana.style.left;
    ventana.classList.add('maximizada');
    ventana.style.width = '100vw';
    ventana.style.height = 'calc(100vh - 40px)';
    ventana.style.top = '0';
    ventana.style.left = '0';
  }
}


// ==========================================================================
// Z-INDEX Y VENTANAS AL FRENTE
// ==========================================================================

function traerAlFrente(ventana) {
  document.querySelectorAll('.ventana').forEach(v => v.style.zIndex = 10);
  ventana.style.zIndex = 15;
  marcarBotonActivo(ventana.id);
}


// ==========================================================================
// ARRASTRE Y REDIMENSIONAMIENTO DE VENTANAS
// ==========================================================================

let ventanaArrastrando = null;
let offsetX = 0, offsetY = 0;

let ventanaRedimensionando = null;
let tipoRedimension = '';
let inicioX = 0, inicioY = 0;
let anchoInicial = 0, altoInicial = 0;
let topInicial = 0, leftInicial = 0;

function inicializarVentanas() {
  // Traer al frente al hacer clic
  document.querySelectorAll('.ventana').forEach(ventana => {
    ventana.addEventListener('mousedown', () => traerAlFrente(ventana));
  });

  // Arrastre desde la barra de título
  document.querySelectorAll('.ventana-barra').forEach(barra => {
    barra.addEventListener('mousedown', function(e) {
      if (e.target.closest('.btn-ventana')) return;
      ventanaArrastrando = barra.parentElement;
      const rect = ventanaArrastrando.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      traerAlFrente(ventanaArrastrando);
      e.preventDefault();
    });
  });

  // Redimensionamiento
  document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      ventanaRedimensionando = handle.parentElement;

      if (handle.classList.contains('resize-nw')) tipoRedimension = 'nw';
      else if (handle.classList.contains('resize-ne')) tipoRedimension = 'ne';
      else if (handle.classList.contains('resize-sw')) tipoRedimension = 'sw';
      else if (handle.classList.contains('resize-se')) tipoRedimension = 'se';
      else if (handle.classList.contains('resize-n'))  tipoRedimension = 'n';
      else if (handle.classList.contains('resize-s'))  tipoRedimension = 's';
      else if (handle.classList.contains('resize-e'))  tipoRedimension = 'e';
      else if (handle.classList.contains('resize-w'))  tipoRedimension = 'w';

      const rect = ventanaRedimensionando.getBoundingClientRect();
      inicioX = e.clientX; inicioY = e.clientY;
      anchoInicial = rect.width; altoInicial = rect.height;
      topInicial = rect.top; leftInicial = rect.left;
      traerAlFrente(ventanaRedimensionando);
    });
  });
}


// ==========================================================================
// EVENTOS GLOBALES: mousemove / mouseup
// ==========================================================================

document.addEventListener('mousemove', function(e) {
  // Arrastre
  if (ventanaArrastrando) {
    ventanaArrastrando.style.left = (e.clientX - offsetX) + 'px';
    ventanaArrastrando.style.top = (e.clientY - offsetY) + 'px';
  }

  // Redimensionamiento
  if (ventanaRedimensionando) {
    const deltaX = e.clientX - inicioX;
    const deltaY = e.clientY - inicioY;
    const minAncho = 200;
    const minAlto = 100;
    let nuevoAncho = anchoInicial;
    let nuevoAlto = altoInicial;
    let nuevoTop = topInicial;
    let nuevoLeft = leftInicial;

    if (tipoRedimension.includes('e')) {
      nuevoAncho = Math.max(minAncho, anchoInicial + deltaX);
    }
    if (tipoRedimension.includes('w')) {
      nuevoAncho = Math.max(minAncho, anchoInicial - deltaX);
      if (nuevoAncho > minAncho) nuevoLeft = leftInicial + deltaX;
    }
    if (tipoRedimension.includes('s')) {
      nuevoAlto = Math.max(minAlto, altoInicial + deltaY);
    }
    if (tipoRedimension.includes('n')) {
      nuevoAlto = Math.max(minAlto, altoInicial - deltaY);
      if (nuevoAlto > minAlto) nuevoTop = topInicial + deltaY;
    }

    ventanaRedimensionando.style.width = nuevoAncho + 'px';
    ventanaRedimensionando.style.height = nuevoAlto + 'px';
    ventanaRedimensionando.style.top = nuevoTop + 'px';
    ventanaRedimensionando.style.left = nuevoLeft + 'px';
  }

  // Arrastre barras VLC
  if (typeof arrastrandoProgresoNativo !== 'undefined' && arrastrandoProgresoNativo) {
    saltarVideoNativo(e);
  }
  if (typeof arrastrandoVolumenNativo !== 'undefined' && arrastrandoVolumenNativo) {
    cambiarVolumenNativo(e);
  }
});

document.addEventListener('mouseup', function() {
  ventanaArrastrando = null;
  ventanaRedimensionando = null;
  if (typeof arrastrandoProgresoNativo !== 'undefined') arrastrandoProgresoNativo = false;
  if (typeof arrastrandoVolumenNativo !== 'undefined') arrastrandoVolumenNativo = false;
});


// ==========================================================================
// ATAJOS GLOBALES: Escape para cerrar ventana
// ==========================================================================

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

  // No cerrar si hay un diálogo abierto
  if (document.getElementById('paintDialogOverlay').style.display === 'block') return;
  if (document.getElementById('galeriaDialogOverlay').style.display === 'block') return;

  let ventanaAlFrente = null;
  let maxZ = -1;
  document.querySelectorAll('.ventana').forEach(v => {
    if (v.style.display === 'block') {
      const z = parseInt(v.style.zIndex) || 10;
      if (z >= maxZ) { maxZ = z; ventanaAlFrente = v; }
    }
  });
  if (ventanaAlFrente) cerrarVentana(ventanaAlFrente.id);
});