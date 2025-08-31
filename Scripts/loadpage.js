const pageCache = {};

// -------------------- Load Page --------------------
async function loadPage(page) {
   cancelPendingImages();
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

    mainContainer.querySelectorAll("img").forEach(img => {
  if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
});
    content.innerHTML = "";
    content.appendChild(mainContainer.cloneNode(true));

    // Cache the content
    pageCache[page] = content.innerHTML;

    initializePageScripts(page);

    // Lazy-load images: hero images eager, rest lazy
    const imgs = Array.from(content.querySelectorAll("img"));
    imgs.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", img.closest(".hero") ? "eager" : "lazy");
      }
    });
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p>Error loading page.</p>`;
  }
}

// -------------------- Initialize Page Scripts --------------------
async function initializePageScripts(page) {
  const content = document.getElementById("content");

  // Hero background
  const hero = content.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }

  // Table of Contents: run after the DOM has fully updated
  requestAnimationFrame(() => loadTOC());

  // Process images and galleries
  await processImages(content);

  // Page-specific scripts
  if (page === "albums.html" && typeof initAlbums === "function") initAlbums();
  if (page === "blog.html" && typeof initBlog === "function") initBlog();
}



// -------------------- Smooth Scroll + Active TOC --------------------

let tocScrollListenerAdded = false;

function loadTOC() {
  const postContentEl = document.querySelector("#content .container");
  if (!postContentEl) return;

  const toc = document.getElementById("toc");
  const tocList = document.getElementById("toc-list");
  if (!toc || !tocList) return;

  const headings = postContentEl.querySelectorAll("h2, h3");
  if (headings.length === 0) {
    toc.classList.add("d-none");
    return;
  }

  toc.classList.remove("d-none");
  tocList.innerHTML = "";

  headings.forEach((heading, i) => {
    const id = `heading-${i}`;
    heading.id = id;

    const li = document.createElement("li");
    li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
    tocList.appendChild(li);
  });

  const tocToggle = document.getElementById("toc-toggle");
  if (tocToggle) {
    tocToggle.addEventListener("click", () => {
      tocList.classList.toggle("show");
    });
  }

  // Smooth scroll
  tocList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute("href").substring(1));
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }

      if (window.innerWidth < 992) tocList.classList.remove("show");
    });
  });

  // Highlight headings while scrolling (only attach once)
  if (!tocScrollListenerAdded) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let currentId = "";
          headings.forEach(h => {
            if (h.getBoundingClientRect().top <= 90) currentId = h.id;
          });

          tocList.querySelectorAll("a").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
          });
          ticking = false;
        });
        ticking = true;
      }
    });
    tocScrollListenerAdded = true;
  }
}



function cancelPendingImages() {
  document.querySelectorAll("#content img").forEach(img => {
    img.src = ""; // stops download
  });
}

async function processImages(container) {
  if (!container) return;

  // Load image-data.json once
  if (!window._imageData) {
    try {
      const res = await fetch("image-data.json");
      window._imageData = res.ok ? await res.json() : {};
    } catch (err) {
      console.warn("Could not load image captions:", err);
      window._imageData = {};
    }
  }

  const images = container.querySelectorAll("img");
  images.forEach(img => {
    const src = img.getAttribute("src");
    const fileName = src.split("/").pop();
    const caption = window._imageData[fileName] || img.alt || "";

    // Wrap in <figure> if not already
    if (!img.closest("figure")) {
      const figure = document.createElement("figure");
      figure.classList.add("figure", "text-center");
      img.parentNode.insertBefore(figure, img);
      figure.appendChild(img);
    }

    // Add <figcaption>
    if (caption && !img.nextElementSibling?.classList.contains('figure-caption')) {
      const figcap = document.createElement("figcaption");
      figcap.classList.add("figure-caption", "text-center");
      figcap.textContent = caption;
      img.parentNode.appendChild(figcap);
    }

    // GLightbox setup
    img.setAttribute("data-glightbox", "title:" + caption);
    img.classList.add("glightbox");
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
  });

  // Initialize/reload GLightbox
  if (typeof GLightbox !== "undefined") {
    if (!window.glightboxInstance) {
      window.glightboxInstance = GLightbox({ selector: ".glightbox" });
    } else {
      window.glightboxInstance.reload();
    }
  }
}

