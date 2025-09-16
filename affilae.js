(function () {
  console.log("[Affilae] Script démarré ✅");

  function getParam(name) {
    try {
      return new URLSearchParams(location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function getCookie(n) {
    var m = document.cookie.match(new RegExp('(?:^|;\s*)' + n + '=([^;]+)'));
    return m ? m[1] : null;
  }

  function getAECID() {
    return getParam('aecid') || getParam('ae') || localStorage.getItem('aff_aecid') || getCookie('aff_aecid');
  }

  var AECID = getAECID();
  if (!AECID) {
    console.log('[Affilae] Aucun AECID trouvé ❌');
    return;
  }
  console.log('[Affilae] AECID détecté =', AECID);

  function findEmailInPage() {
    var h2s = document.querySelectorAll("h2");
    for (var i = 0; i < h2s.length; i++) {
      var txt = h2s[i].innerText.trim();
      if (/@/.test(txt) && /\./.test(txt)) {
        return txt;
      }
    }
    return null;
  }

  function sendBridge(email) {
    var payload = JSON.stringify({
      email: email,
      aecid: AECID,
      ts: Date.now()
    });
    var url = "https://hook.eu1.make.com/tj6ou1jdtiryg5kuj0abvtx1on3whxh5";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // synchrone
    xhr.setRequestHeader("Content-Type", "application/json");
    try {
      xhr.send(payload);
      console.log('[Affilae] Bridge envoyé ✅', { email, aecid: AECID });
    } catch (e) {
      console.error('[Affilae] Échec de l’envoi ❌', e);
    }
  }

  var tries = 0, maxTries = 20;
  (function tick() {
    var email = findEmailInPage();
    if (email) {
      sendBridge(email);
      return;
    }
    if (++tries <= maxTries) {
      setTimeout(tick, 500);
    } else {
      console.log('[Affilae] Email introuvable après 10s ❌');
    }
  })();

})();