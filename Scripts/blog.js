async function initBlog() {
  const posts = [
    "2025-08-14-panda-monium-close-encounters-in-chengdu-and-wolong-china.md",
    "2025-06-03-exploring-antarctica-and-the-arctic-how-did-two-floridians-end-up-at-both-polar-regions-in-one-year-and-what-did-they-discover.md",
    "2025-01-29-antarctica-calls-and-we-must-go.md",
    "2024-09-12-in-search-of-polar-bears-in-the-arctic.md",
    "2023-07-20-come-safari-with-us.md"
  ];

  const container = document.getElementById("blog-container");
  const tocList = document.getElementById("toc-list");
  const tocListMobile = document.getElementById("toc-list-mobile");
  if (!container || !tocList || !tocListMobile) return;

  const postsData = await Promise.all(
    posts.map(async post => {
      const text = await fetch(`blog-posts/${post}`).then(res => res.text());
      return { filename: post, content: text };
    })
  );

  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    const html = marked.parse(postData.content);
    const collapseId = `postCollapse${index}`;
    const postId = `post${index}`;

    // Populate desktop TOC
    const addTocLink = (ul) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${postId}">&#9654;</a>`;
      ul.appendChild(li);

      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const collapseEl = document.getElementById(collapseId);
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: true });
        bsCollapse.show();
        document.getElementById(postId).scrollIntoView({ behavior: "smooth" });

        // Close mobile TOC if open
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
           aria-expanded="false">
        <span>&#9654;</span>
      </div>
      <div id="${collapseId}" class="collapse">
        <div class="card-body">${htmlWithStyledImages}</div>
      </div>
    `;

    container.appendChild(postDiv);
  });
}

document.addEventListener("DOMContentLoaded", initBlog);
