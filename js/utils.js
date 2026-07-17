// ==========================================================================
// UTILIDADES GENERALES
// ==========================================================================

function formatearTiempo(segundos) {
  if (isNaN(segundos)) return "00:00";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return String(min).padStart(2, '0') + ":" + String(seg).padStart(2, '0');
}

function calcularPorcentaje(event, barra) {
  const rect = barra.getBoundingClientRect();
  const clicX = event.clientX - rect.left;
  let porcentaje = (clicX / rect.width) * 100;
  if (porcentaje < 0) porcentaje = 0;
  if (porcentaje > 100) porcentaje = 100;
  return porcentaje;
}