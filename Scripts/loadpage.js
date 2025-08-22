async function loadPage(page) {
  const res = await fetch(page);
  const content = await res.text();
  const element = document.getElementById("content");
  element.innerHTML = content;

  // Page-specific initialization
  if (page === "albums.html") {
    initAlbums();
  } else if (page === "blog.html") {
    initBlog();
  }
}
