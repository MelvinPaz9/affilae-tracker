(async function () {
  console.log("[Supabase] Test de connexion démarré ✅");

  // --- Charger le client Supabase si nécessaire ---
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

  // --- Initialiser Supabase ---
  const supabase = window.supabase.createClient(
    "https://ynrjocozcnuhfntxrhao.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucmpvY296Y251aGZudHhyaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTkyOTcsImV4cCI6MjA3MzYzNTI5N30.Jp0cmDUVBsjy-xOqo5rjPMYZZMKvnMH4eOtU_ahVoIY"
  );

  // --- Envoi de données test ---
  const { data, error } = await supabase
    .from("logs_test") // nom de ta table
    .insert([
      {
        message: "Test JS externe réussi",
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      }
    ]);

  if (error) {
    console.error("[Supabase] Erreur ❌", error);
  } else {
    console.log("[Supabase] Insertion réussie ✅", data);
  }
})();
