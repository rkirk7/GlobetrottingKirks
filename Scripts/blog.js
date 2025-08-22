async function initBlog() {
  const posts = [
    "2025-08-14-panda-monium-close-encounters-in-chengdu-and-wolong-china.md",
    "2025-06-03-exploring-antarctica-and-the-arctic-how-did-two-floridians-end-up-at-both-polar-regions-in-one-year-and-what-did-they-discover.md",
    "2025-01-29-antarctica-calls-and-we-must-go.md",
    "2024-09-12-in-search-of-polar-bears-in-the-arctic.md",
    "2023-07-20-come-safari-with-us.md",
    "2023-02-25-100-miles-in-10-days-the-nearly-perfect-patagonia-hiking-trip",
    "2022-10-20-paradise-found-french-polynesia"
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
      const text = await fetch(`blog-posts/${post}`).then(res => res.text());
      return { filename: post, content: text };
    })
  );

  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    let html = marked.parse(postData.content);

    // Generate ids for headings so in-page links work
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
      const id = h.textContent.trim().toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
      h.id = id;
    });
    html = tempDiv.innerHTML;

    const collapseId = `postCollapse${index}`;
    const postId = `post${index}`;
    const postTitle = extractTitle(postData.content) || postData.filename;

    const addTocLink = (ul) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${postId}">&#9654; ${postTitle}</a>`;
      ul.appendChild(li);

      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const collapseEl = document.getElementById(collapseId);
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: true });
        bsCollapse.show();

        document.getElementById(postId).scrollIntoView({ behavior: "smooth" });

        const offcanvasEl = document.getElementById("offcanvasToc");
        if (offcanvasEl.classList.contains("show")) {
          bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
        }
      });
    };

    addTocLink(tocList);
    addTocLink(tocListMobile);

    const htmlWithStyledImages = html.replace(
      /<img /g,
      '<img class="img-fluid mb-3" style="max-width:50%;display:block;margin:0.5rem auto;" '
    );

    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-3");
    postDiv.id = postId;

    postDiv.innerHTML = `
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center" 
           style="cursor:pointer;" 
           data-bs-toggle="collapse" 
           data-bs-target="#${collapseId}" 
           aria-expanded="true">
        <span class="caret" style="display:inline-block; transform: rotate(90deg); transition: transform 0.2s;">&#9654;</span>
        <span class="ms-2">${postTitle}</span>
      </div>
      <div id="${collapseId}" class="collapse show">
        <div class="card-body">${htmlWithStyledImages}</div>
      </div>
    `;

    container.appendChild(postDiv);

    const collapseEl = postDiv.querySelector(`#${collapseId}`);
    const caretEl = postDiv.querySelector(".caret");

    collapseEl.addEventListener("show.bs.collapse", () => {
      caretEl.style.transform = "rotate(90deg)";
    });
    collapseEl.addEventListener("hide.bs.collapse", () => {
      caretEl.style.transform = "rotate(0deg)";
    });
  });
}

document.addEventListener("DOMContentLoaded", initBlog);
