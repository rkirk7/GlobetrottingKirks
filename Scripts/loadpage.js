const pageCache = {};

async function loadTOC() {
  const postContentEl = document.querySelector("#content .container");
  if (!postContentEl) return;

  const tocList = document.getElementById("toc-list");
  const headings = postContentEl.querySelectorAll("h2, h3");

  if (headings.length > 0 && tocList) {
    document.getElementById("toc").classList.remove("d-none");
    tocList.innerHTML = "";

    headings.forEach((heading, i) => {
      const id = `heading-${i}`;
      heading.id = id;

      const li = document.createElement("li");
      li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });
  } else if (tocList) {
    document.getElementById("toc").classList.add("d-none");
  }
}

async function loadPage(page) {
  const content = document.getElementById("content");

  try {
    if (pageCache[page]) {
      content.innerHTML = pageCache[page];
      initializePageScripts();
      requestAnimationFrame(() => window.scrollTo(0, 0));
      return;
    }

    const res = await fetch(page);
    if (!res.ok) throw new Error(`Failed to fetch ${page}: ${res.status}`);

    const html = await res.text();
    pageCache[page] = html;

    content.innerHTML = html;

    // Lazy-load images
    content.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });

    initializePageScripts();

    requestAnimationFrame(() => window.scrollTo(0, 0));
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p>Error loading page.</p>`;
  }
}

function initializePageScripts() {
  const content = document.getElementById("content");

  // Hero background
  const hero = content.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }

  // GLightbox (for galleries)
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".glightbox" });
  }

  // Page-specific initializers
  if (document.getElementById("albums") && typeof initAlbums === "function") {
    initAlbums();
  }

  if (document.getElementById("blog") && typeof initBlog === "function") {
    initBlog();
  }

  // Load TOC if needed
  loadTOC();
}
