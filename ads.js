// Ładuje reklamy TYLKO na publicznej domenie. Lokalnie nic nie robi.
(function () {
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '') return;
  var slot = document.getElementById('ads-slot');
  if (!slot) return;
  slot.hidden = false;
  // TODO (przed publikacją): wklej snippet AdSense + RODO-consent.
  slot.textContent = 'Miejsce na reklamę';
})();
