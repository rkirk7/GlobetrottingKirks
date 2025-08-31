async function loadTOC() {
  const postContentEl = document.getElementById("container"); // safer selector

  if (!postContentEl) return; // stop if container not found

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
  }
}

const pageCache = {};

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

    const html = await res.text();
    pageCache[page] = html; // cache for future visits

    content.innerHTML = html;

    // Lazy-load images inside loaded content
    const imgs = content.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    });

    initializePageScripts(page);
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p>Error loading page.</p>`;
  }
}

// Optional: initialize scripts specific to a page
function initializePageScripts(page) {
  // Set hero background if present
  const hero = element.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;

    // Example: run GLightbox only on pages that have galleries
      if (typeof GLightbox !== "undefined") {
        GLightbox({ selector: "glightbox" });
      }

    if (page === "albums.html" && typeof initAlbums === "function") {
      initAlbums();
    }

    if (page === "blog.html") initBlog();

    const postContentEl = document.getElementById("container");

    if (postContentEl) {
      loadTOC();
    }
  }
}
