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
  requestAnimationFrame(() => window.scrollTo(0, 0));

  if (pageCache[page]) {
    content.innerHTML = pageCache[page];
    initializePageScripts(page);
    return;
  }

  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Failed to fetch ${page}: ${res.status}`);
    const htmlText = await res.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const mainContainer = doc.getElementById("container");

    if (!mainContainer) {
      content.innerHTML = `<p>Page content missing</p>`;
      return;
    }

    // Insert content without blocking render
    content.innerHTML = "";
    Array.from(mainContainer.childNodes).forEach(node => content.appendChild(node));

    // Lazy-load images and preload above-the-fold images
    const imgs = content.querySelectorAll("img");
    imgs.forEach((img, i) => {
      if (!img.hasAttribute("loading")) {
        img.loading = i < 3 ? "eager" : "lazy"; // first 3 images load immediately
      }
    });

    // Cache the content AFTER inserting
    pageCache[page] = content.innerHTML;

    initializePageScripts(page);
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p>Error loading page.</p>`;
  }
}


function initializePageScripts(page) {
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
  if (page === "albums.html" && typeof initAlbums === "function") initAlbums();
  if (page === "blog.html" && typeof initBlog === "function") initBlog();

  // Load TOC if needed
  loadTOC();
}
