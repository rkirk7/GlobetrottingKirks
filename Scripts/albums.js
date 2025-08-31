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
