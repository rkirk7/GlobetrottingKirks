// ===========================
// MARKED RENDERER FOR HEADINGS
// ===========================
// const renderer = new marked.Renderer();
// let currentPostIndex = 0; // Set for each post

// renderer.heading = function(text, level, raw) {
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = text;
//   const plainText = raw || tempDiv.textContent || tempDiv.innerText || '';
//   const slug = plainText.toLowerCase().replace(/[^\w]+/g, '-');
//   const id = `post${currentPostIndex}-${slug}`;
//   return `<h${level} id="${id}">${text}</h${level}>`;
// };

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
    
    "2018-11-08-top-10-balkan-highlights-the-best-of-slovenia-croatia-bosnia-herzegovina-and-montenegro.md",
    "2018-11-08-bosnia-herzegovina-highlights-in-4-days.md",
    "2018-07-01-amalfi-coast-and-more-top-10-highlights.md",
    "2017-08-19-ireland-top-10-highlights-driving-around-the-emerald-isle.md",
    "2017-04-29-magical-machu-picchu-and-hiking-huayna-picchu.md",
    "2017-04-11-tackling-the-tongariro-alpine-crossing.md",
    "2017-02-08-top-10-highlights-from-down-under.md",
    "2016-08-04-top-10-china-highlights.md",
    "2016-08-04-china-dim-sum-report.md",
    "2016-06-19-off-to-the-land-of-my-birth.md",
    "2015-11-30-mystical-angkor-temples.md",
  ];

  const container = document.getElementById("blog-container");
  const tocList = document.getElementById("toc-list");
  const tocListMobile = document.getElementById("toc-list-mobile");
  if (!container || !tocList || !tocListMobile) return;

  // --- Load posts
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

  // --- Render each post ---
  postsData.forEach((postData, index) => {
    currentPostIndex = index;
    const postId = `post${index}`;
    const postTitle = postData.content.split("\n").find(l => l.startsWith("# "))?.replace(/^# /, "") || postData.filename;

    // Prefix internal Markdown links with post ID
    const prefixedMarkdown = postData.content.replace(
      /\[([^\]]+)\]\(#([^\)]+)\)/g,
      (_, text, id) => `[${text}](#${postId}-${id})`
    );

    // Convert markdown to HTML
    let html = marked.parse(prefixedMarkdown);

    // --- Add captions to images ---
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll('img').forEach(img => {
      const filename = img.getAttribute('src').split('/').pop();
      const caption = (imageMeta && imageMeta[filename]) || "";
      img.setAttribute('alt', caption || filename);
      
      if (!img.closest('figure')) {
        const figure = document.createElement('figure');
        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
        if (caption) {
          const figcap = document.createElement('figcaption');
          figcap.textContent = caption;
          figure.appendChild(figcap);
        }
      } else {
        const figcap = img.nextElementSibling;
        if (!figcap || figcap.tagName.toLowerCase() !== 'figcaption') {
          if (caption) {
            const figcapNew = document.createElement('figcaption');
            figcapNew.textContent = caption;
            img.after(figcapNew);
          }
        } else {
          figcap.textContent = caption;
        }
      }
      

      img.setAttribute('alt', caption);
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

    // Toggle title visibility on collapse/expand
const collapseEl = postDiv.querySelector(`#collapse${index}`);
const titleSpan = postDiv.querySelector(".post-title");

collapseEl.addEventListener("hidden.bs.collapse", () => {
  titleSpan.classList.remove("d-none");
});
collapseEl.addEventListener("show.bs.collapse", () => {
  titleSpan.classList.add("d-none");
});

    // TOC population example (if you need titles in TOC)
// TOC population with date
const tocItem = document.createElement('li');

// Extract date from filename (YYYY-MM-DD format)
const postDate = postData.filename.slice(0, 10); 
const dateFormatted = new Date(postDate).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric'
});

tocItem.innerHTML = `<a href="#${postId}"><strong>${postTitle}</strong><br><small class="text-muted">${dateFormatted}</small></a>`;

tocList.appendChild(tocItem);
const tocItemMobile = tocItem.cloneNode(true);
tocListMobile.appendChild(tocItemMobile);

  });
}

document.addEventListener("DOMContentLoaded", initBlog);
