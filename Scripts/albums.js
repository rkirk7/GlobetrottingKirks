// Centralized album data
const albums = {
  "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 6 },
  "pandas-2025": { name: "Pandas 2025", folder: "Pandas", total: 8 },
  "antarctica-2024": { name: "Antarctica 2024", folder: "Antarctica", total: 14 },
  "svalbard-2024": { name: "Svalbard 2024", folder: "Svalbard", total: 16 }
};

// Initialize album cards on albums.html
function initAlbums() {
  const container = document.getElementById("albums-container");
  if (!container) return;

  Object.keys(albums).forEach(key => {
    const album = albums[key];

    // First image as album cover
    const cover = `Images/${album.folder}/${album.folder}1.jpeg`;

    // Generate previews (up to 4 images)
    let previewsHTML = '<div class="d-flex justify-content-center flex-wrap mt-2">';
    for (let i = 1; i <= Math.min(album.total, 4); i++) {
      const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
      previewsHTML += `<img src="${src}" class="img-thumbnail m-1" style="height:60px;width:60px;object-fit:cover;" alt="${album.name}">`;
    }
    previewsHTML += "</div>";

    // Build the card
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");
    card.innerHTML = `
      <div class="card shadow-lg h-100">
        <img src="${cover}" class="card-img-top" alt="${album.name}" style="object-fit:cover;height:180px;">
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title">${album.name}</h5>
          ${previewsHTML}
          <a href="#" class="btn btn-primary" onclick="loadAlbum('${key}')">View Album</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Load images for a specific album into #content
function loadAlbum(albumKey) {
  const album = albums[albumKey];
  if (!album) return;

  const container = document.getElementById("content");
  container.innerHTML = ""; // clear old content

  // Build album title and images
  let html = `<h2 class="text-center mb-4">${album.name}</h2><div class="d-flex flex-wrap justify-content-center">`;

  for (let i = 1; i <= album.total; i++) {
    const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
    html += `<a href="${src}" class="m-1 glightbox" data-gallery="${albumKey}">
               <img src="${src}" class="img-thumbnail" style="height:120px;width:120px;object-fit:cover;">
             </a>`;
  }

  html += "</div>";
  container.innerHTML = html;

  // Re-init GLightbox after content is added
  if (typeof GLightbox === "function") {
    GLightbox({ selector: `.glightbox[data-gallery="${albumKey}"]` });
  }
}

// Run initAlbums when page loads
document.addEventListener("DOMContentLoaded", initAlbums);
