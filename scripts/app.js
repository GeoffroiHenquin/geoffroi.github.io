const $ = (s) => document.querySelector(s);

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Could not load ${path}`);
  return r.json();
}

function projectCard(p) {
  const image = p.images?.[0]
    ? `<img src="${p.images[0]}" alt="" loading="lazy">`
    : `<div class="project-placeholder"><span>${p.title.slice(0, 2).toUpperCase()}</span></div>`;
  return `<a class="project-card glass" href="project.html?id=${encodeURIComponent(p.id)}">
    <div class="project-image">${image}</div>
    <div class="project-content">
      <div class="meta"><span>${p.year}</span><span>${p.context}</span></div>
      <h3>${p.title}</h3><p class="muted">${p.subtitle}</p>
      <div class="tag-list">${p.technologies.slice(0,4).map(t => `<span>${t}</span>`).join("")}</div>
    </div>
  </a>`;
}

async function initProjects() {
  try {
    const projects = await loadJSON("data/projects.json");
    const featured = $("#featured-projects");
    const all = $("#all-projects");
    if (featured) featured.innerHTML = projects.filter(p => p.featured).map(projectCard).join("");
    if (all) all.innerHTML = projects.map(projectCard).join("");
  } catch (e) { console.error(e); }
}

async function initProjectDetail() {
  const root = $("#project-detail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  try {
    const projects = await loadJSON("data/projects.json");
    const p = projects.find(x => x.id === id) || projects[0];
    root.innerHTML = `
      <a class="back-link" href="projects.html">← All projects</a>
      <div class="project-hero">
        <p class="eyebrow">${p.year} · ${p.role}</p><h1 class="page-title">${p.title}</h1>
        <p class="lead">${p.subtitle}</p>
        <div class="tag-list">${p.technologies.map(t=>`<span>${t}</span>`).join("")}</div>
        ${p.links?.length ? `<div class="actions">${p.links.map(l=>`<a class="button primary" target="_blank" rel="noreferrer" href="${l.url}">${l.label} ↗</a>`).join("")}</div>` : ""}
      </div>
      <section class="glass panel"><h2>Context</h2><p>${p.context}</p><p>${p.description}</p></section>
      ${ (p.images?.length + p.videos?.length + p.youtube_videos?.length) ? 
        `<section><div class="gallery">
        ${p.images?.length ? p.images.map(src=>`<img src="${src}" alt="" loading="lazy">`).join("") : ""}
        ${p.videos?.length ? p.videos.map(src=>`<video src="${src}" alt="" loading="lazy" controls="true"></video>`).join("") : ""}
        ${p.youtube_videos?.length ? p.youtube_videos.map(src=>`<iframe width="560" height="315" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>`).join("") : ""}
        </div></section>` 
        : ""}
      ${p.sections.map(s=>`<section class="panel"><h2>${s.title}</h2><p>${s.text}</p></section>`).join("")}
      ${p.code ? `<section><h2>Code</h2><pre class="code-block"><code>${escapeHTML(p.code)}</code></pre></section>` : ""}
    `;
  } catch (e) { root.innerHTML = "<p>Could not load project.</p>"; }
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

async function initTimeline() {
  const root = $("#timeline");
  if (!root) return;
  const data = await loadJSON("data/timeline.json");
  root.innerHTML = data.map(x => `<article class="timeline-item"><div class="timeline-dot"></div><div><p class="eyebrow">${x.date}</p><h2>${x.title}</h2><h3>${x.org}</h3><p>${x.text}</p></div></article>`).join("");
}

document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("open");
});
initProjects();
initProjectDetail();
initTimeline();
