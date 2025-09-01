const ALBUMS = {
  "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 40 },
  "pandas-2025": { name: "Pandas 2025", folder: "Pandas", total: 8 },
  "nepal-2025": { name: "Nepal 2025", folder: "Nepal", total: 19 },
  "antarctica-2024": {
    name: "Antarctica 2024",
    folder: "Antarctica",
    total: 14,
  },
  "safari-2024": {
    name: "Safari to Botswana, Zimbabwe, and Kenya 2024",
    folder: "23Safari",
    total: 41,
  },
  "svalbard-2024": { name: "Svalbard 2024", folder: "Svalbard", total: 16 },
  "safari-2023": {
    name: "Safari to Botswana, Zimbabwe, Zambia and Namibia 2023",
    folder: "23Safari",
    total: 50,
  },
  "patagonia-2023": { name: "Patagonia 2023", folder: "Patagonia", total: 16 },
  "french-polynesia-2023": {
    name: "French Polynesia 2023",
    folder: "FrenchPolynesia",
    total: 17,
  },
  "galapagos-2022": { name: "Galapagos 2023", folder: "Galapagos", total: 9 },
  "western-parks-2021": {
    name: "Western Parks 2021",
    folder: "WesternParks",
    total: 22,
  },
  "new-zealand-2019": { name: "New Zealand", folder: "NewZealand", total: 27 },
  "switzerland-2019": {
    name: "Switzerland 2019",
    folder: "Switzerland",
    total: 25,
  },
  "via-ferrata": {
    name: "Via Ferratas Around the World",
    folder: "ViaFerrata",
    total: 10,
  },
  "iceland-2019": { name: "Iceland 2019", folder: "Iceland", total: 22 },
  "south-africa-2019": {
    name: "South Africa 2019",
    folder: "19SouthAfrica",
    total: 35,
  },
  "safari-2019": {
    name: "Safari to Botswana, Zambia, and Zimbabwe 2019",
    folder: "19Safari",
    total: 29,
  },
  "river-cruise-2018": {
    name: "Rhine River Cruise 2018",
    folder: "18RiverCruise",
    total: 35,
  },
  "amalfi-2018": { name: "Amalfi Coast 2018", folder: "Amalfi", total: 27 },
  "balkans-2018": {
    name: "Slovenia, Croatia, Bosnia-Herzegovina and Montenegro 2018",
    folder: "Balkans",
    total: 59,
  },
  "tanzania-2017": {
    name: "Safari to Tanzania 2017",
    folder: "17Tanzania",
    total: 34,
  },
  "ireland-2017": { name: "Ireland 2017", folder: "17Ireland", total: 31 },
  "china-2016": { name: "China 2016", folder: "16China", total: 37 },
};

async function initAlbums() {
  const container = document.getElementById("albums-container");
  const toc = document.getElementById("albums-toc");
  if (!container || !toc) return;

  container.innerHTML = "";
  toc.innerHTML = "";

  // Load image metadata
  const imageMeta = await fetch("image-data.json").then((res) => res.json());

  // --- Search bar ---
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "form-control mb-3";
  searchInput.placeholder = "Search albums...";
  toc.appendChild(searchInput);

  // --- Dropdown for quick navigation ---
  const albumSelect = document.createElement("select");
  albumSelect.className = "form-select mb-3";
  albumSelect.innerHTML = `<option value="">Select an album...</option>`;
  Object.entries(ALBUMS).forEach(([key, album]) => {
    albumSelect.innerHTML += `<option value="${key}">${album.name}</option>`;
  });
  toc.appendChild(albumSelect);

  // Open album in new tab when selected
  albumSelect.addEventListener("change", () => {
    const selected = albumSelect.value;
    if (selected) {
      window.open(`album.html?album=${encodeURIComponent(selected)}`, "_blank");
    }
  });

  // --- Create album cards ---
  // --- Create album cards ---
  const albumCards = [];
  Object.entries(ALBUMS).forEach(([key, album]) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4 album-card";

    // Get first 4 images from folder for previews
    const albumImages = Object.keys(imageMeta).filter((f) =>
      f.startsWith(album.folder)
    );
    const previews = albumImages
      .slice(0, 4)
      .map(
        (img) =>
          `<img src="Images/${album.folder}/${img}" class="img-fluid preview-img" alt="${album.name}" loading="lazy">`
      )
      .join("");

    card.innerHTML = `
    <div class="card h-100">
      <a href="album.html?album=${encodeURIComponent(key)}" target="_blank">
        <div class="preview-grid">${previews}</div>
      </a>
      <div class="card-body text-center">
        <h5 class="card-title">${album.name}</h5>
        <a href="album.html?album=${encodeURIComponent(
          key
        )}" target="_blank" class="btn btn-primary mt-2">View Album</a>
      </div>
    </div>`;
    container.appendChild(card);
    albumCards.push({ key, card });
  });

  // --- Search filter logic ---
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    albumCards.forEach(({ key, card }) => {
      const name = ALBUMS[key].name.toLowerCase();
      card.style.display = name.includes(query) ? "" : "none";
    });
  });
}
