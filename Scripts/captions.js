function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  const images = Array.from(container.querySelectorAll("img"));
  let galleryGroup = [];
  let galleryCount = 0;

  images.forEach((img, i) => {
    if (img.closest("figure")) return; // Skip if already wrapped

    galleryGroup.push(img);

    const nextImg = images[i + 1];
    const isGalleryEnd = !nextImg || nextImg.previousElementSibling !== img;

    if (isGalleryEnd) {
      if (galleryGroup.length > 1) {
        // Multiple images = gallery
        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery", "d-flex", "flex-wrap", "gap-2", "justify-content-center");
        galleryGroup[0].parentNode.insertBefore(galleryDiv, galleryGroup[0]);

        galleryGroup.forEach(gImg => {
          const figure = document.createElement("figure");
          figure.classList.add("figure", "m-1");
          galleryDiv.appendChild(figure);
          figure.appendChild(gImg);

          if (gImg.alt) {
            const caption = document.createElement("figcaption");
            caption.classList.add("figure-caption", "text-center");
            caption.textContent = gImg.alt;
            figure.appendChild(caption);
          }

          gImg.setAttribute("data-glightbox", `title: ${gImg.alt || ""}; group: gallery${galleryCount}`);
        });

        galleryCount++;
      } else {
        // Single image
        const singleImg = galleryGroup[0];
        const figure = document.createElement("figure");
        figure.classList.add("figure", "text-center");
        singleImg.parentNode.insertBefore(figure, singleImg);
        figure.appendChild(singleImg);

        if (singleImg.alt) {
          const caption = document.createElement("figcaption");
          caption.classList.add("figure-caption", "text-center");
          caption.textContent = singleImg.alt;
          figure.appendChild(caption);
        }

        singleImg.setAttribute("data-glightbox", `title: ${singleImg.alt || ""}`);
      }

      galleryGroup = [];
    }
  });

  // Init GLightbox after everything is ready
  if (window.GLightbox) {
    GLightbox({ selector: 'img[data-glightbox]' });
  }
}
