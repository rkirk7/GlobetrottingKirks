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
    if (!heading.id) heading.id = `heading-${i}`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(heading.id).scrollIntoView({ behavior: "smooth" });
      if (window.innerWidth < 768) tocList.classList.add("d-none"); // auto-hide on mobile
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Toggle button for mobile
  const toggleBtn = document.getElementById("toc-toggle");
  toggleBtn.addEventListener("click", () => {
    tocList.classList.toggle("d-none");
  });

  // Highlight current section while scrolling
  if (!tocScrollListenerAdded) {
    window.addEventListener("scroll", () => {
      let current = headings[0];
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) current = heading;
      });

      tocList.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
      const activeLink = tocList.querySelector(`a[href="#${current.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    });
    tocScrollListenerAdded = true;
  }
}

// Run after page content loads
document.addEventListener("DOMContentLoaded", loadTOC);




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

