// ==========================================================================
// SELECCIÓN DE ÍCONOS DEL ESCRITORIO
// ==========================================================================

function inicializarEscritorio() {
  document.querySelectorAll('.icono').forEach(icono => {
    icono.addEventListener('click', function(e) {
      e.stopPropagation();
      document.querySelectorAll('.icono').forEach(i => i.classList.remove('seleccionado'));
      icono.classList.add('seleccionado');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.icono')) {
      document.querySelectorAll('.icono').forEach(i => i.classList.remove('seleccionado'));
    }
  });
}