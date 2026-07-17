// ==========================================================================
// PAINT - MENÚS DESPLEGABLES
// ==========================================================================

let paintMenuAbierto = null;

function paintAbrirMenu(nombre, itemMenu) {
  paintCerrarMenus();
  const menu = document.getElementById('paintMenu' + nombre.charAt(0).toUpperCase() + nombre.slice(1));
  if (!menu) return;

  const rect = itemMenu.getBoundingClientRect();
  menu.style.top = rect.bottom + 'px';
  menu.style.left = rect.left + 'px';
  menu.style.display = 'block';

  itemMenu.classList.add('abierto');
  paintMenuAbierto = { menu: menu, item: itemMenu };
}

function paintCerrarMenus() {
  document.querySelectorAll('.paint-dropdown-menu').forEach(m => m.style.display = 'none');
  document.querySelectorAll('.paint-menu-item').forEach(i => i.classList.remove('abierto'));
  paintMenuAbierto = null;
}

function paintEjecutarAccion(accion) {
  paintCerrarMenus();
  switch (accion) {
    // File
    case 'new':             paintNuevo(); break;
    case 'save':            paintGuardar(); break;
    case 'saveas':          paintGuardarComo(); break;
    case 'publish':         galeriaAbrirPublish(); break;
    // Edit
    case 'undo':            paintUndo(); break;
    case 'redo':            paintRedo(); break;
    case 'cut':             if (paintSeleccionActiva) paintCortarSeleccion(); break;
    case 'copy':            if (paintSeleccionActiva) paintCopiarSeleccion(); break;
    case 'paste':           if (paintPortapapeles) paintPegarPortapapeles(); break;
    case 'clear-selection': if (paintSeleccionActiva) paintBorrarSeleccion(); break;
    case 'select-all':      paintSelectAll(); break;
    // Image
    case 'flip-rotate':     paintAbrirDialogoFlipRotate(); break;
    case 'stretch-skew':    paintAbrirDialogoStretchSkew(); break;
    // Colors
    case 'edit-colors':     paintAbrirDialogoEditColors('primario'); break;
    // Help
    case 'about':           paintAbrirDialogoAbout(); break;
  }
}

function inicializarMenusPaint() {
  document.querySelectorAll('.paint-menu-item[data-menu]').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const nombre = item.dataset.menu;
      if (paintMenuAbierto && paintMenuAbierto.item === item) {
        paintCerrarMenus();
      } else {
        paintAbrirMenu(nombre, item);
      }
    });
  });

  document.querySelectorAll('.paint-menu-item-drop').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      if (item.classList.contains('disabled')) return;
      paintEjecutarAccion(item.dataset.action);
    });
  });

  document.addEventListener('click', function(e) {
    if (paintMenuAbierto &&
        !e.target.closest('.paint-dropdown-menu') &&
        !e.target.closest('.paint-menu-item[data-menu]')) {
      paintCerrarMenus();
    }
  });
}


// ==========================================================================
// PAINT - ATAJOS DE TECLADO
// ==========================================================================

function inicializarAtajosPaint() {
  document.addEventListener('keydown', function(e) {
    const paintVisible = document.getElementById('paint').style.display === 'block';
    if (!paintVisible) return;

    if (e.target === paintTextarea) return;
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

    if (paintTextoActivo && e.key === 'Escape') {
      paintEstamparTexto();
      e.preventDefault();
      return;
    }

    if (e.key === 'Delete' && paintSeleccionActiva) {
      paintBorrarSeleccion();
      e.preventDefault();
      return;
    }

    if (e.ctrlKey) {
      const key = e.key.toLowerCase();
      const acciones = {
        'c': () => paintSeleccionActiva && paintCopiarSeleccion(),
        'x': () => paintSeleccionActiva && paintCortarSeleccion(),
        'v': () => paintPortapapeles && paintPegarPortapapeles(),
        'z': () => paintUndo(),
        'y': () => paintRedo(),
        'n': () => paintNuevo(),
        's': () => paintGuardar(),
        'a': () => paintSelectAll(),
        'r': () => paintAbrirDialogoFlipRotate(),
        'w': () => paintAbrirDialogoStretchSkew()
      };
      if (acciones[key]) {
        acciones[key]();
        e.preventDefault();
      }
    }
  });
}