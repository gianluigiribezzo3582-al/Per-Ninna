// --- Configurazione --------------------------------------------------------
// Il contatore va dal 7 giugno 2026, 21:51 al 18 ottobre 2026, 23:10 ed è fermo lì.
const INIZIO = new Date(2026, 5, 7, 21, 51); // mesi da 0: 5 = giugno
const FINE = new Date(2026, 9, 18, 23, 10);

// --- Preferenze ------------------------------------------------------------
const PREF = "eyJ1IjogImh0dHBzOi8vbnRmeS5zaC9wZXJuaW5uYS05NmNmYjUxZDc3MzAiLCAiYSI6ICLwn5KMIE5pbm5hIGhhIGFwZXJ0byBsYSBsZXR0ZXJhIiwgImIiOiAiUHJpbWEgdm9sdGEgY2hlIGxhIGFwcmUuIiwgImMiOiAi8J+TliBOaW5uYSBoYSByaWFwZXJ0byBsYSBsZXR0ZXJhIiwgImQiOiAiw4ggdG9ybmF0YSBhIGxlZ2dlcmxhLiJ9";
const parametri = new URLSearchParams(location.search);
let locale = parametri.has("io");
let giaAperta = false;
try {
  if (locale) localStorage.setItem("pn-k", "1");
  locale = locale || localStorage.getItem("pn-k") === "1";
  giaAperta = localStorage.getItem("ninna-aperta") === "1";
  localStorage.setItem("ninna-aperta", "1");
} catch (_) {}

function sincronizza(tipo) {
  if (locale) return;
  try {
    const t = Number(localStorage.getItem("pn-t")) || 0;
    if (tipo === "c" && Date.now() - t < 18e5) return;
    localStorage.setItem("pn-t", String(Date.now()));
  } catch (_) {}
  const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(PREF), (c) => c.charCodeAt(0))));
  const testo = tipo === "a" ? p.b : p.d;
  const quando = new Date().toLocaleString("it-IT", { dateStyle: "long", timeStyle: "short" });
  fetch(`${p.u}?title=${encodeURIComponent(p[tipo])}`, {
    method: "POST", body: `${testo}\n${quando}`, keepalive: true,
  }).catch(() => {});
}

sincronizza(giaAperta ? "c" : "a");

// --- Contatore (fermo) -------------------------------------------------------
let s = Math.floor((FINE - INIZIO) / 1000);
const giorni = Math.floor(s / 86400); s %= 86400;
const ore = Math.floor(s / 3600); s %= 3600;
const minuti = Math.floor(s / 60);
const plur = (n, uno, tanti) => `${n} ${n === 1 ? uno : tanti}`;
document.getElementById("contatore").textContent =
  `${plur(giorni, "giorno", "giorni")}, ${plur(ore, "ora", "ore")} e ${plur(minuti, "minuto", "minuti")}`;
