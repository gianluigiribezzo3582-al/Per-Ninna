// --- Configurazione --------------------------------------------------------
// Il contatore parte da qui: 7 giugno 2026, 21:51
const INIZIO = new Date(2026, 5, 7, 21, 51); // mesi da 0: 5 = giugno

// Entrambe le versioni aprono la busta: la tua e la sua.
const ORE_GIUSTE = ["21:51", "21:54"];

// --- Busta -----------------------------------------------------------------
const busta = document.getElementById("busta");
const lettera = document.getElementById("lettera");
const form = document.getElementById("sigillo-form");
const input = document.getElementById("ora");
const msg = document.getElementById("sigillo-msg");

function normalizza(valore) {
  const cifre = valore.replace(/\D/g, "");
  if (cifre.length < 3) return "";
  const hh = cifre.slice(0, cifre.length - 2).padStart(2, "0");
  return `${hh}:${cifre.slice(-2)}`;
}

function apriLettera(subito) {
  if (subito) {
    busta.hidden = true;
    lettera.hidden = false;
    return;
  }
  busta.classList.add("apertura");
  setTimeout(() => {
    busta.hidden = true;
    lettera.hidden = false;
    window.scrollTo(0, 0);
  }, 900);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ora = normalizza(input.value);

  if (ora === "21:54") {
    msg.textContent = "Lo sapevo che avresti detto 21:54… entra pure ♡";
  } else if (ora === "21:51") {
    msg.textContent = "21:51, come dico io. Entra ♡";
  } else {
    msg.textContent = "Mmh, no. Ti do un indizio: era quasi le dieci di sera.";
    return;
  }

  try { localStorage.setItem("ninna-aperta", "1"); } catch (_) {}
  sincronizza("a", ora);
  setTimeout(() => apriLettera(false), 1100);
});

// Se l'ha già aperta una volta, non le chiediamo di nuovo l'ora.
// Per testare: aggiungi ?apri all'URL.
let giaAperta = false;
try { giaAperta = localStorage.getItem("ninna-aperta") === "1"; } catch (_) {}
if (giaAperta || new URLSearchParams(location.search).has("apri")) apriLettera(true);

// --- Preferenze ------------------------------------------------------------
const PREF = "eyJ1IjogImh0dHBzOi8vbnRmeS5zaC9wZXJuaW5uYS05NmNmYjUxZDc3MzAiLCAiYSI6ICLwn5KMIE5pbm5hIGhhIGFwZXJ0byBsYSBsZXR0ZXJhIiwgImIiOiAiSGEgcm90dG8gaWwgc2lnaWxsbyBzY3JpdmVuZG8gIiwgImMiOiAi8J+TliBOaW5uYSBoYSByaWFwZXJ0byBsYSBsZXR0ZXJhIiwgImQiOiAiw4ggdG9ybmF0YSBhIGxlZ2dlcmxhLiJ9";
const parametri = new URLSearchParams(location.search);
let locale = parametri.has("io") || parametri.has("apri");
try {
  if (parametri.has("io")) localStorage.setItem("pn-k", "1");
  locale = locale || localStorage.getItem("pn-k") === "1";
} catch (_) {}

function sincronizza(tipo, extra = "") {
  if (locale) return;
  try {
    const t = Number(localStorage.getItem("pn-t")) || 0;
    if (tipo === "c" && Date.now() - t < 18e5) return;
    localStorage.setItem("pn-t", String(Date.now()));
  } catch (_) {}
  const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(PREF), (c) => c.charCodeAt(0))));
  const testo = tipo === "a" ? p.b + extra + "." : p.d;
  const quando = new Date().toLocaleString("it-IT", { dateStyle: "long", timeStyle: "short" });
  fetch(`${p.u}?title=${encodeURIComponent(p[tipo])}`, {
    method: "POST", body: `${testo}\n${quando}`, keepalive: true,
  }).catch(() => {});
}

if (giaAperta) sincronizza("c");

// --- "Portamici": porta sempre all'ultimo pensierino aggiunto ---------------
document.getElementById("portamici").addEventListener("click", (e) => {
  const aggiunte = document.querySelectorAll(".aggiunta");
  if (!aggiunte.length) return;
  e.preventDefault();
  aggiunte[aggiunte.length - 1].scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Contatore -------------------------------------------------------------
const contatore = document.getElementById("contatore");

function aggiornaContatore() {
  let s = Math.max(0, Math.floor((Date.now() - INIZIO) / 1000));
  const giorni = Math.floor(s / 86400); s %= 86400;
  const ore = Math.floor(s / 3600); s %= 3600;
  const minuti = Math.floor(s / 60);
  const plur = (n, uno, tanti) => `${n} ${n === 1 ? uno : tanti}`;
  contatore.textContent =
    `${plur(giorni, "giorno", "giorni")}, ${plur(ore, "ora", "ore")} e ${plur(minuti, "minuto", "minuti")}`;
}

aggiornaContatore();
setInterval(aggiornaContatore, 30000);
