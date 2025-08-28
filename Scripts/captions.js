let imageData = {};

async function loadImageData() {
  try {
    const res = await fetch("./image-data.json");
    if (!res.ok) throw new Error(`Failed to load image-data.json`);
    imageData = await res.json();
  } catch (err) {
    console.error("Error loading image data:", err);
  }
}

function addCaptionsAndGalleries() {
  const container = document.getElementById("content");
  if (!container) return;

  const galleries = container.querySelectorAll(".gallery, img");

  galleries.forEach((gallery) => {
    if (gallery.tagName === "IMG") {
      wrapImageWithCaption(gallery);
    } else {
      const images = gallery.querySelectorAll("img");
      images.forEach((img) => wrapImageWithCaption(img, true));
    }
  });

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

  // Extract just the filename from the src
  const srcParts = img.src.split("/");
  const filename = srcParts[srcParts.length - 1];

  // Get caption from JSON; fallback to alt text
  const captionText = imageData[filename] || img.alt || "";

  if (captionText) {
    const caption = document.createElement("figcaption");
    caption.classList.add("figure-caption", "text-center");
    caption.textContent = captionText;
    figure.appendChild(caption);
  }

  // Add GLightbox attributes
  img.setAttribute(
    "data-glightbox",
    `title: ${captionText}${inGallery ? "; group: gallery" : ""}`
  );
}

