import{$ as s,b as w,c as g,d as f,h as c}from"./utils-BtFFPfyV.js";const $=new URLSearchParams(window.location.search),l=$.get("id"),i=s("#detailStatus"),S=s("#showDetail"),u=s("#showPoster"),E=s("#detail-title"),y=s("#showMeta"),T=s("#showGenres"),L=s("#showSummary"),p=s("#showOfficial"),r=s("#episodesStatus"),h=s("#episodesList");function t(e,o){e.textContent=o}function _(e){return`<span class="chip">${c(e)}</span>`}function x(e){const o=c(e.name??"Episodio"),n=e.season??"—",a=e.number??"—",d=e.airdate??"—",m=e.runtime?`${e.runtime} min`:"—";return`
    <li class="episode">
      <div class="episode__title">${o}</div>
      <div class="episode__meta muted">T${n}E${a} • ${c(d)} • ${c(m)}</div>
    </li>
  `}async function C(){if(!l){t(i,"Falta el parámetro id en la URL.");return}try{t(i,"Cargando detalle…");const e=await w(l);document.title=`${e.name} — TVMaze Explorer`;const o=e.image?.original||e.image?.medium||"https://via.placeholder.com/420x590?text=No+Image";u.src=o,u.alt=`Poster de ${e.name}`,E.textContent=e.name??"Show";const n=e.rating?.average??"—",a=e.premiered??"—",d=e.status??"—",m=e.network?.name||e.webChannel?.name||"—";y.textContent=`⭐ ${n} • Estreno: ${a} • Estado: ${d} • Canal: ${m}`,T.innerHTML=(e.genres??[]).map(_).join("")||'<span class="muted">Sin géneros</span>',L.innerHTML=e.summary||"<p class='muted'>Sin resumen disponible.</p>",e.officialSite?(p.href=e.officialSite,p.hidden=!1):p.hidden=!0,S.hidden=!1,t(i,"")}catch(e){console.error(e),t(i,"Error cargando el detalle del show.")}}async function M(){if(l)try{t(r,"Cargando episodios…");const e=await g(l);if(!e.length){t(r,"No hay episodios disponibles."),h.innerHTML="";return}const o=f(e);h.innerHTML=o.map(([n,a])=>`
          <section class="season">
            <h3 class="season__title">Temporada ${n}</h3>
            <ol class="season__list">
              ${a.map(x).join("")}
            </ol>
          </section>
        `).join(""),t(r,`Total de episodios: ${e.length}`)}catch(e){console.error(e),t(r,"Error cargando episodios.")}}C();M();
