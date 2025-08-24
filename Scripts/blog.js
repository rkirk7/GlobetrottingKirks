// ===========================
// MARKED RENDERER FOR HEADINGS
// ===========================
const renderer = new marked.Renderer();

let currentPostIndex = 0; // Will be set for each post

renderer.heading = function (text, level, raw) {
  const headingText = raw || String(text);
  const slug = headingText.toLowerCase().replace(/[^\w]+/g, '-');
  const id = `post${currentPostIndex}-${slug}`;
  return `<h${level} id="${id}">${text}</h${level}>`;
};

marked.setOptions({
  renderer,
  mangle: false,
  headerIds: true
});

// ===========================
// BLOG INIT FUNCTION
// ===========================
async function initBlog() {
  const posts = [
    "2025-08-23-churchill.md",
    "2025-08-14-panda-monium-close-encounters-in-chengdu-and-wolong-china.md",
    "2025-06-03-exploring-antarctica-and-the-arctic-how-did-two-floridians-end-up-at-both-polar-regions-in-one-year-and-what-did-they-discover.md",
    "2025-01-29-antarctica-calls-and-we-must-go.md",
    "2024-09-12-in-search-of-polar-bears-in-the-arctic.md",
    "2023-07-20-come-safari-with-us.md",
    "2023-02-25-100-miles-in-10-days-the-nearly-perfect-patagonia-hiking-trip.md",
    "2022-10-20-paradise-found-french-polynesia.md",
    "2022-06-13-enchanting-galapagos-a-wildlife-wonderland.md",
    "2021-08-26-my-heritage-journey-to-hong-kong-and-china.md",
    "2021-08-22-western-parks-adventure-top-highlights.md",
    "2020-02-21-new-zealand-adrenaline-rush-2-death-defying-weeks.md",
    "2019-11-05-which-alp-is-the-coolest.md",
    "2019-11-04-viva-la-via-ferrata.md",
    "2019-11-04-around-iceland-in-10-days-top-highlights.md",
    "2019-04-09-3-perfect-weeks-in-south-africa.md",
    "2018-12-10-is-a-river-cruise-for-you-take-a-virtual-ride-on-the-rhein-main-and-danube-rivers-on-uniworld.md",
    "2015-10-03-reunion-magic-returning-to-goudy-and-lane.md",
    "2015-09-28-reunion-part-one.md",
    "2015-09-16-retirement-milestone-3-months-and-counting.md",
    "2015-09-14-yes-the-world-needs-another-website-mine.md",
    "2015-08-29-hello-world-2.md"
  ];

  const container = document.getElementById("blog-container");
  const tocList = document.getElementById("toc-list");
  const tocListMobile = document.getElementById("toc-list-mobile");
  if (!container || !tocList || !tocListMobile) return;

  // --- Extract main title from markdown
  function extractTitle(mdContent) {
    const lines = mdContent.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("# ")) return line.replace(/^# /, "").trim();
    }
    return null;
  }

  // --- Load all posts
  const postsData = await Promise.all(
    posts.map(async post => {
      let text = await fetch(`blog-posts/${post}`).then(res => res.text());
      text = text.replace(/^---[\s\S]*?---/, '').trim(); // remove YAML frontmatter
      return { filename: post, content: text };
    })
  );

  // Sort newest first
  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  // --- Load image metadata ---
  const imageMeta = await fetch('image-data.json').then(res => res.json());

  // --- Render each post
  postsData.forEach((postData, index) => {
    currentPostIndex = index;
    const postId = `post${index}`;
    const postTitle = extractTitle(postData.content) || postData.filename;

    // Prefix internal Markdown links
    const prefixedMarkdown = postData.content.replace(
      /\[([^\]]+)\]\(#([^\)]+)\)/g,
      (_, text, id) => `[${text}](#${postId}-${id})`
    );

    // Convert markdown to HTML
    let html = marked.parse(prefixedMarkdown);

    // --- Apply alt and captions for gallery images ---
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll('div.gallery').forEach(gallery => {
      gallery.querySelectorAll('img').forEach(img => {
        const filename = img.getAttribute('src').split('/').pop();
        if (imageMeta[filename]) {
          img.setAttribute('alt', imageMeta[filename]);
          let figcap = img.nextElementSibling;
          if (!figcap || figcap.tagName.toLowerCase() !== 'figcaption') {
            figcap = document.createElement('figcaption');
            img.after(figcap);
          }
          figcap.textContent = imageMeta[filename];
        }
      });
    });

    html = tempDiv.innerHTML;

    // --- Create post card ---
    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-3");
    postDiv.id = postId;

    postDiv.innerHTML = `
      <div class="card-header bg-primary text-white"
           style="cursor:pointer;"
           data-bs-toggle="collapse"
           data-bs-target="#collapse${index}"
           aria-expanded="true">
        <span class="post-title d-none">${postTitle}</span>
      </div>
      <div id="collapse${index}" class="collapse show">
        <div class="card-body blog-post-content">${html}</div>
        <div class="card-footer">
          <button class="btn btn-outline-primary btn-sm share-btn" data-post="${postId}">Share</button>
        </div>
      </div>
    `;

    container.appendChild(postDiv);

    const collapseEl = postDiv.querySelector(`#collapse${index}`);
    const titleEl = postDiv.querySelector(".post-title");

    collapseEl.addEventListener("show.bs.collapse", () => titleEl.classList.add("d-none"));
    collapseEl.addEventListener("hide.bs.collapse", () => titleEl.classList.remove("d-none"));

    // --- Add TOC links ---
    const addTocLink = (ul) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${postId}">${postTitle}</a>`;
      ul.appendChild(li);

      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const offcanvasEl = document.getElementById("offcanvasToc");
        const scrollToPost = () =>
          document.getElementById(postId).scrollIntoView({ behavior: "smooth", block: "start" });
        if (offcanvasEl && offcanvasEl.classList.contains("show")) {
          bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
          setTimeout(scrollToPost, 300);
        } else {
          scrollToPost();
        }
      });
    };

    addTocLink(tocList);
    addTocLink(tocListMobile);

    // --- Smooth scrolling for internal links inside post ---
    const postContent = postDiv.querySelector('.blog-post-content');
    postContent.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const collapseParent = targetEl.closest('.collapse');
        if (collapseParent && !collapseParent.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseParent);
          collapseParent.addEventListener('shown.bs.collapse', () => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, { once: true });
          bsCollapse.show();
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        history.pushState(null, '', `#${targetId}`);
      });
    });

    // --- Share button ---
// --- Share button ---
postDiv.querySelector(".share-btn").addEventListener("click", () => {
  // Get current URL without any hash
  const baseUrl = window.location.origin + window.location.pathname;
  const postUrl = `${baseUrl}#${postId}`;

  if (navigator.share) {
    // Native share (mobile-friendly)
    navigator.share({
      title: postTitle,
      url: postUrl
    }).catch(err => console.error("Share failed:", err));
  } else {
    // Fallback: copy the exact post link to clipboard
    navigator.clipboard.writeText(postUrl).then(() => {
      alert(`Post link copied to clipboard!\n${postUrl}`);
    }).catch(err => console.error("Clipboard write failed:", err));
  }

  // Optionally, update the URL in the address bar
  history.replaceState(null, '', postUrl);
});


  });

  // --- Scroll to hash on page load ---
  if (window.location.hash) {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      const collapseParent = targetEl.closest('.collapse');
      if (collapseParent && !collapseParent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseParent);
        collapseParent.addEventListener('shown.bs.collapse', () => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, { once: true });
        bsCollapse.show();
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", initBlog);
