marked.setOptions({
  headerIds: true,
  mangle: false,
  headerPrefix: ''
});

async function initBlog() {
  const posts = [
    "2025-08-14-panda-monium-close-encounters-in-chengdu-and-wolong-china.md",
    "2025-06-03-exploring-antarctica-and-the-arctic-how-did-two-floridians-end-up-at-both-polar-regions-in-one-year-and-what-did-they-discover.md",
    "2025-01-29-antarctica-calls-and-we-must-go.md",
    "2024-09-12-in-search-of-polar-bears-in-the-arctic.md",
    "2023-07-20-come-safari-with-us.md",
    "2023-02-25-100-miles-in-10-days-the-nearly-perfect-patagonia-hiking-trip",
    "2022-10-20-paradise-found-french-polynesia",
    "2022-06-13-enchanting-galapagos-a-wildlife-wonderland.md",
    "2021-08-26-my-heritage-journey-to-hong-kong-and-china.md",
    "2021-08-22-western-parks-adventure-top-highlights.md",
    "2020-02-21-new-zealand-adrenaline-rush-2-death-defying-weeks.md",
    "2019-11-05-which-alp-is-the-coolest.md",
    "2019-11-04-viva-la-via-ferrata.md",
    "2019-11-04-around-iceland-in-10-days-top-highlights.md",
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

  function extractTitle(mdContent) {
    const lines = mdContent.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("# ")) return line.replace(/^# /, "").trim();
    }
    return null;
  }

  const postsData = await Promise.all(
    posts.map(async post => {
      let text = await fetch(`blog-posts/${post}`).then(res => res.text());
      text = text.replace(/^---[\s\S]*?---/, '').trim(); // remove YAML frontmatter
      return { filename: post, content: text };
    })
  );

  // Sort newest first using the YYYY-MM-DD at the start of filename
  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    const postId = `post${index}`;
    const postTitle = extractTitle(postData.content) || postData.filename;

    // Convert markdown to HTML with postId-prefixed heading IDs
    // (Use headerPrefix here—not a custom "headerId" option)
    const html = marked.parse(postData.content, {
      headerIds: true,
      mangle: false,
      headerPrefix: `${postId}-`
    });

    // Create post card
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
      </div>
    `;

    container.appendChild(postDiv);

    const collapseEl = postDiv.querySelector(`#collapse${index}`);
    const titleEl = postDiv.querySelector(".post-title");

    // Show title when expanded, reveal when collapsed
    collapseEl.addEventListener("show.bs.collapse", () => titleEl.classList.add("d-none"));
    collapseEl.addEventListener("hide.bs.collapse", () => titleEl.classList.remove("d-none"));

    // Add TOC links (desktop + mobile)
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

    // ================================
    // Internal anchors inside this post
    // ================================
    const postContent = postDiv.querySelector('.blog-post-content');

    // Helper: ensure an id has this post's prefix once (no double-prefix)
    const ensurePrefixed = (rawId) => rawId.startsWith(`${postId}-`) ? rawId : `${postId}-${rawId}`;

    // 1) Rewrite hrefs so copy/paste links include the correct prefix
    postContent.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const rawId = decodeURIComponent(anchor.getAttribute('href').substring(1));
      anchor.setAttribute('href', `#${ensurePrefixed(rawId)}`);
    });

    // 2) Click behavior: open card if needed, then smooth scroll + update hash
    postContent.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1); // already prefixed by step 1
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
  });

  // ================================
  // Scroll to hash on page load
  // ================================
  if (window.location.hash) {
    const rawHash = decodeURIComponent(window.location.hash.substring(1));
    // Try exact id first (works if the link already includes postX- prefix)
    let targetEl = document.getElementById(rawHash);

    // Fallback: if someone linked to an unprefixed slug, find the first matching prefixed id
    if (!targetEl && rawHash && !/^post\d+-/.test(rawHash)) {
      targetEl = document.querySelector(`[id$="-${CSS && CSS.escape ? CSS.escape(rawHash) : rawHash}"]`);
    }

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
