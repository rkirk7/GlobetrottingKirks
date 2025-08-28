function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  // Select all galleries or standalone images
  const galleries = container.querySelectorAll(".gallery, img");

  galleries.forEach((gallery) => {
    if (gallery.tagName === "IMG") {
      // Single image outside a gallery
      wrapImageWithCaption(gallery);
    } else {
      // Inside a .gallery container
      const images = gallery.querySelectorAll("img");
      images.forEach((img) => wrapImageWithCaption(img, true));
    }
  });

  // Re-init GLightbox after dynamic content loads
  if (window.GLightbox) {
    GLightbox({ selector: 'img[data-glightbox]' });
  }
}

function wrapImageWithCaption(img, inGallery = false) {
  if (img.closest("figure")) return; // Skip if already wrapped

  const figure = document.createElement("figure");
  figure.classList.add("figure", inGallery ? "m-1" : "text-center");

  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);

  if (img.alt) {
    const caption = document.createElement("figcaption");
    caption.classList.add("figure-caption", "text-center");
    caption.textContent = img.alt;
    figure.appendChild(caption);
  }

  // Add GLightbox attributes
  img.setAttribute(
    "data-glightbox",
    `title: ${img.alt || ""}${inGallery ? "; group: gallery" : ""}`
  );
}
