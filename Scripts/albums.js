// albums.js
function initAlbums() {
  const albums = [
    { name: "Churchill 2025", folder: "Churchill", param: "churchill-2025", total: 6 },
    { name: "Pandas 2025", folder: "Pandas", param: "pandas-2025", total: 8 },
    { name: "Antarctica 2024", folder: "Antarctica", param: "antartctica-2025", total: 14 },
    { name: "Svalbard 2024", folder: "Svalbard", param: "svalbard-2024", total: 16 }
  ];

  const container = document.getElementById("albums-container");
  if (!container) return;

  albums.forEach(album => {
    // Generate preview images (first 4 photos)
    let previewsHTML = '<div class="d-flex justify-content-center flex-wrap mt-2">';
    for (let i = 1; i <= Math.min(album.total, 4); i++) {
      const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
      previewsHTML += `<img src="${src}" class="img-thumbnail m-1" style="height:60px;width:60px;object-fit:cover;" alt="${album.name}" />`;
    }
    previewsHTML += '</div>';

    // First image as cover
    const cover = `Images/${album.folder}/${album.folder}1.jpeg`;

    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");
    card.innerHTML = `
      <div class="card shadow-lg h-100">
        <img src="${cover}" class="card-img-top" alt="${album.name}" style="object-fit:cover;height:180px;">
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title">${album.name}</h5>
          ${previewsHTML}
          <a href="#" class="btn btn-primary" onclick="loadAlbum('${album.param}')">View Album</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Initialize GLightbox for dynamically added links
  if (typeof GLightbox === "function") {
    GLightbox({ selector: 'a.glightbox' });
  }
}


function loadAlbum(albumParam) {
  const container = document.getElementById("content"); // the main content div
  container.innerHTML = ""; // clear current content

  // Map album param to folder info
  const albums = {
    "churchill-2025": { name: "Churchill 2025", folder: "Churchill", total: 6 },
    "svalbard-2024": { name: "Svalbard 2024", folder: "Svalbard", total: 6 }
  };

  const album = albums[albumParam];
  if (!album) return;

  // Build album HTML
  let html = `<h2 class="text-center mb-4">${album.name}</h2><div class="d-flex flex-wrap justify-content-center">`;

  for (let i = 1; i <= album.total; i++) {
    const src = `Images/${album.folder}/${album.folder}${i}.jpeg`;
    html += `<a href="${src}" class="m-1 glightbox" data-gallery="${albumParam}">
               <img src="${src}" class="img-thumbnail" style="height:120px;width:120px;object-fit:cover;">
             </a>`;
  }
  html += "</div>";

  container.innerHTML = html;

  // Initialize GLightbox for this album
  GLightbox({ selector: `.glightbox[data-gallery="${albumParam}"]` });
}
