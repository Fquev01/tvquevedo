export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function escapeText(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDateISO(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function showCardHTML(show) {
  const name = escapeText(show.name ?? "Sin título");
  const img =
    show.image?.medium ||
    "https://via.placeholder.com/210x295?text=No+Image";
  const rating = show.rating?.average ?? "—";
  const year = show.premiered ? show.premiered.slice(0, 4) : "—";
  const network = show.network?.name || show.webChannel?.name || "—";

  return `
    <article class="card">
      <a class="card__link" href="/show.html?id=${show.id}" aria-label="Ver detalle de ${name}">
        <img class="card__img" src="${img}" alt="Poster de ${name}" loading="lazy" />
        <div class="card__body">
          <h3 class="card__title">${name}</h3>
          <p class="card__meta">
            <span>⭐ ${rating}</span>
            <span>•</span>
            <span>${year}</span>
          </p>
          <p class="card__meta muted">${escapeText(network)}</p>
        </div>
      </a>
    </article>
  `;
}

export function episodeCardHTML(item) {
  // item puede ser episodio del schedule o del endpoint /episodes
  const showName = item.show?.name ?? "";
  const epName = item.name ?? "Episodio";
  const img =
    item.image?.medium ||
    item.show?.image?.medium ||
    "https://via.placeholder.com/210x295?text=No+Image";

  const season = item.season ?? "—";
  const number = item.number ?? "—";
  const airdate = item.airdate ?? "—";

  const title = showName ? `${showName} — ${epName}` : epName;

  return `
    <article class="card">
      <a class="card__link" href="/show.html?id=${item.show?.id ?? ""}">
        <img class="card__img" src="${img}" alt="Imagen de ${escapeText(title)}" loading="lazy" />
        <div class="card__body">
          <h3 class="card__title">${escapeText(title)}</h3>
          <p class="card__meta">
            <span>T${season}E${number}</span>
            <span>•</span>
            <span>${escapeText(airdate)}</span>
          </p>
        </div>
      </a>
    </article>
  `;
}

export function groupBySeason(episodes = []) {
  const map = new Map();
  for (const ep of episodes) {
    const key = ep.season ?? 0;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ep);
  }
  return [...map.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
}
