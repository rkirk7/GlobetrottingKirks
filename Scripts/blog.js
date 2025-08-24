marked.setOptions({
  mangle: false,
  headerIds: false // we'll handle IDs manually
});

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

  function sanitizeId(text) {
    return text.trim()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }

  const postsData = await Promise.all(
    posts.map(async post => {
      const response = await fetch(`blog-posts/${post}`);
      const text = await response.text();
      const clean = text.replace(/^---[\s\S]*?---/, '').trim();
      return { filename: post, content: clean };
    })
  );

  // Sort newest first
  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    const postId = `post${index}`;
    let firstHeaderId = null;
    let firstHeaderText = null;

    // Custom renderer to add unique IDs to headings
    const renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
      const id = `${postId}-${sanitizeId(text)}`;
      if (level === 1 && !firstHeaderId) {
        firstHeaderId = id;
        firstHeaderText = text; // use actual H1 text for TOC
      }
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    // Prefix internal links so they match generated IDs
    const prefixedMarkdown = postData.content.replace(/\[([^\]]+)\]\(\s*#([^)]+)\s*\)/g, (_, text, id) => {
      return `[${text}](#${postId}-${sanitizeId(id)})`;
    });

    // Convert Markdown → HTML
    const html = marked.parse(prefixedMarkdown, { renderer });

    // Create post card
    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-3");
    postDiv.id = postId;

    postDiv.innerHTML = `
      <div class="card-header bg-primary text-white" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true">
        <span class="post-title d-none">${firstHeaderText || "Untitled Post"}</span>
      </div>
      <div id="collapse${index}" class="collapse show">
        <div class="card-body blog-post-content">${html}</div>
      </div>
    `;

    container.appendChild(postDiv);

    const collapseEl = postDiv.querySelector(`#collapse${index}`);
    const titleEl = postDiv.querySelector(".post-title");

    collapseEl.addEventListener("show.bs.collapse", () => titleEl.classList.add("d-none"));
    collapseEl.addEventListener("hide.bs.collapse", () => titleEl.classList.remove("d-none"));

    // TOC links (desktop + mobile)
    const addTocLink = (ul) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${firstHeaderId}">${firstHeaderText || "Untitled Post"}</a>`;
      ul.appendChild(li);

      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const offcanvasEl = document.getElementById("offcanvasToc");
        const scrollToPost = () => document.getElementById(firstHeaderId).scrollIntoView({ behavior: "smooth", block: "start" });

        if (offcanvasEl?.classList.contains("show")) {
          bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
          setTimeout(scrollToPost, 300);
        } else {
          scrollToPost();
        }
      });
    };

    addTocLink(tocList);
    addTocLink(tocListMobile);

    // Smooth scrolling for internal links
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
          collapseParent.addEventListener('shown.bs.collapse', () => targetEl.scrollIntoView({ behavior: 'smooth' }), { once: true });
          bsCollapse.show();
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        history.pushState(null, '', `#${targetId}`);
      });
    });
  });

  // Scroll to hash on load
  if (window.location.hash) {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      const collapseParent = targetEl.closest('.collapse');
      if (collapseParent && !collapseParent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseParent);
        collapseParent.addEventListener('shown.bs.collapse', () => targetEl.scrollIntoView({ behavior: 'smooth' }), { once: true });
        bsCollapse.show();
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", initBlog);
