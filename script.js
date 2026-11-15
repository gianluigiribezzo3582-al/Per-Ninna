// --- Configurazione --------------------------------------------------------
// Il contatore parte da qui: 7 giugno 2026, 21:51
const INIZIO = new Date(2026, 5, 7, 21, 51); // mesi da 0: 5 = giugno

// Entrambe le versioni aprono la busta: la tua e la sua.
const ORE_GIUSTE = ["21:51", "21:54"];

// Notifiche sul telefono di Gibbo (app ntfy, argomento qui sotto).
const NTFY_URL = "https://ntfy.sh/perninna-96cfb51d7730";

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
  notifica("💌 Ninna ha aperto la lettera", `Ha rotto il sigillo scrivendo ${ora}.`);
  setTimeout(() => apriLettera(false), 1100);
});

// Se l'ha già aperta una volta, non le chiediamo di nuovo l'ora.
// Per testare: aggiungi ?apri all'URL.
let giaAperta = false;
try { giaAperta = localStorage.getItem("ninna-aperta") === "1"; } catch (_) {}
if (giaAperta || new URLSearchParams(location.search).has("apri")) apriLettera(true);

// --- Notifiche ---------------------------------------------------------------
// Aprendo la pagina una volta con ?io, questo dispositivo non manda più notifiche.
// Con ?apri (le prove) non parte niente.
const parametri = new URLSearchParams(location.search);
let sonoIo = parametri.has("io") || parametri.has("apri");
try {
  if (parametri.has("io")) localStorage.setItem("ninna-sono-io", "1");
  sonoIo = sonoIo || localStorage.getItem("ninna-sono-io") === "1";
} catch (_) {}

function notifica(titolo, testo, minutiDiPausa = 0) {
  if (sonoIo) return;
  try {
    // Evita una raffica di notifiche se ricarica la pagina più volte di fila.
    const ultima = Number(localStorage.getItem("ninna-ultima-notifica")) || 0;
    if (Date.now() - ultima < minutiDiPausa * 60000) return;
    localStorage.setItem("ninna-ultima-notifica", String(Date.now()));
  } catch (_) {}

  const ora = new Date().toLocaleString("it-IT", { dateStyle: "long", timeStyle: "short" });
  fetch(`${NTFY_URL}?title=${encodeURIComponent(titolo)}`, {
    method: "POST",
    body: `${testo}\n${ora}`,
    keepalive: true,
  }).catch(() => {});
}

if (giaAperta) notifica("📖 Ninna ha riaperto la lettera", "È tornata a leggerla.", 30);

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
