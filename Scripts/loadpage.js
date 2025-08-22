async function loadPage(page) {
  const res = await fetch(page);
  const content = await res.text();
  const element = document.getElementById("content");
  element.innerHTML = content;

// inside the loadPage(page) success handler, AFTER content.innerHTML = html
if (page === 'albums.html' && typeof initAlbums === 'function') {
  initAlbums();
}

  if (page === 'blog.html') initBlog();
}
