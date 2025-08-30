async function loadTOC() {
  const postContentEl = document.getElementById('container'); // safer selector

  if (!postContentEl) return; // stop if container not found

  const tocList = document.getElementById('toc-list');
  const headings = postContentEl.querySelectorAll('h2, h3');

  if (headings.length > 0 && tocList) {
    document.getElementById('toc').classList.remove('d-none');
    tocList.innerHTML = '';

    headings.forEach((heading, i) => {
      const id = `heading-${i}`;
      heading.id = id;

      const li = document.createElement('li');
      li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });
  }
}

async function loadPage(page) {
  const res = await fetch(page);
  const content = await res.text();
  const element = document.getElementById("content");
  element.innerHTML = content;

  // Set hero background if present
  const hero = element.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }

  if (page === "albums.html" && typeof initAlbums === "function") {
    initAlbums();
  }

  if (page === "blog.html") initBlog();

  loadTOC();
}
