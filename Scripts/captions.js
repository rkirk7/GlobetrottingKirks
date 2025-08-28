function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  const images = Array.from(container.querySelectorAll("img"));
  let galleryGroup = [];

  images.forEach((img, i) => {
    // Skip if already wrapped
    if (img.closest("figure") || img.closest(".gallery")) return;

    galleryGroup.push(img);

    const nextImg = images[i + 1];
    const nextIsAdjacent = nextImg && nextImg.previousElementSibling === img;

    // End of a group if next image is not adjacent or last image
    if (!nextIsAdjacent) {
      if (galleryGroup.length > 1) {
        // Wrap group in gallery
        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery", "d-flex", "flex-wrap", "gap-2", "justify-content-center");

        galleryGroup.forEach((gImg) => {
          const figure = document.createElement("figure");
          figure.classList.add("figure", "m-1");
          gImg.parentNode.insertBefore(galleryDiv, gImg);
          galleryDiv.appendChild(figure);
          figure.appendChild(gImg);

          if (gImg.alt) {
            const caption = document.createElement("figcaption");
            caption.classList.add("figure-caption", "text-center");
            caption.textContent = gImg.alt;
            figure.appendChild(caption);
          }

          // GLightbox grouping
          gImg.setAttribute("data-glightbox", `title: ${gImg.alt || ""}; group: gallery${i}`);
        });
      } else {
        // Single image
        const singleImg = galleryGroup[0];
        const figure = document.createElement("figure");
        figure.classList.add("figure", "text-center");
        singleImg.parentNode.insertBefore(figure, singleImg);
        figure.appendChild(singleImg);

        if (singleImg.alt) {
          const caption = document.createElement("figcaption");
          caption.classList.add("figure-caption");
          caption.textContent = singleImg.alt;
          figure.appendChild(caption);
        }

        singleImg.setAttribute("data-glightbox", `title: ${singleImg.alt || ""}`);
      }

      galleryGroup = [];
    }
  });

  // Re-init GLightbox after dynamic content loads
  if (window.GLightbox) {
    GLightbox({ selector: 'img[data-glightbox]' });
  }
}
