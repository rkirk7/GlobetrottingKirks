const pageCache = {};

// -------------------- Load Page --------------------
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

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
const mainContainer = doc.querySelector(".container");
    if (!mainContainer) throw new Error("No #container found in page");

    // Insert the container itself
    content.innerHTML = "";
    content.appendChild(mainContainer.cloneNode(true));

    // Cache the content
    pageCache[page] = content.innerHTML;

    initializePageScripts(page);

    // Lazy-load images: hero images eager, rest lazy
    const imgs = Array.from(content.querySelectorAll("img"));
    imgs.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute(
          "loading",
          img.closest(".hero") ? "eager" : "lazy"
        );
      }
    });

  } catch (err) {
    console.error(err);
    content.innerHTML = `<p>Error loading page.</p>`;
  }
}

// -------------------- Initialize Page Scripts --------------------
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
  if (page === "albums.html" && typeof initAlbums === "function") initAlbums();
  if (page === "blog.html" && typeof initBlog === "function") initBlog();

    initGalleries();
}

// -------------------- Smooth Scroll + Active TOC --------------------
function loadTOC() {
  const postContentEl = document.querySelector("#content .container");
  if (!postContentEl) return;

  const toc = document.getElementById("toc");
  const tocList = document.getElementById("toc-list");
  if (!tocList) return;

  const headings = postContentEl.querySelectorAll("h2, h3");

  if (headings.length > 0) {
    toc.classList.remove("d-none");
    tocList.innerHTML = "";

    headings.forEach((heading, i) => {
      const id = `heading-${i}`;
      heading.id = id;

      const li = document.createElement("li");
      li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });

    // Smooth scroll on click
    tocList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.getElementById(link.getAttribute("href").substring(1));
        if (target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80, // offset for navbar
            behavior: "smooth"
          });
        }
      });
    });

    // Highlight current heading while scrolling
    window.addEventListener("scroll", () => {
      let currentId = "";
      headings.forEach(h => {
        const offsetTop = h.getBoundingClientRect().top;
        if (offsetTop <= 90) { // slightly below navbar
          currentId = h.id;
        }
      });

      tocList.querySelectorAll("a").forEach(link => {
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  } else {
    toc.classList.add("d-none");
  }
}



let imageData = {};

// Load image-data.json
async function loadImageData() {
  try {
    const res = await fetch("image-data.json");
    imageData = await res.json();
  } catch (err) {
    console.error("Failed to load image-data.json", err);
  }
}

// Initialize galleries
async function initGalleries() {
  const galleries = document.querySelectorAll(".gallery");
  if (!galleries.length) return; // exit early if no galleries

  // Fetch the JSON with captions (once)
  let imageData = {};
  try {
    const res = await fetch("image-data.json");
    if (res.ok) imageData = await res.json();
  } catch (err) {
    console.warn("Could not load image captions:", err);
  }

  galleries.forEach((gallery) => {
    const images = gallery.querySelectorAll("img");

    images.forEach((img) => {
      const src = img.getAttribute("src");
      const fileName = src.split("/").pop(); // get "19Safari1.jpeg"
      const caption = imageData[fileName] || "";

      img.setAttribute("data-glightbox", "title:" + caption);
      img.classList.add("glightbox");
    });
  });

  // Initialize or reload GLightbox
  if (typeof GLightbox !== "undefined") {
    if (!window.glightboxInstance) {
      window.glightboxInstance = GLightbox({ selector: ".glightbox" });
    } else {
      window.glightboxInstance.reload();
    }
  }
}

