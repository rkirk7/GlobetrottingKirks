function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  // Find all images inside #content
  const images = Array.from(container.querySelectorAll("img"));

  // Group images that are siblings (simple gallery detection)
  let galleryGroup = [];
  images.forEach((img, i) => {
    // Skip if already in a figure
    if (img.parentElement.tagName.toLowerCase() === "figure") return;

    galleryGroup.push(img);

    // Check if next image is not immediately after this one or last image
    const nextImg = images[i + 1];
    if (!nextImg || nextImg.previousElementSibling !== img) {
      if (galleryGroup.length > 1) {
        // Wrap as gallery
        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery", "d-flex", "flex-wrap", "gap-2", "justify-content-center");

        galleryGroup.forEach((gImg, index) => {
          const figure = document.createElement("figure");
          figure.classList.add("figure", "m-1");
          gImg.parentNode.insertBefore(galleryDiv, gImg);
          galleryDiv.appendChild(figure);
          figure.appendChild(gImg);

          // Add figcaption if alt exists
          if (gImg.alt) {
            const caption = document.createElement("figcaption");
            caption.classList.add("figure-caption", "text-center");
            caption.textContent = gImg.alt;
            figure.appendChild(caption);
          }

          // Add GLightbox attribute
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

        // GLightbox for single image
        singleImg.setAttribute("data-glightbox", `title: ${singleImg.alt || ""}`);
      }

      galleryGroup = [];
    }
  });

  // Initialize GLightbox (works for all images added dynamically)
  if (window.GLightbox) {
    GLightbox({ selector: 'img[data-glightbox]' });
  }
}
