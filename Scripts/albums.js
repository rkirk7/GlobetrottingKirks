// ---------- albums.js ----------

// Centralized album data (single source of truth)
const ALBUMS = {
  "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 6 },
  "pandas-2025":    { name: "Pandas 2025",    folder: "Pandas",     total: 8 },
  "nepal-2025":     { name: "Nepal 2025",     folder: "Nepal",      total: 19 },
  "antarctica-2024":{ name: "Antarctica 2024", folder: "Antarctica", total: 14 },
  "svalbard-2024":  { name: "Svalbard 2024",  folder: "Svalbard",   total: 16 },
  "safari-2023":    { name: "Safari to Botswana, Zimbabwe, Zambia and Namibia 2023", folder: "23Safari", total: 43 },
  "patagonia-2023": { name: "Patagonia 2023", folder: "Patagonia",  total: 16 },
  "french-polynesia-2023": { name: "French Polynesia 2023", folder: "FrenchPolynesia", total: 17 },
  "galapagos-2022": { name: "Galapagos 2023", folder: "Galapagos",  total: 9 },
  "western-parks-2021": { name: "Western Parks 2021", folder: "WesternParks", total: 22 },
  "new-zealand-2019": { name: "New Zealand 2019", folder: "NewZealand", total: 21 },
  "switzerland-2019": { name: "Switzerland 2019", folder: "Switzerland", total: 25 },
  "via-ferrata": { name: "Via Ferratas Around the World", folder: "ViaFerrata", total: 4 },
  "iceland-2019": { name: "Iceland 2019", folder: "Iceland", total: 22 }
};

// Build the album cards on albums.html (list page)
// in albums.js
function initAlbums() {
  const container = document.getElementById("albums-container");
  const toc = document.getElementById("albums-toc");
  if (!container || !toc) return;

  container.innerHTML = "";
  toc.innerHTML = "";

  Object.entries(ALBUMS).forEach(([key, album]) => {
    const cover = `Images/${album.folder}/${album.folder}1.jpeg`;
    const albumId = `album-${key}`;
    const albumHref = `album.html?album=${encodeURIComponent(key)}`;

    // TOC link
    const tocLink = document.createElement("a");
    tocLink.href = `#${albumId}`;
    tocLink.className = "btn btn-outline-primary btn-sm m-1";
    tocLink.textContent = album.name;
    toc.appendChild(tocLink);

    // Previews
    let previewsHTML = '<div class="d-flex justify-content-center flex-wrap mt-2">';
    for (let i = 1; i <= Math.min(album.total, 4); i++) {
      previewsHTML += `<img src="Images/${album.folder}/${album.folder}${i}.jpeg" 
                        class="img-thumbnail m-1" style="height:60px;width:60px;object-fit:cover;">`;
    }
    previewsHTML += "</div>";

    // Card
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.id = albumId;
    col.innerHTML = `
      <div class="card shadow-lg h-100">
        <a href="${albumHref}">
          <img src="${cover}" class="card-img-top" alt="${album.name}" style="object-fit:cover;height:180px;">
        </a>
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title mb-2">${album.name}</h5>
          ${previewsHTML}
          <a class="btn btn-primary mt-auto" href="${albumHref}">View Album</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // Smooth scroll
  toc.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute("href").substring(1));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("albums-container")) initAlbums();
});


// If albums.html is the initial page content (SSR), you could call initAlbums on DOM ready.
// In SPA flow we call it from loadPage after injecting albums.html.
document.addEventListener("DOMContentLoaded", () => {
  const maybeList = document.getElementById("albums-container");
  if (maybeList) initAlbums();
});
