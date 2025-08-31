const ALBUMS = {
  "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 40 },
  "pandas-2025":    { name: "Pandas 2025",    folder: "Pandas",     total: 8 },
  "nepal-2025":     { name: "Nepal 2025",     folder: "Nepal",      total: 19 },
  "antarctica-2024":{ name: "Antarctica 2024", folder: "Antarctica", total: 14 },
  "safari-2024":    { name: "Safari to Botswana, Zimbabwe, and Kenya 2024", folder: "23Safari", total: 41 },
  "svalbard-2024":  { name: "Svalbard 2024",  folder: "Svalbard",   total: 16 },
  "safari-2023":    { name: "Safari to Botswana, Zimbabwe, Zambia and Namibia 2023", folder: "23Safari", total: 50 },
  "patagonia-2023": { name: "Patagonia 2023", folder: "Patagonia",  total: 16 },
  "french-polynesia-2023": { name: "French Polynesia 2023", folder: "FrenchPolynesia", total: 17 },
  "galapagos-2022": { name: "Galapagos 2023", folder: "Galapagos",  total: 9 },
  "western-parks-2021": { name: "Western Parks 2021", folder: "WesternParks", total: 22 },
  "new-zealand-2019": { name: "New Zealand 2019", folder: "NewZealand", total: 21 },
  "switzerland-2019": { name: "Switzerland 2019", folder: "Switzerland", total: 25 },
  "via-ferrata": { name: "Via Ferratas Around the World", folder: "ViaFerrata", total: 10 },
  "iceland-2019": { name: "Iceland 2019", folder: "Iceland", total: 22 },
  "south-africa-2019": { name: "South Africa 2019", folder: "19SouthAfrica", total: 35 },
  "safari-2019": { name: "Safari to Botswana, Zambia, and Zimbabwe 2019", folder: "19Safari", total: 29 },
  "river-cruise-2018": { name: "Rhine River Cruise 2018", folder: "18RiverCruise", total: 35 },
  "amalfi-2018": { name: "Amalfi Coast 2018", folder: "Amalfi", total: 27 },
  "tanzania-2017": { name: "Safari to Tanzania 2017", folder: "17Tanzania", total: 24 }
};

async function initAlbums() {
  const container = document.getElementById("albums-container");
  const toc = document.getElementById("albums-toc");
  if (!container || !toc) return;

  container.innerHTML = "";
  toc.innerHTML = "";

  // Load image metadata
  const imageMeta = await fetch("image-data.json").then(res => res.json());

  // --- Create search input ---
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "form-control mb-3";
  searchInput.placeholder = "Search albums...";
  toc.appendChild(searchInput);

  const albumCards = [];

  // --- Build album cards ---
  Object.entries(ALBUMS).forEach(([key, album]) => {
    const albumId = `album-${key}`;
    const albumHref = `album.html?album=${encodeURIComponent(key)}`;

    // Filter only images that exist for this folder
    const albumImages = Object.keys(imageMeta).filter(f => f.startsWith(album.folder));

    // First image as cover
    const cover = albumImages.length > 0
      ? `Images/${album.folder}/${albumImages[0]}`
      : "placeholder.jpg";

    // Previews (first 4 real images)
    let previewsHTML = '<div class="d-flex justify-content-center flex-wrap mt-2">';
    albumImages.slice(0, 4).forEach(img => {
      previewsHTML += `<img src="Images/${album.folder}/${img}" 
                        class="img-thumbnail m-1" style="height:60px;width:60px;object-fit:cover;">`;
    });
    previewsHTML += "</div>";

    // Card
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4 album-card";
    col.id = albumId;
    col.setAttribute("data-album-name", album.name.toLowerCase());
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
    albumCards.push(col);
  });

  // --- Filter logic ---
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    albumCards.forEach(card => {
      const name = card.getAttribute("data-album-name");
      card.style.display = name.includes(query) ? "" : "none";
    });
  });
}
