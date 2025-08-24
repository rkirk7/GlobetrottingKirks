const renderer = new marked.Renderer();

let currentPostIndex = 0; // We'll set this for each post before rendering

renderer.heading = function (text, level, raw, slugger) {
  // `text` can be a string or an object — convert to string
  let headingText = "";
  if (typeof text === "string") {
    headingText = text;
  } else if (Array.isArray(text)) {
    // join all text chunks
    headingText = text.map(t => (typeof t === "string" ? t : "")).join("");
  } else {
    headingText = String(text);
  }

  const slug = headingText.toLowerCase().replace(/[^\w]+/g, '-');
  const id = `post${currentPostIndex}-${slug}`;

  return `<h${level} id="${id}">${headingText}</h${level}>`;
};

marked.setOptions({
  renderer,
  mangle: false,
  headerIds: true
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
      text = text.replace(/^---[\s\S]*?---/, '').trim();
      return { filename: post, content: text };
    })
  );

  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  postsData.forEach((postData, index) => {
    currentPostIndex = index;
    const postId = `post${index}`;
    const postTitle = extractTitle(postData.content) || postData.filename;

    const prefixedMarkdown = postData.content.replace(
      /\[([^\]]+)\]\(#([^\)]+)\)/g,
      (_, text, id) => `[${text}](#${postId}-${id})`
    );

    const html = marked.parse(prefixedMarkdown);

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
          <div class="comments mt-3">
            <h6>Comments</h6>
            <textarea class="form-control mb-2" rows="2" placeholder="Write a comment..."></textarea>
            <button class="btn btn-sm btn-primary submit-comment" data-post="${postId}">Post</button>
            <div class="comment-list mt-2"></div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(postDiv);

    // --- Load existing comments ---
    const commentList = postDiv.querySelector(".comment-list");
    const savedComments = JSON.parse(localStorage.getItem(`${postId}-comments`) || "[]");
    savedComments.forEach(c => {
      const p = document.createElement("p");
      p.textContent = c;
      commentList.appendChild(p);
    });

    // --- Add TOC links ---
    function addTocLink(ul) {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a class="nav-link" href="#${postId}">${postTitle}</a>`;
      ul.appendChild(li);
      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const offcanvasEl = document.getElementById("offcanvasToc");
        const scrollToPost = () => document.getElementById(postId).scrollIntoView({ behavior: "smooth", block: "start" });
        if (offcanvasEl && offcanvasEl.classList.contains("show")) {
          bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
          setTimeout(scrollToPost, 300);
        } else {
          scrollToPost();
        }
      });
    }
    addTocLink(tocList);
    addTocLink(tocListMobile);

    // --- Smooth scrolling for internal links ---
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
          collapseParent.addEventListener('shown.bs.collapse', () => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), { once: true });
          bsCollapse.show();
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        history.pushState(null, '', `#${targetId}`);
      });
    });

    // --- Share button ---
    postDiv.querySelector(".share-btn").addEventListener("click", () => {
      const url = `${window.location.origin}${window.location.pathname}#${postId}`;
      if (navigator.share) {
        navigator.share({ title: postTitle, url });
      } else {
        navigator.clipboard.writeText(url);
        alert("Post link copied to clipboard!");
      }
    });

    // --- Comment submit ---
    postDiv.querySelector(".submit-comment").addEventListener("click", e => {
      const textarea = postDiv.querySelector("textarea");
      if (textarea.value.trim() !== "") {
        const newComment = document.createElement("p");
        newComment.textContent = textarea.value;
        commentList.appendChild(newComment);
        savedComments.push(textarea.value);
        localStorage.setItem(`${postId}-comments`, JSON.stringify(savedComments));
        textarea.value = "";
      }
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
        collapseParent.addEventListener('shown.bs.collapse', () => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), { once: true });
        bsCollapse.show();
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", initBlog);
