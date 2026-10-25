// Prąd: urządzenia (W × h/dzień) × cena kWh × 30 dni.
(function () {
  'use strict';
  var KEY = 'prad-v1';
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && Array.isArray(s.items)) return s;
    } catch (e) {}
    return { kwh: 1.15, items: [
      { n: 'Lodówka', w: 150, h: 8 },
      { n: 'TV + dekoder', w: 120, h: 4 }
    ]};
  }
  var st = load();
  var rowsEl = document.getElementById('rows');
  document.getElementById('kwh').value = st.kwh;
  function fmt(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function save() {
    st.kwh = +document.getElementById('kwh').value || 0;
    st.items = Array.prototype.map.call(rowsEl.querySelectorAll('.row'), function (r) {
      return { n: r.querySelector('.n').value, w: +r.querySelector('.w').value || 0, h: +r.querySelector('.h').value || 0 };
    });
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }
  function render() {
    save();
    var mies = st.items.reduce(function (a, i) { return a + i.w * i.h / 1000 * st.kwh * 30; }, 0);
    document.getElementById('out').textContent = fmt(mies) + ' zł / mies.';
    var top = st.items.map(function (i) {
      return { n: i.n, c: i.w * i.h / 1000 * st.kwh * 30 };
    }).sort(function (a, b) { return b.c - a.c; })[0];
    document.getElementById('detail').textContent =
      'Rocznie: ok. ' + fmt(mies * 12) + ' zł.' +
      (top && top.c > 0 ? ' Najwięcej ciągnie: ' + (top.n || 'urządzenie') + ' (' + fmt(top.c) + ' zł/mies.).' : '');
  }
  function addRow(it) {
    it = it || { n: '', w: '', h: '' };
    var d = document.createElement('div');
    d.className = 'row';
    d.innerHTML = '<input class="n" placeholder="Urządzenie" style="flex:2;min-width:0"> ' +
      '<input class="w" type="number" min="0" step="any" placeholder="W" style="flex:1;min-width:0"> ' +
      '<input class="h" type="number" min="0" max="24" step="any" placeholder="h/dz." style="flex:1;min-width:0"> ' +
      '<button type="button" title="Usuń">×</button>';
    d.querySelector('.n').value = it.n || '';
    d.querySelector('.w').value = it.w === '' ? '' : it.w;
    d.querySelector('.h').value = it.h === '' ? '' : it.h;
    d.querySelector('button').addEventListener('click', function () { d.remove(); render(); });
    d.addEventListener('input', render);
    rowsEl.appendChild(d);
  }
  st.items.forEach(addRow);
  if (!st.items.length) addRow();
  document.getElementById('add').addEventListener('click', function () { addRow(); render(); });
  document.getElementById('kwh').addEventListener('input', render);
  render();
})();
