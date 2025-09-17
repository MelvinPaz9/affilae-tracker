(async function () {
  console.log("[Affilae] Script démarré ✅");

  // Récupération AECID depuis URL, localStorage ou cookies
  function getParam(name) {
    try {
      return new URLSearchParams(location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function getCookie(n) {
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + n + '=([^;]+)'));
    return m ? m[1] : null;
  }

  function getAECID() {
    return getParam('aecid') || getParam('ae') || localStorage.getItem('aff_aecid') || getCookie('aff_aecid');
  }

  const AECID = getAECID();
  if (!AECID) {
    console.log("[Affilae] Aucun AECID détecté ❌");
    return;
  }
  console.log("[Affilae] AECID détecté :", AECID);

  // Fonction pour trouver l'email dans un <h2>
  function findEmailInPage() {
    const h2s = document.querySelectorAll("h2");
    for (let i = 0; i < h2s.length; i++) {
      const txt = h2s[i].innerText.trim();
      if (/@/.test(txt) && /\./.test(txt)) {
        return txt;
      }
    }
    return null;
  }

  // Charger Supabase si nécessaire
  if (typeof window.supabase === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
      script.type = "module";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Initialiser Supabase
  const supabase = window.supabase.createClient(
    "https://ynrjocozcnuhfntxrhao.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucmpvY296Y251aGZudHhyaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTkyOTcsImV4cCI6MjA3MzYzNTI5N30.Jp0cmDUVBsjy-xOqo5rjPMYZZMKvnMH4eOtU_ahVoIY"
  );

  // Attendre que l'email apparaisse dans le DOM
  let tries = 0, maxTries = 20;
  (function tick() {
    const email = findEmailInPage();
    if (email) {
      insertIntoSupabase(email);
    } else if (++tries <= maxTries) {
      setTimeout(tick, 500);
    } else {
      console.log("[Affilae] Email introuvable après 10s ❌");
    }
  })();

  // Insertion dans Supabase
  async function insertIntoSupabase(email) {
    const { data, error } = await supabase
      .from("affilae_bridge_by_email")
      .insert([{ email: email, aecid: AECID }]);

    if (error) {
      console.error("[Affilae] Erreur lors de l'envoi ❌", error);
    } else {
      console.log("[Affilae] Données envoyées à Supabase ✅", data);
    }
  }
})();
