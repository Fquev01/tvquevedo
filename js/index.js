import "../SASS/main.scss";
import { searchShows, getTodaySchedule } from "./api.js";
import { $, formatDateISO, showCardHTML, episodeCardHTML } from "./utils.js";

const form = $("#searchForm");
const input = $("#query");
const resultsGrid = $("#resultsGrid");
const searchStatus = $("#searchStatus");
const clearBtn = $("#clearBtn");

const todayGrid = $("#todayGrid");
const todayStatus = $("#todayStatus");

function setStatus(el, msg) {
  el.textContent = msg;
}

function renderGrid(el, htmlItems) {
  el.innerHTML = htmlItems.join("");
}

async function loadToday() {
  try {
    setStatus(todayStatus, "Cargando programación de hoy…");
    const dateISO = formatDateISO(new Date());
    const data = await getTodaySchedule("US", dateISO);

    if (!data.length) {
      setStatus(todayStatus, "No hay programación disponible para hoy.");
      todayGrid.innerHTML = "";
      return;
    }

    // solo mostramos algunos para que sea ligero
    const top = data.slice(0, 12);
    renderGrid(todayGrid, top.map(episodeCardHTML));
    setStatus(todayStatus, `Mostrando ${top.length} de ${data.length} transmisiones (${dateISO}).`);
  } catch (err) {
    console.error(err);
    setStatus(todayStatus, "Error cargando programación. Intenta más tarde.");
  }
}

async function handleSearch(q) {
  try {
    setStatus(searchStatus, "Buscando…");
    resultsGrid.innerHTML = "";
    clearBtn.hidden = true;

    const data = await searchShows(q);
    const shows = data.map((x) => x.show).filter(Boolean);

    if (!shows.length) {
      setStatus(searchStatus, "Sin resultados. Prueba otro término.");
      return;
    }

    renderGrid(resultsGrid, shows.slice(0, 24).map(showCardHTML));
    setStatus(searchStatus, `Resultados: ${Math.min(shows.length, 24)} (de ${shows.length}).`);
    clearBtn.hidden = false;
  } catch (err) {
    console.error(err);
    setStatus(searchStatus, "Error buscando. Revisa tu conexión e intenta de nuevo.");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  handleSearch(q);
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  resultsGrid.innerHTML = "";
  setStatus(searchStatus, "");
  clearBtn.hidden = true;
});

loadToday();
