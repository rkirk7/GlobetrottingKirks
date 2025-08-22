// albums.js
function initAlbums() {
  const albums = [
    { name: "Churchill 2025", folder: "Churchill", param: "churchill-2025", total: 6 },
    { name: "Svalbard 2024", folder: "Svalbard", param: "svalbard-2024", total: 6 }
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
          <a href="album.html?album=${album.param}" class="btn btn-primary mt-auto">View Album</a>
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
