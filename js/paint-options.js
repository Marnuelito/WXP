// ==========================================================================
// PAINT - RENDERIZAR OPCIONES DE HERRAMIENTA
// ==========================================================================

function paintRenderizarOpciones() {
  const contenedor = document.getElementById('paintOpcionesHerramienta');

  if (paintHerramientasConRelleno.includes(paintHerramientaActual)) {
    contenedor.innerHTML = `
      <button class="paint-fill-btn ${paintModoRelleno === 'borde' ? 'activo' : ''}" data-fill="borde" title="Outline only">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="none" stroke="#000" stroke-width="1.5"/></svg>
      </button>
      <button class="paint-fill-btn ${paintModoRelleno === 'borde-relleno' ? 'activo' : ''}" data-fill="borde-relleno" title="Outline and fill">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="#808080" stroke="#000" stroke-width="1.5"/></svg>
      </button>
      <button class="paint-fill-btn ${paintModoRelleno === 'relleno' ? 'activo' : ''}" data-fill="relleno" title="Fill only">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="#808080" stroke="none"/></svg>
      </button>
      <div style="width:100%; height:1px; background:#808080; margin:4px 0;"></div>
      ${paintRenderGrosores()}
    `;
    contenedor.querySelectorAll('.paint-fill-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintModoRelleno = btn.dataset.fill;
        contenedor.querySelectorAll('.paint-fill-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
    paintBindGrosores(contenedor);
  }
  else if (paintHerramientaActual === 'texto') {
    contenedor.innerHTML = `
      <button class="paint-fill-btn ${paintTextoFondoOpaco ? 'activo' : ''}" data-textbg="opaco" title="Opaque background">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="#808080" stroke="#000" stroke-width="1"/><text x="16" y="11" text-anchor="middle" font-size="9" fill="white" font-family="Tahoma">A</text></svg>
      </button>
      <button class="paint-fill-btn ${!paintTextoFondoOpaco ? 'activo' : ''}" data-textbg="transparente" title="Transparent background">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="none" stroke="#000" stroke-width="1"/><text x="16" y="11" text-anchor="middle" font-size="9" fill="#000" font-family="Tahoma">A</text></svg>
      </button>
    `;
    contenedor.querySelectorAll('.paint-fill-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintTextoFondoOpaco = (btn.dataset.textbg === 'opaco');
        contenedor.querySelectorAll('.paint-fill-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'seleccion-rect' || paintHerramientaActual === 'seleccion-libre') {
    contenedor.innerHTML = `
      <button class="paint-fill-btn ${paintSeleccionModoOpaco ? 'activo' : ''}" data-selmode="opaco" title="Opaque selection">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="#808080" stroke="#000" stroke-width="1" stroke-dasharray="2,1"/></svg>
      </button>
      <button class="paint-fill-btn ${!paintSeleccionModoOpaco ? 'activo' : ''}" data-selmode="transparente" title="Transparent selection">
        <svg viewBox="0 0 32 14"><rect x="3" y="2" width="26" height="10" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="2,1"/></svg>
      </button>
    `;
    contenedor.querySelectorAll('.paint-fill-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintSeleccionModoOpaco = (btn.dataset.selmode === 'opaco');
        contenedor.querySelectorAll('.paint-fill-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'lupa') {
    const niveles = [1, 2, 6, 8];
    contenedor.innerHTML = niveles.map(n => `
      <button class="paint-fill-btn ${paintZoom === n ? 'activo' : ''}" data-zoom="${n}" title="${n}x">
        <span style="font-family:Tahoma;font-size:11px;font-weight:bold;">${n}x</span>
      </button>
    `).join('');
    contenedor.querySelectorAll('.paint-fill-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintAplicarZoom(parseInt(btn.dataset.zoom));
        contenedor.querySelectorAll('.paint-fill-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'pincel') {
    const formas = ['circulo', 'cuadrado', 'diag1', 'diag2'];
    const tamanos = ['chico', 'medio', 'grande'];
    let html = '<div class="paint-opt-grid cols-3">';
    formas.forEach(f => {
      tamanos.forEach(t => {
        const activo = (paintPincelForma === f && paintPincelTamano === t) ? 'activo' : '';
        html += `<button class="paint-opt-btn ${activo}" data-forma="${f}" data-tam="${t}" title="${f} ${t}">${paintSvgPincel(f, t)}</button>`;
      });
    });
    html += '</div>';
    contenedor.innerHTML = html;
    contenedor.querySelectorAll('.paint-opt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintPincelForma = btn.dataset.forma;
        paintPincelTamano = btn.dataset.tam;
        contenedor.querySelectorAll('.paint-opt-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'aerografo') {
    const tamanos = ['chico', 'medio', 'grande'];
    let html = '<div class="paint-opt-grid cols-1">';
    tamanos.forEach(t => {
      const activo = paintAerografoTamano === t ? 'activo' : '';
      const cfg = paintAerografoConfig[t];
      html += `<button class="paint-opt-btn ${activo}" data-tam="${t}" title="${t}" style="height:34px;">${paintSvgAerografo(cfg.radio)}</button>`;
    });
    html += '</div>';
    contenedor.innerHTML = html;
    contenedor.querySelectorAll('.paint-opt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintAerografoTamano = btn.dataset.tam;
        contenedor.querySelectorAll('.paint-opt-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'goma') {
    const tamanos = [4, 6, 8, 10];
    let html = '<div class="paint-opt-grid cols-1">';
    tamanos.forEach(t => {
      const activo = paintGomaTamano === t ? 'activo' : '';
      html += `<button class="paint-opt-btn ${activo}" data-tam="${t}" title="${t}px" style="height:26px;">
        <svg viewBox="0 0 30 22" width="30" height="22"><rect x="${15 - t/2}" y="${11 - t/2}" width="${t}" height="${t}" fill="#000"/></svg>
      </button>`;
    });
    html += '</div>';
    contenedor.innerHTML = html;
    contenedor.querySelectorAll('.paint-opt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        paintGomaTamano = parseInt(btn.dataset.tam);
        contenedor.querySelectorAll('.paint-opt-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });
  }
  else if (paintHerramientaActual === 'linea' || paintHerramientaActual === 'curva') {
    contenedor.innerHTML = paintRenderGrosores();
    paintBindGrosores(contenedor);
  }
  else {
    contenedor.innerHTML = '';
  }
}

function paintRenderGrosores() {
  const grosores = [1, 2, 3, 4, 5];
  let html = '<div style="width:100%; display:flex; flex-direction:column; gap:2px;">';
  grosores.forEach(g => {
    const activo = paintGrosorLinea === g ? 'activo' : '';
    html += `<button class="paint-opt-linea-btn ${activo}" data-grosor="${g}" title="${g}px">
      <div class="linea-preview" style="height:${g}px;"></div>
    </button>`;
  });
  html += '</div>';
  return html;
}

function paintBindGrosores(contenedor) {
  contenedor.querySelectorAll('.paint-opt-linea-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      paintGrosorLinea = parseInt(btn.dataset.grosor);
      contenedor.querySelectorAll('.paint-opt-linea-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
    });
  });
}

function paintSvgPincel(forma, tam) {
  const previewSizes = { chico: 1.5, medio: 3, grande: 4.5 };
  const s = previewSizes[tam];
  const cx = 7, cy = 6;
  if (forma === 'circulo') {
    return `<svg viewBox="0 0 14 12" width="14" height="12"><circle cx="${cx}" cy="${cy}" r="${s}" fill="#000"/></svg>`;
  } else if (forma === 'cuadrado') {
    return `<svg viewBox="0 0 14 12" width="14" height="12"><rect x="${cx - s}" y="${cy - s}" width="${s*2}" height="${s*2}" fill="#000"/></svg>`;
  } else {
    const gr = tam === 'chico' ? 1.5 : (tam === 'medio' ? 2.5 : 3.5);
    if (forma === 'diag1') {
      return `<svg viewBox="0 0 14 12" width="14" height="12"><line x1="${cx - s}" y1="${cy + s}" x2="${cx + s}" y2="${cy - s}" stroke="#000" stroke-width="${gr}" stroke-linecap="square"/></svg>`;
    } else {
      return `<svg viewBox="0 0 14 12" width="14" height="12"><line x1="${cx - s}" y1="${cy - s}" x2="${cx + s}" y2="${cy + s}" stroke="#000" stroke-width="${gr}" stroke-linecap="square"/></svg>`;
    }
  }
}

function paintSvgAerografo(radio) {
  let dots = '';
  const seed = radio * 37;
  const numDots = Math.min(radio * 2, 20);
  for (let i = 0; i < numDots; i++) {
    const ang = ((seed + i * 13) % 100) / 100 * Math.PI * 2;
    const d = ((seed + i * 7) % 100) / 100 * (radio * 0.8);
    const x = 12 + Math.cos(ang) * d;
    const y = 12 + Math.sin(ang) * d;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.7" fill="#000"/>`;
  }
  return `<svg viewBox="0 0 24 24" width="24" height="24">${dots}</svg>`;
}