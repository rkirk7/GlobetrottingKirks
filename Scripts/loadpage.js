let imageData = {};

async function loadPage(page) {
  const res = await fetch(page);
  const content = await res.text();
  const element = document.getElementById("content");
  element.innerHTML = content;

// const postContentEl = document.getElementById('#content');
// if (postContentEl) {
//   addCaptionsAndGalleries(postContentEl);
// }

  // Set hero background if present
  const hero = element.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }

  if (page === "albums.html" && typeof initAlbums === "function") {
    initAlbums();
  }

  if (page === "blog.html") initBlog();

  // TOC creation
  // After loading content into #content
  if (
    page === "safaris.html" ||
    page === "hikingadventures.html" ||
    page === "europe.html"
  ) {
    // Give the DOM a tick to render the injected HTML
    setTimeout(() => {
      console.log("trying to create toc");
      createTOCAndReturnLinks();
    }, 0);
  }
}
