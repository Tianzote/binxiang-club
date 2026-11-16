/* ====== CLUB BIN XIANG — configuración (edita solo este bloque) ====== */
window.CLUB = {
  // Pega aquí la URL de tu Web App de Apps Script (termina en /exec):
  API: 'https://script.google.com/macros/s/AKfycbz6TgfhEHNldngYw0UGN33YWiUJBPHpZH-TO2dDzORiOz0qdmyJf9R4k4pmILg5RhbC/exec',

  META: 9,

  // Opciones al canjear el premio (se registran en la planilla):
  CANJES: ['Colación', '3 porciones de arrollado primavera', '4 porciones de wantán'],

  // Botones rápidos de la caja. Cambia estos textos por tus colaciones reales:
  PEDIDOS: ['Colación pollo', 'Colación carne', 'Colación cerdo', 'Colación vegetariana', 'Arroz chaufán', 'Otro'],
  PAGOS: ['Efectivo', 'Débito', 'Crédito', 'Sodexo/Pluxee', 'Edenred', 'Junaeb', 'Amipass', 'Transferencia']
};
/* ==================================================================== */

/* No tocar desde aquí */
window.clubApi = async function (accion, datos) {
  if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(CLUB.API) && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(CLUB.API)) {
    throw new Error('Falta configurar la URL de Apps Script en club-config.js');
  }
  const cuerpo = JSON.stringify(Object.assign({ accion: accion }, datos || {}));
  // Sin cabeceras propias: así el navegador no hace "preflight" y Apps Script acepta la llamada.
  const r = await fetch(CLUB.API, { method: 'POST', body: cuerpo, redirect: 'follow' });
  if (!r.ok) throw new Error('El servidor respondió ' + r.status);
  return r.json();
};
window.clubDots = function (el, timbres, meta) {
  el.textContent = '';
  for (let i = 0; i < meta; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i < timbres ? ' on' : '');
    d.textContent = i < timbres ? '✓' : String(i + 1);
    el.appendChild(d);
  }
  const g = document.createElement('span');
  g.className = 'dot gift';
  g.textContent = '🎁';
  el.appendChild(g);
};
window.clubQr = function (el, texto, px) {
  const q = qrcode(0, 'M');
  q.addData(texto);
  q.make();
  const n = q.getModuleCount(), c = document.createElement('canvas'), m = 4;
  const s = Math.max(2, Math.floor(px / (n + m * 2)));
  c.width = c.height = (n + m * 2) * s;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#000';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (q.isDark(i, j)) x.fillRect((j + m) * s, (i + m) * s, s, s);
  el.textContent = '';
  el.appendChild(c);
};
