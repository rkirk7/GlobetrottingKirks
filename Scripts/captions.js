
async function fetchImageData() {
  const response = await fetch('../image-data.json');
  return response.json();  // expect format: { "Churchill29.jpeg": "This bear watched our plane fly by", ... }
}

async function addCaptionToImage(img, imageData) {
  const filename = img.getAttribute('src').split('/').pop();
  const captionText = imageData[filename];

  if (!captionText) return;

  // Check if image is already inside a <figure>
  let figure = img.closest('figure');
  if (!figure) {
    // Wrap the image in a <figure>
    figure = document.createElement('figure');
    figure.classList.add('img-wrapper'); // keeps your overlay effect if you use it
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);
  }

  // Prevent adding duplicate <figcaption>
  if (!figure.querySelector('figcaption')) {
    const figcaption = document.createElement('figcaption');
    figcaption.classList.add('caption');
    figcaption.innerText = captionText;
    figure.appendChild(figcaption);
  }
}

async function setupGalleryCaptions() {
  const imageData = await fetchImageData();

  const blogContainer = document.querySelector('.blog-post-content');
  if (!blogContainer) return;

  // Add captions to all existing images
  blogContainer.querySelectorAll('img').forEach(img => addCaptionToImage(img, imageData));

  // Observe dynamically added images (SPA or async loads)
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG') {
            addCaptionToImage(node, imageData);
          } else {
            node.querySelectorAll && node.querySelectorAll('img').forEach(img => addCaptionToImage(img, imageData));
          }
        }
      });
    });
  });

  observer.observe(blogContainer, { childList: true, subtree: true });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setupGalleryCaptions);

