import "../scss/main.scss";
import { getShowById, getEpisodesByShowId } from "./api.js";
import { $, escapeText, groupBySeason } from "./utils.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const detailStatus = $("#detailStatus");
const showDetail = $("#showDetail");
const showPoster = $("#showPoster");
const titleEl = $("#detail-title");
const metaEl = $("#showMeta");
const genresEl = $("#showGenres");
const summaryEl = $("#showSummary");
const officialEl = $("#showOfficial");

const episodesStatus = $("#episodesStatus");
const episodesList = $("#episodesList");

function setStatus(el, msg) {
  el.textContent = msg;
}

function chip(text) {
  return `<span class="chip">${escapeText(text)}</span>`;
}

function episodeRowHTML(ep) {
  const name = escapeText(ep.name ?? "Episodio");
  const s = ep.season ?? "—";
  const n = ep.number ?? "—";
  const date = ep.airdate ?? "—";
  const runtime = ep.runtime ? `${ep.runtime} min` : "—";

  return `
    <li class="episode">
      <div class="episode__title">${name}</div>
      <div class="episode__meta muted">T${s}E${n} • ${escapeText(date)} • ${escapeText(runtime)}</div>
    </li>
  `;
}

async function loadShow() {
  if (!id) {
    setStatus(detailStatus, "Falta el parámetro id en la URL.");
    return;
  }

  try {
    setStatus(detailStatus, "Cargando detalle…");
    const show = await getShowById(id);

    document.title = `${show.name} — TVMaze Explorer`;

    const img =
      show.image?.original ||
      show.image?.medium ||
      "https://via.placeholder.com/420x590?text=No+Image";

    showPoster.src = img;
    showPoster.alt = `Poster de ${show.name}`;

    titleEl.textContent = show.name ?? "Show";
    const rating = show.rating?.average ?? "—";
    const premiered = show.premiered ?? "—";
    const status = show.status ?? "—";
    const network = show.network?.name || show.webChannel?.name || "—";
    metaEl.textContent = `⭐ ${rating} • Estreno: ${premiered} • Estado: ${status} • Canal: ${network}`;

    genresEl.innerHTML = (show.genres ?? []).map(chip).join("") || `<span class="muted">Sin géneros</span>`;

    // TVMaze ya devuelve summary en HTML. Lo insertamos tal cual.
    summaryEl.innerHTML = show.summary || "<p class='muted'>Sin resumen disponible.</p>";

    if (show.officialSite) {
      officialEl.href = show.officialSite;
      officialEl.hidden = false;
    } else {
      officialEl.hidden = true;
    }

    showDetail.hidden = false;
    setStatus(detailStatus, "");
  } catch (err) {
    console.error(err);
    setStatus(detailStatus, "Error cargando el detalle del show.");
  }
}

async function loadEpisodes() {
  if (!id) return;

  try {
    setStatus(episodesStatus, "Cargando episodios…");
    const eps = await getEpisodesByShowId(id);

    if (!eps.length) {
      setStatus(episodesStatus, "No hay episodios disponibles.");
      episodesList.innerHTML = "";
      return;
    }

    const grouped = groupBySeason(eps);

    episodesList.innerHTML = grouped
      .map(([season, items]) => {
        return `
          <section class="season">
            <h3 class="season__title">Temporada ${season}</h3>
            <ol class="season__list">
              ${items.map(episodeRowHTML).join("")}
            </ol>
          </section>
        `;
      })
      .join("");

    setStatus(episodesStatus, `Total de episodios: ${eps.length}`);
  } catch (err) {
    console.error(err);
    setStatus(episodesStatus, "Error cargando episodios.");
  }
}

loadShow();
loadEpisodes();
