// ==========================================================================
// RELOJ
// ==========================================================================

function actualizarReloj() {
  const ahora = new Date();
  let horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12;
  if (horas === 0) horas = 12;
  const minStr = String(minutos).padStart(2, '0');
  document.getElementById('relojHora').textContent = `${horas}:${minStr} ${ampm}`;

  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  document.getElementById('relojFecha').textContent = `${dia}/${mes}/${anio}`;

  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const diaSemana = dias[ahora.getDay()];
  const nombreMes = meses[ahora.getMonth()];
  const fechaCompleta = `${diaSemana}, ${ahora.getDate()} de ${nombreMes} de ${anio}`;
  document.getElementById('reloj').title =
    fechaCompleta.charAt(0).toUpperCase() + fechaCompleta.slice(1);
}

function iniciarReloj() {
  actualizarReloj();
  setInterval(actualizarReloj, 1000);
}