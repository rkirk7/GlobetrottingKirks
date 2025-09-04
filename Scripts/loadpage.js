const pageCache = {};
let currentLoadId = 0;

// -------------------- Load Page --------------------
async function loadPage(page) {
  currentLoadId++; // new page load
  const loadId = currentLoadId; // capture this load's ID
  cancelPendingImages();

  const content = document.getElementById("content");

  requestAnimationFrame(() => window.scrollTo(0, 0));

  if (pageCache[page]) {
    if (loadId !== currentLoadId) return; // page load canceled
    content.innerHTML = pageCache[page];
    initializePageScripts(page, loadId);
    return;
  }

  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Failed to fetch ${page}: ${res.status}`);
    const htmlText = await res.text();
    if (loadId !== currentLoadId) return; // canceled mid-fetch

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const mainContainer = doc.querySelector(".container");
    if (!mainContainer) throw new Error("No .container found in page");

    mainContainer.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });

    if (loadId !== currentLoadId) return; // canceled before render
    content.innerHTML = "";
    content.appendChild(mainContainer.cloneNode(true));

    pageCache[page] = content.innerHTML;

    if (loadId !== currentLoadId) return;
    initializePageScripts(page, loadId);
  } catch (err) {
    if (loadId === currentLoadId) {
      console.error(err);
      content.innerHTML = `<p>Error loading page.</p>`;
    }
  }
}

// -------------------- Initialize Page Scripts --------------------
async function initializePageScripts(page, loadId) {
  const content = document.getElementById("content");
  if (loadId !== currentLoadId) return; // canceled

  const hero = content.querySelector(".hero");
  if (hero && hero.dataset.hero) {
    hero.style.backgroundImage = `url('${hero.dataset.hero}')`;
  }

  processMarkdownGalleries(content);

  requestAnimationFrame(() => {
    if (loadId === currentLoadId && document.getElementById("toc-list")) {
      loadTOC();
    }
  });

  await processImages(content, loadId);

  if (loadId !== currentLoadId) return;
  if (page === "albums.html" && typeof initAlbums === "function") initAlbums();
  if (page === "blog.html" && typeof initBlog === "function") initBlog();
  if (page === "Travel/europe.html" && typeof initCountryDropdown === "function") {
    initCountryDropdown();
  }
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

  // Add "Top" button at the beginning
  const topLi = document.createElement("li");
  const topA = document.createElement("a");
  topA.href = "#";
  topA.textContent = "Top";
  topA.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  topLi.appendChild(topA);
  tocList.appendChild(topLi);

  headings.forEach((heading, i) => {
    if (!heading.id) heading.id = `heading-${i}`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToHeadingWithOffset(document.getElementById(heading.id));
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

      tocList
        .querySelectorAll("a")
        .forEach((a) => a.classList.remove("active"));
      const activeLink = tocList.querySelector(`a[href="#${current.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    });
    tocScrollListenerAdded = true;
  }
}

// Run after page content loads
document.addEventListener("DOMContentLoaded", loadTOC);

function cancelPendingImages() {
  document.querySelectorAll("#content img").forEach((img) => {
    img.removeAttribute("src"); // safer than setting src=""
  });
}

async function processImages(container, loadId) {
  if (!container || loadId !== currentLoadId) return;

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

  const frag = document.createDocumentFragment();

  for (const img of images) {
    if (loadId !== currentLoadId) return; // stop mid-loop
    if (
      img.classList.contains("card-img-top") ||
      img.classList.contains("special-img")
    )
      continue; // skip special card images

    const src = img.getAttribute("src");
    const fileName = src?.split("/").pop();
    const caption = window._imageData[fileName] || img.alt || "";

    if (!img.closest("figure")) {
      const figure = document.createElement("figure");
      figure.classList.add("figure", "text-center");
      img.parentNode.insertBefore(figure, img);
      figure.appendChild(img);
    }

    if (
      caption &&
      !img.nextElementSibling?.classList.contains("figure-caption")
    ) {
      const figcap = document.createElement("figcaption");
      figcap.classList.add("figure-caption", "text-center");
      figcap.textContent = caption;
      img.parentNode.appendChild(figcap);
    }

    img.setAttribute("data-glightbox", "title:" + caption);
    img.classList.add("glightbox");
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
  }

  // Append all at once
  container.appendChild(frag);

  if (loadId === currentLoadId && typeof GLightbox !== "undefined") {
    if (!window.glightboxInstance) {
      window.glightboxInstance = GLightbox({ selector: ".glightbox" });
    } else {
      window.glightboxInstance.reload();
    }
  }
}

function scrollToHeadingWithOffset(heading) {
  const navbarHeight = document.querySelector(".navbar").offsetHeight;
  const elementTop = heading.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: elementTop - navbarHeight - 10, // 10px extra padding
    behavior: "smooth",
  });
}

function processMarkdownGalleries(container) {
  if (!container) return;

  // Find all galleries
  const galleries = container.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {
    // Unwrap images from <p> if Markdown added it
    gallery.querySelectorAll("p").forEach((p) => {
      const img = p.querySelector("img");
      if (img) p.replaceWith(img);
    });

    // Wrap images in <figure> and add captions
    gallery.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      const fileName = src?.split("/").pop();
      const caption = window._imageData?.[fileName] || img.alt || "";

      // Wrap in figure if not already
      if (!img.closest("figure")) {
        const figure = document.createElement("figure");
        figure.classList.add("figure", "text-center");
        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
      }

      // Add figcaption if caption exists
      if (
        caption &&
        !img.nextElementSibling?.classList.contains("figure-caption")
      ) {
        const figcap = document.createElement("figcaption");
        figcap.classList.add("figure-caption", "text-center");
        figcap.textContent = caption;
        img.parentNode.appendChild(figcap);
      }

      // Add GLightbox attributes
      img.setAttribute("data-glightbox", "title:" + caption);
      img.classList.add("glightbox");
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });

    // Initialize or reload GLightbox
    if (typeof GLightbox !== "undefined") {
      if (!window.glightboxInstance) {
        window.glightboxInstance = GLightbox({ selector: ".glightbox" });
      } else {
        window.glightboxInstance.reload();
      }
    }
  });
}


// dropdown.js (load this once in index.html BEFORE loadpage.js)

function initCountryDropdown() {

    console.log('trying to do dropdown');
  const container = document.querySelector('#content .container'); // FIXED
  //   if (!container) return;

  const dropdown = document.getElementById('countryDropdown');
  const searchInput = document.getElementById('searchInput');
  if (!dropdown || !searchInput) return;

  // clear previous list (safe re-init)
  dropdown.innerHTML = '';

  const headings = container.querySelectorAll('h2');
  if (!headings.length) return;

  let currentIndex = -1;

  // Populate dropdown with headings
  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = h.innerText.trim();
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dropdown.style.display = 'none';
      searchInput.value = '';
    });
    li.appendChild(a);
    dropdown.appendChild(li);
  });

  // Show dropdown initially
  dropdown.style.display = 'block';

  // Filter dropdown on input
  searchInput.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const items = dropdown.querySelectorAll('li');
    let anyVisible = false;
    currentIndex = -1;

    items.forEach(li => {
      const a = li.querySelector('a');
      const match = a.textContent.toLowerCase().includes(filter);
      li.style.display = match ? 'block' : 'none';
      if (match) anyVisible = true;
      a.classList.remove('active');
    });

    dropdown.style.display = anyVisible ? 'block' : 'none';
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', function (e) {
    const visibleItems = Array.from(dropdown.querySelectorAll('a'))
      .filter(a => a.parentElement.style.display !== 'none');
    if (!visibleItems.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % visibleItems.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0) visibleItems[currentIndex].click();
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }

    visibleItems.forEach((a, idx) =>
      a.classList.toggle('active', idx === currentIndex)
    );
  });

  // Click outside closes dropdown
  document.addEventListener('click', function (e) {
    if (e.target !== searchInput && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}
