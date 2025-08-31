let imageData = {};

// Load image-data.json
async function loadImageData() {
  try {
    const res = await fetch("image-data.json");
    imageData = await res.json();
  } catch (err) {
    console.error("Failed to load image-data.json", err);
  }
}

// Initialize galleries
async function initGalleries() {
  await loadImageData();

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {
    const imgs = gallery.querySelectorAll("img");

    imgs.forEach((img) => {
      let filename = img.getAttribute("data-filename") || img.src.split("/").pop();

      // If src is not set correctly, build it from folder + filename
      if (!img.src.includes(filename)) {
        const folderMatch = filename.match(/^(\d+[A-Za-z]+)/); // e.g., "19Safari"
        const folder = folderMatch ? folderMatch[1] : "";
        img.src = `Images/${folder}/${filename}`;
      }

      const caption = imageData[filename] || "";

      // Wrap image in a link for GLightbox
      const link = document.createElement("a");
      link.href = img.src;
      link.className = "glightbox";
      if (caption) link.setAttribute("data-title", caption);

      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    });
  });

  // Initialize GLightbox
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".glightbox" });
  }
}

document.addEventListener("DOMContentLoaded", initGalleries);
