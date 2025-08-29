async function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  const images = Array.from(container.querySelectorAll("img"));

  // Process images in small batches to avoid blocking the main thread
  const batchSize = 10;

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    batch.forEach(img => wrapImageWithCaption(img));
    
    // Yield to the browser to update rendering
    await new Promise(requestAnimationFrame);
  }

  // Initialize GLightbox once after all images are processed
  if (window.GLightbox) {
    GLightbox({ selector: 'img[data-glightbox]' });
  }
}

function wrapImageWithCaption(img, inGallery = false) {
  if (img.closest("figure")) return;

  const figure = document.createElement("figure");
  figure.classList.add("figure", inGallery ? "m-1" : "text-center");

  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);

  const srcParts = img.src.split("/");
  const filename = srcParts[srcParts.length - 1];

  const captionText = window.imageData?.[filename] || img.alt || "";

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

  // Add lazy loading if not already present
  if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
}
