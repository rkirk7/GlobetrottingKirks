marked.setOptions({
  headerIds: true,
  mangle: false,  // prevents encoding special characters
  headerPrefix: '' // optional prefix for IDs
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

  // Sort newest first
  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    const postId = `post${index}`;
    const postTitle = extractTitle(postData.content) || postData.filename;

    // Convert markdown to HTML
    const html = marked.parse(postData.content);

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

    // Show title when collapsed, hide when expanded
    collapseEl.addEventListener("show.bs.collapse", () => titleEl.classList.add("d-none"));
    collapseEl.addEventListener("hide.bs.collapse", () => titleEl.classList.remove("d-none"));

    // Add TOC link to main TOC
    const addTocLink = (ul) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${postId}">${postTitle}</a>`;
      ul.appendChild(li);

      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const offcanvasEl = document.getElementById("offcanvasToc");
        if (offcanvasEl && offcanvasEl.classList.contains("show")) {
          bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
          setTimeout(() => document.getElementById(postId).scrollIntoView({ behavior: "smooth", block: "start" }), 300);
        } else {
          document.getElementById(postId).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    };

    addTocLink(tocList);
    addTocLink(tocListMobile);

    // --- Generate internal TOC for this post ---
    const blogBody = postDiv.querySelector(".blog-post-content");
    const headings = blogBody.querySelectorAll("h1, h2, h3");
    if (headings.length > 0) {
      const postToc = document.createElement("ul");
      postToc.classList.add("post-toc", "mb-3");

      headings.forEach(h => {
        if (!h.id) return; // skip if no ID
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
        li.querySelector("a").addEventListener("click", e => {
          e.preventDefault();
          document.getElementById(h.id).scrollIntoView({ behavior: "smooth", block: "start" });
        });
        postToc.appendChild(li);
      });

      blogBody.prepend(postToc); // insert TOC at the top of the post
    }
  });
}

document.addEventListener("DOMContentLoaded", initBlog);
