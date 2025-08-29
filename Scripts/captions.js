function addCaptionsAndGalleries(container) {
  const images = Array.from(container.querySelectorAll("img"));

  images.forEach(img => wrapImageWithCaption(img));

  // Initialize GLightbox once if needed
  if (window.GLightbox && !window.gLightboxInstance) {
    window.gLightboxInstance = GLightbox({ selector: 'img[data-glightbox]' });
  }
}


// Pass imageData to the caption wrapper
function wrapImageWithCaption(img, inGallery = false) {
  if (img.closest("figure")) return;

  // Ensure lazy loading
  if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");

  const figure = document.createElement("figure");
  figure.classList.add("figure", inGallery ? "m-1" : "text-center");
  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);

  const captionText = img.alt || "";
  if (captionText) {
    const caption = document.createElement("figcaption");
    caption.classList.add("figure-caption", "text-center");
    caption.textContent = captionText;
    figure.appendChild(caption);
  }

  img.setAttribute(
    "data-glightbox",
    `title: ${captionText}${inGallery ? "; group: gallery" : ""}`
  );
}
