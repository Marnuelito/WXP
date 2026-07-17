// ==========================================================================
// PAINT - DIÁLOGO SAVE
// ==========================================================================

function paintAbrirDialogoSave(callback) {
  paintDialogSaveCallback = callback;
  document.getElementById('paintDialogSaveNombre').textContent = paintNombreArchivo;
  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogSave').style.display = 'block';
}

function paintCerrarDialogoSave(respuesta) {
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogSave').style.display = 'none';
  if (paintDialogSaveCallback) {
    const cb = paintDialogSaveCallback;
    paintDialogSaveCallback = null;
    cb(respuesta);
  }
}


// ==========================================================================
// PAINT - DIÁLOGO SAVE AS
// ==========================================================================

function paintAbrirDialogoSaveAs(callback) {
  paintDialogSaveAsCallback = callback;
  const input = document.getElementById('paintDialogSaveAsInput');
  input.value = paintNombreArchivo;
  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogSaveAs').style.display = 'block';
  setTimeout(() => { input.focus(); input.select(); }, 10);
}

function paintCerrarDialogoSaveAs(guardar) {
  const input = document.getElementById('paintDialogSaveAsInput');
  const nombre = input.value.trim();
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogSaveAs').style.display = 'none';
  if (paintDialogSaveAsCallback) {
    const cb = paintDialogSaveAsCallback;
    paintDialogSaveAsCallback = null;
    if (guardar && nombre) cb(nombre);
    else cb(null);
  }
}


// ==========================================================================
// PAINT - IMAGE: FLIP/ROTATE
// ==========================================================================

function paintAbrirDialogoFlipRotate() {
  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogFlipRotate').style.display = 'block';
}

function paintCerrarDialogoFlipRotate(aplicar) {
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogFlipRotate').style.display = 'none';

  if (!aplicar) return;
  if (paintSeleccionActiva) paintConfirmarSeleccion();

  const tipo = document.querySelector('input[name="fliprotate"]:checked').value;
  paintGuardarEnHistorial();

  const w = paintCanvas.width;
  const h = paintCanvas.height;

  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  tmp.getContext('2d').drawImage(paintBuffer, 0, 0, w, h, 0, 0, w, h);

  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, w, h);

  if (tipo === 'flip-h') {
    paintBufferCtx.save();
    paintBufferCtx.translate(w, 0);
    paintBufferCtx.scale(-1, 1);
    paintBufferCtx.drawImage(tmp, 0, 0);
    paintBufferCtx.restore();
  }
  else if (tipo === 'flip-v') {
    paintBufferCtx.save();
    paintBufferCtx.translate(0, h);
    paintBufferCtx.scale(1, -1);
    paintBufferCtx.drawImage(tmp, 0, 0);
    paintBufferCtx.restore();
  }
  else if (tipo === 'rotate') {
    const angulo = parseInt(document.querySelector('input[name="rotateAngle"]:checked').value);
    const rad = angulo * Math.PI / 180;

    paintBufferCtx.save();
    paintBufferCtx.translate(w / 2, h / 2);
    paintBufferCtx.rotate(rad);

    if (angulo === 90 || angulo === 270) {
      paintBufferCtx.drawImage(tmp, -h / 2, -w / 2, h, w);
    } else {
      paintBufferCtx.drawImage(tmp, -w / 2, -h / 2);
    }
    paintBufferCtx.restore();
  }

  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);
}


// ==========================================================================
// PAINT - IMAGE: STRETCH/SKEW
// ==========================================================================

function paintAbrirDialogoStretchSkew() {
  document.getElementById('paintStretchH').value = 100;
  document.getElementById('paintStretchV').value = 100;
  document.getElementById('paintSkewH').value = 0;
  document.getElementById('paintSkewV').value = 0;
  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogStretchSkew').style.display = 'block';
}

function paintCerrarDialogoStretchSkew(aplicar) {
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogStretchSkew').style.display = 'none';

  if (!aplicar) return;
  if (paintSeleccionActiva) paintConfirmarSeleccion();

  const stretchH = parseFloat(document.getElementById('paintStretchH').value) / 100;
  const stretchV = parseFloat(document.getElementById('paintStretchV').value) / 100;
  const skewH = parseFloat(document.getElementById('paintSkewH').value) * Math.PI / 180;
  const skewV = parseFloat(document.getElementById('paintSkewV').value) * Math.PI / 180;

  if (isNaN(stretchH) || isNaN(stretchV) || isNaN(skewH) || isNaN(skewV)) return;
  if (stretchH <= 0 || stretchV <= 0) return;

  paintGuardarEnHistorial();

  const w = paintCanvas.width;
  const h = paintCanvas.height;

  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  tmp.getContext('2d').drawImage(paintBuffer, 0, 0, w, h, 0, 0, w, h);

  paintBufferCtx.fillStyle = '#FFFFFF';
  paintBufferCtx.fillRect(0, 0, w, h);

  paintBufferCtx.save();
  paintBufferCtx.setTransform(
    stretchH, Math.tan(skewV), Math.tan(skewH), stretchV, 0, 0
  );
  paintBufferCtx.drawImage(tmp, 0, 0);
  paintBufferCtx.restore();

  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
  paintCtx.drawImage(paintBuffer, 0, 0);
}


// ==========================================================================
// PAINT - COLORS: EDIT COLORS
// ==========================================================================

const paintColoresBasicos = [
  '#FF8080','#FFFF80','#80FF80','#00FF80','#80FFFF','#0080FF','#FF80C0','#FF80FF',
  '#FF0000','#FFFF00','#80FF00','#00FF40','#00FFFF','#0080C0','#8080C0','#FF00FF',
  '#804040','#FF8040','#00FF00','#008080','#004080','#8080FF','#800040','#FF0080',
  '#800000','#FF8000','#008000','#008040','#0000FF','#0000A0','#800080','#8000FF',
  '#400000','#804000','#004000','#004040','#000080','#000040','#400040','#400080',
  '#000000','#808000','#808040','#808080','#408080','#C0C0C0','#400040','#FFFFFF'
];

let paintEditColorsSeleccionado = '#000000';
let paintEditColorsDestino = 'primario';

function paintAbrirDialogoEditColors(destino) {
  paintEditColorsDestino = destino || 'primario';

  const grid = document.getElementById('paintEditColorsGrid');
  if (grid.children.length === 0) {
    paintColoresBasicos.forEach(color => {
      const celda = document.createElement('div');
      celda.className = 'paint-color-celda-editor';
      celda.style.background = color;
      celda.dataset.color = color;
      celda.addEventListener('click', function() {
        paintEditColorsActualizarColor(color);
        grid.querySelectorAll('.paint-color-celda-editor').forEach(c => c.classList.remove('seleccionado'));
        celda.classList.add('seleccionado');
      });
      grid.appendChild(celda);
    });
  }

  const colorInicial = (destino === 'secundario') ? paintColorSecundario : paintColorPrimario;
  paintEditColorsActualizarColor(colorInicial);

  grid.querySelectorAll('.paint-color-celda-editor').forEach(c => {
    c.classList.remove('seleccionado');
    if (c.dataset.color.toUpperCase() === colorInicial.toUpperCase()) {
      c.classList.add('seleccionado');
    }
  });

  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogEditColors').style.display = 'block';
}

function paintEditColorsActualizarColor(hex) {
  paintEditColorsSeleccionado = hex;
  document.getElementById('paintEditColorsPreview').style.background = hex;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  document.getElementById('paintColorR').value = r;
  document.getElementById('paintColorG').value = g;
  document.getElementById('paintColorB').value = b;
  document.getElementById('paintColorHex').value = hex.toUpperCase();
}

function inicializarEditColors() {
  ['paintColorR', 'paintColorG', 'paintColorB'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
      let r = parseInt(document.getElementById('paintColorR').value) || 0;
      let g = parseInt(document.getElementById('paintColorG').value) || 0;
      let b = parseInt(document.getElementById('paintColorB').value) || 0;
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
      const hex = '#' + toHex(r) + toHex(g) + toHex(b);

      paintEditColorsSeleccionado = hex;
      document.getElementById('paintEditColorsPreview').style.background = hex;
      document.getElementById('paintColorHex').value = hex;

      document.querySelectorAll('#paintEditColorsGrid .paint-color-celda-editor').forEach(c => {
        c.classList.remove('seleccionado');
      });
    });
  });

  document.getElementById('paintColorHex').addEventListener('input', function() {
    let hex = this.value.trim().toUpperCase();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (/^#[0-9A-F]{6}$/.test(hex)) {
      paintEditColorsActualizarColor(hex);
    }
  });

  document.getElementById('paintDialogSaveAsInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); paintCerrarDialogoSaveAs(true); }
    else if (e.key === 'Escape') { e.preventDefault(); paintCerrarDialogoSaveAs(false); }
  });
}

function paintCerrarDialogoEditColors(aplicar) {
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogEditColors').style.display = 'none';

  if (!aplicar) return;

  if (paintEditColorsDestino === 'secundario') {
    paintActualizarColorSecundario(paintEditColorsSeleccionado);
  } else {
    paintActualizarColorPrimario(paintEditColorsSeleccionado);
  }
}


// ==========================================================================
// PAINT - HELP: ABOUT
// ==========================================================================

function paintAbrirDialogoAbout() {
  document.getElementById('paintDialogOverlay').style.display = 'block';
  document.getElementById('paintDialogAbout').style.display = 'block';
}

function paintCerrarDialogoAbout() {
  document.getElementById('paintDialogOverlay').style.display = 'none';
  document.getElementById('paintDialogAbout').style.display = 'none';
}