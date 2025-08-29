async function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  // Load image data inside this function
  let imageData = {};
  try {
    const res = await fetch("./image-data.json");
    if (res.ok) {
      imageData = await res.json();
    }
  } catch (err) {
    console.warn("Failed to load image data", err);
  }

  const images = Array.from(container.querySelectorAll("img"));
  const batchSize = 20; // process in slightly bigger batches

  const processBatch = (batch) => {
    batch.forEach(img => wrapImageWithCaption(img, imageData));
  };

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    processBatch(batch);

    // Yield to the browser to paint
    if (window.requestIdleCallback) {
      await new Promise(resolve => requestIdleCallback(resolve));
    } else {
      await new Promise(requestAnimationFrame);
    }
  }

  // Initialize GLightbox once at the end
  if (window.GLightbox) {
    if (!window.gLightboxInstance) {
      window.gLightboxInstance = GLightbox({ selector: 'img[data-glightbox]' });
    }
  }
}

// Pass imageData to the caption wrapper
function wrapImageWithCaption(img, imageData, inGallery = false) {
  if (img.closest("figure")) return;

  const figure = document.createElement("figure");
  figure.classList.add("figure", inGallery ? "m-1" : "text-center", "mb-3");

  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);

  const filename = img.src.split("/").pop();
  const captionText = imageData?.[filename] || img.alt || filename;

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

  if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
}
