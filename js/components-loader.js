// ==========================================================================
// COMPONENTS LOADER - Carga dinámica de ventanas y diálogos
// ==========================================================================

const COMPONENTS = {
  // Ventanas principales
  paint: 'components/windows/paint.html',
  'vlc-nativo': 'components/windows/vlc.html',
  prueba: 'components/windows/prueba.html',
  mypictures: 'components/windows/mypictures.html',

  // Diálogos de galería
  galleryDialogs: 'components/dialogs/gallery-dialogs.html',

  // Diálogos de Paint
  paintDialogs: 'components/dialogs/paint-dialogs.html',
};

/**
 * Carga un componente HTML y lo inserta en el body
 */
async function loadComponent(name, targetSelector = 'body') {
  const path = COMPONENTS[name];
  if (!path) {
    console.error(`Componente no encontrado: ${name}`);
    return null;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Error cargando ${path}: ${response.status}`);
    }

    const html = await response.text();
    const container = document.createElement('div');
    container.innerHTML = html.trim();

    const target = document.querySelector(targetSelector) || document.body;

    // Insertar todos los nodos hijos
    while (container.firstChild) {
      target.appendChild(container.firstChild);
    }

    console.log(`✅ Componente cargado: ${name} (${path})`);
    return true;
  } catch (error) {
    console.error(`❌ Error cargando componente ${name}:`, error);
    return false;
  }
}

/**
 * Carga todos los componentes necesarios
 */
async function loadAllComponents() {
  console.log('📦 Cargando componentes del escritorio XP...');

  const results = await Promise.all([
    loadComponent('paint'),
    loadComponent('vlc-nativo'),
    loadComponent('prueba'),
    loadComponent('mypictures'),
    loadComponent('galleryDialogs'),
    loadComponent('paintDialogs'),
  ]);

  const loaded = results.filter(Boolean).length;
  console.log(`📦 Componentes cargados: ${loaded}/6`);

  return loaded === 6;
}

// Exponer globalmente por si se necesita recargar
window.loadComponent = loadComponent;
window.loadAllComponents = loadAllComponents;