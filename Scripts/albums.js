// ---------- albums.js ----------

// Centralized album data (single source of truth)
const ALBUMS = {
  "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 6 },
  "pandas-2025":    { name: "Pandas 2025",    folder: "Pandas",     total: 8 },
  "nepal-2025":    { name: "Nepal 2025",    folder: "Nepal",     total: 19 },
  "antarctica-2024":{ name: "Antarctica 2024", folder: "Antarctica", total: 14 },
  "svalbard-2024":  { name: "Svalbard 2024",  folder: "Svalbard",   total: 16 },
  "safari-2023":  { name: "Safari to Botswana, Zimbabwe, Zambia and Namibia 2023",  folder: "23Safari",   total: 43 },
  "patagonia-2023":  { name: "Patagonia 2023",  folder: "Patagonia",   total: 16 },
  "french-polynesia-2023":  { name: "French Polynesia 2023",  folder: "FrenchPolynesia",   total: 17 },
  "galapagos-2022":  { name: "Galapagos 2023",  folder: "Galapagos",   total: 9 },
  "western-parks-2021":  { name: "Western Parks 2021",  folder: "WesternParks",   total: 22 },
  "new-zealand-2019":  { name: "New Zealand 2019",  folder: "NewZealand",   total: 21 },
  "switzerland-2019":  { name: "Switzerland 2019",  folder: "Switzerland",   total: 25 }
};

// Keep a single GLightbox instance around
window.albumLightbox = null;

function ensureLightbox(selector) {
  if (typeof GLightbox !== "function") return;

  // Destroy the previous instance and any stray markup
  if (window.albumLightbox && typeof window.albumLightbox.destroy === "function") {
    window.albumLightbox.destroy();
  }
  document.querySelectorAll(".glightbox-container, .glightbox-overlay").forEach(el => el.remove());

  window.albumLightbox = GLightbox({
    selector,
    touchNavigation: true,
    closeButton: true,
    loop: false
  });
}

// Build the album cards on albums.html (list page)
function initAlbums() {
  const container = document.getElementById("albums-container");
  if (!container) return;

  container.innerHTML = ""; // avoid duplicating cards if user revisits

  Object.entries(ALBUMS).forEach(([key, album]) => {
    const cover = `Images/${album.folder}/${album.folder}1.jpeg`;

    // small previews below card title
    let previewsHTML = '<div class="d-flex justify-content-center flex-wrap mt-2">';
    for (let i = 1; i <= Math.min(album.total, 4); i++) {
      const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
      previewsHTML += `<img src="${src}" class="img-thumbnail m-1" style="height:60px;width:60px;object-fit:cover;" alt="${album.name}">`;
    }
    previewsHTML += "</div>";

    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card shadow-lg h-100">
        <img src="${cover}" class="card-img-top" alt="${album.name}" style="object-fit:cover;height:180px;">
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title mb-2">${album.name}</h5>
          ${previewsHTML}
          <button class="btn btn-primary mt-auto" data-album="${key}">View Album</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // Delegate click for all "View Album" buttons
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-album]");
    if (!btn) return;
    const albumKey = btn.getAttribute("data-album");
    loadAlbum(albumKey);
  }, { once: true }); // attach once; cards are rebuilt when page reloads
}

// Render a single album grid into #content
function loadAlbum(albumKey) {
  const album = ALBUMS[albumKey];
  if (!album) return;

  const content = document.getElementById("content");
  if (!content) return;

  // Clear previous content
  content.innerHTML = "";

  // Title + grid
  const title = document.createElement("h2");
  title.className = "text-center mb-4";
  title.textContent = album.name;

  const grid = document.createElement("div");
  grid.className = "d-flex flex-wrap justify-content-center";

  for (let i = 1; i <= album.total; i++) {
    const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
    const a = document.createElement("a");
    a.href = src;
    a.className = "m-1 glightbox";
    a.setAttribute("data-gallery", albumKey);

    const img = document.createElement("img");
    img.src = src;
    img.className = "img-thumbnail";
    img.style.height = "120px";
    img.style.width = "120px";
    img.style.objectFit = "cover";

    a.appendChild(img);
    grid.appendChild(a);
  }

  content.appendChild(title);
  content.appendChild(grid);

  // Initialize (or re-init) GLightbox JUST for this album
  ensureLightbox(`.glightbox[data-gallery="${albumKey}"]`);

  // Optional: scroll to top of content so user sees the grid
  content.scrollIntoView({ behavior: "smooth", block: "start" });
}

// If albums.html is the initial page content (SSR), you could call initAlbums on DOM ready.
// In SPA flow we call it from loadPage after injecting albums.html.
document.addEventListener("DOMContentLoaded", () => {
  const maybeList = document.getElementById("albums-container");
  if (maybeList) initAlbums();
});
