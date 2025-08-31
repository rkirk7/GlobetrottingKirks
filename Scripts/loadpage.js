const pageCache = {};

async function loadPage(page) {
  const content = document.getElementById("content");

  // Scroll to top immediately
  requestAnimationFrame(() => window.scrollTo(0, 0));

  // Use cache if available
  if (pageCache[page]) {
    content.innerHTML = pageCache[page];
    initializePageScripts(page);
    return;
  }

  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Failed to fetch ${page}: ${res.status}`);
    const htmlText = await res.text();

    // Parse only the inner content of #container
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const mainContent = doc.querySelector("#container")?.innerHTML || "";

    // Insert content and cache it
    content.innerHTML = mainContent;
    pageCache[page] = mainContent;

    // Initialize scripts immediately
    initializePageScripts(page);

     // Lazy-load images, but eager-load first 2
    const imgs = Array.from(content.querySelectorAll("img"));
    imgs.forEach((img, index) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", index < 2 ? "eager" : "lazy");
      }
    });

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

  // Table of Contents
  loadTOC();

  // GLightbox for galleries
  if (typeof GLightbox !== "undefined") {
    if (!window.glightboxInstance) {
      window.glightboxInstance = GLightbox({ selector: ".glightbox" });
    } else {
      window.glightboxInstance.reload();
    }
  }

  // Page-specific scripts
  // Page-specific initializers
  if (page === "albums.html" && typeof initAlbums === "function") initAlbums();
  if (page === "blog.html" && typeof initBlog === "function") initBlog();

}

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
