// ==========================================================================
// BARRA DE TAREAS - BOTONES DE VENTANAS
// ==========================================================================

function agregarBotonTarea(id) {
  if (!iconosVentanas[id]) return;
  if (document.getElementById('tarea-' + id)) {
    marcarBotonActivo(id);
    return;
  }

  const contenedor = document.querySelector('.tareas-ventanas');
  const info = iconosVentanas[id];

  const boton = document.createElement('button');
  boton.className = 'boton-tarea';
  boton.id = 'tarea-' + id;
  boton.innerHTML = `<img src="${info.icono}" alt=""><span>${info.nombre}</span>`;

  boton.addEventListener('click', function() {
    const ventana = document.getElementById(id);
    if (ventana.style.display === 'none') {
      ventana.style.display = 'block';
      traerAlFrente(ventana);
    } else {
      if (boton.classList.contains('activo')) {
        ventana.style.display = 'none';
        boton.classList.remove('activo');
        actualizarBotonActivoSegunVentanaFrente();
      } else {
        traerAlFrente(ventana);
      }
    }
  });

  contenedor.appendChild(boton);
  marcarBotonActivo(id);
}

function quitarBotonTarea(id) {
  const boton = document.getElementById('tarea-' + id);
  if (boton) boton.remove();
}

function marcarBotonActivo(id) {
  document.querySelectorAll('.boton-tarea').forEach(b => b.classList.remove('activo'));
  const boton = document.getElementById('tarea-' + id);
  if (boton) boton.classList.add('activo');
}

function actualizarBotonActivoSegunVentanaFrente() {
  let ventanaAlFrente = null;
  let maxZ = -1;
  document.querySelectorAll('.ventana').forEach(v => {
    if (v.style.display === 'block') {
      const z = parseInt(v.style.zIndex) || 10;
      if (z > maxZ) { maxZ = z; ventanaAlFrente = v; }
    }
  });
  document.querySelectorAll('.boton-tarea').forEach(b => b.classList.remove('activo'));
  if (ventanaAlFrente) marcarBotonActivo(ventanaAlFrente.id);
}