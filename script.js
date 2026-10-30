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
  setTimeout(() => apriLettera(false), 1100);
});

// Se l'ha già aperta una volta, non le chiediamo di nuovo l'ora.
// Per testare: aggiungi ?apri all'URL.
let giaAperta = false;
try { giaAperta = localStorage.getItem("ninna-aperta") === "1"; } catch (_) {}
if (giaAperta || new URLSearchParams(location.search).has("apri")) apriLettera(true);

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
