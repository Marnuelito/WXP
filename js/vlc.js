// ==========================================================================
// VLC - REPRODUCTOR
// ==========================================================================

let videoActualNativo = 0;
let primeraAperturaNativo = true;
let volumenAnteriorNativo = 25;
let arrastrandoProgresoNativo = false;
let arrastrandoVolumenNativo = false;

function pausarVideoNativo() {
  const video = document.getElementById('vlcVideoNativo');
  const iconoPlay = document.getElementById('vlcIconoPlayNativo');
  const iconoPause = document.getElementById('vlcIconoPauseNativo');

  if (video.paused) {
    video.play();
    iconoPlay.style.display = 'none';
    iconoPause.style.display = 'block';
  } else {
    video.pause();
    iconoPlay.style.display = 'block';
    iconoPause.style.display = 'none';
  }
}

function cargarVideoNativo(indice) {
  const video = document.getElementById('vlcVideoNativo');
  const source = document.getElementById('vlcSourceNativo');
  const volumenActual = video.volume;
  const estabaMuteado = video.muted;

  source.src = videos[indice];
  video.load();
  video.volume = volumenActual;
  video.muted = estabaMuteado;
  video.play();

  document.getElementById('vlcIconoPlayNativo').style.display = 'none';
  document.getElementById('vlcIconoPauseNativo').style.display = 'block';
}

function videoSiguienteNativo() {
  videoActualNativo++;
  if (videoActualNativo >= videos.length) videoActualNativo = 0;
  cargarVideoNativo(videoActualNativo);
}

function videoAnteriorNativo() {
  videoActualNativo--;
  if (videoActualNativo < 0) videoActualNativo = videos.length - 1;
  cargarVideoNativo(videoActualNativo);
}

function toggleFullscreenNativo() {
  const video = document.getElementById('vlcVideoNativo');
  if (!document.fullscreenElement) {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}

function toggleLoopNativo() {
  const video = document.getElementById('vlcVideoNativo');
  const boton = document.getElementById('vlcBotonLoopNativo');
  video.loop = !video.loop;
  if (video.loop) boton.classList.add('activo');
  else boton.classList.remove('activo');
}

function toggleMuteNativo() {
  const video = document.getElementById('vlcVideoNativo');
  const relleno = document.getElementById('vlcVolumenLlenoNativo');
  const texto = document.getElementById('vlcVolumenPorcentajeNativo');
  const icono = document.getElementById('vlcMuteIconoNativo');

  if (video.muted) {
    video.muted = false;
    video.volume = volumenAnteriorNativo / 100;
    relleno.setAttribute('width', (volumenAnteriorNativo * 0.7));
    texto.textContent = volumenAnteriorNativo + "%";
    icono.src = "https://i.imgur.com/X0eEkVm.png";
  } else {
    volumenAnteriorNativo = Math.round(video.volume * 100);
    video.muted = true;
    relleno.setAttribute('width', 0);
    texto.textContent = "0%";
    icono.src = "https://i.imgur.com/oeNByO0.png";
  }
}

function saltarVideoNativo(event) {
  const video = document.getElementById('vlcVideoNativo');
  const barra = document.getElementById('vlcBarraProgresoNativo');
  const porcentaje = calcularPorcentaje(event, barra);
  video.currentTime = video.duration * (porcentaje / 100);
}

function cambiarVolumenNativo(event) {
  const video = document.getElementById('vlcVideoNativo');
  const relleno = document.getElementById('vlcVolumenLlenoNativo');
  const texto = document.getElementById('vlcVolumenPorcentajeNativo');
  const icono = document.getElementById('vlcMuteIconoNativo');
  const barra = document.getElementById('vlcVolumenBarraNativo');
  const porcentaje = calcularPorcentaje(event, barra);

  video.volume = porcentaje / 100;
  video.muted = false;
  relleno.setAttribute('width', (porcentaje * 0.7));
  texto.textContent = Math.round(porcentaje) + "%";

  if (Math.round(porcentaje) === 0) icono.src = "https://i.imgur.com/oeNByO0.png";
  else icono.src = "https://i.imgur.com/X0eEkVm.png";
}

function inicializarVLC() {
  const videoVLCNativo = document.getElementById('vlcVideoNativo');

  videoVLCNativo.addEventListener('timeupdate', function() {
    const actual = videoVLCNativo.currentTime;
    const total = videoVLCNativo.duration;
    const restante = total - actual;
    document.getElementById('vlcTiempoActualNativo').textContent = formatearTiempo(actual);
    document.getElementById('vlcTiempoRestanteNativo').textContent = "-" + formatearTiempo(restante);
    const porcentaje = (actual / total) * 100;
    document.getElementById('vlcProgresoLlenoNativo').style.width = porcentaje + "%";
  });

  videoVLCNativo.addEventListener('ended', function() {
    if (videoVLCNativo.loop) {
      videoVLCNativo.currentTime = 0;
      videoVLCNativo.play();
    } else {
      videoSiguienteNativo();
    }
  });

  const barraProgresoNativo = document.getElementById('vlcBarraProgresoNativo');
  barraProgresoNativo.addEventListener('mousedown', function(e) {
    e.preventDefault();
    arrastrandoProgresoNativo = true;
    saltarVideoNativo(e);
  });

  const volumenBarraNativo = document.getElementById('vlcVolumenBarraNativo');
  volumenBarraNativo.addEventListener('mousedown', function(e) {
    e.preventDefault();
    arrastrandoVolumenNativo = true;
    cambiarVolumenNativo(e);
  });
}