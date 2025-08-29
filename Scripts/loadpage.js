async function loadPage(page) {
  const res = await fetch(page);
  const content = await res.text();
  const element = document.getElementById("content");
  element.innerHTML = content;

  await loadImageData();   // Load the JSON once
  addCaptionsAndGalleries();

    // Set hero background if present
  const hero = element.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }


  if (page === 'albums.html' && typeof initAlbums === 'function') {
    initAlbums();
  }

  if (page === 'blog.html') initBlog();

//   // TOC creation
// if (page === 'safaris.html' || page === 'hikingadventures.html' || page === 'europe.html') {
//   requestAnimationFrame(() => {
//     requestAnimationFrame(() => {
//       createTOCAndReturnLinks();
//     });
//   });
// }

  
  loadMailchimpPopup();
}
