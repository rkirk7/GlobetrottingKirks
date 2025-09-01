async function initBlog() {
  const posts = [
    "2025-08-23-churchill.md",
    "2025-08-14-pandas.md",
    "2025-06-03-exploring-antarctica-and-the-arctic.md",
    "2025-01-29-antarctica.md",
    "2024-09-12-polar-bears-in-the-arctic.md",
    "2023-07-20-safari.md",
    "2023-02-25-Patagonia.md",
    "2022-10-20-french-polynesia.md",
    "2022-06-13-galapagos.md",
    "2021-08-26-my-heritage-journey.md",
    "2021-08-22-western-parks.md",
    "2020-02-21-new-zealand.md",
    "2019-11-05-switzerland.md",
    "2019-11-04-viva-la-via-ferrata.md",
    "2019-11-04-iceland.md",
    "2019-04-09-south-africa.md",
    "2018-12-10-river-cruise.md",
    "2018-11-08-top-10-balkan-highlights-the-best-of-slovenia-croatia-bosnia-herzegovina-and-montenegro.md",
    "2018-11-08-bosnia-herzegovina-highlights-in-4-days.md",
    "2018-07-01-amalfi-coast.md",
    "2017-08-19-ireland.md",
     "2018-01-12-tanzania.md",
    "2017-04-29-machu-picchu.md",
    "2017-04-11-tongariro.md",
    "2017-02-08-down-under.md",
    "2016-08-04-china.md",
    "2016-08-04-china-dim-sum-report.md",
    //"2016-06-19-off-to-the-land-of-my-birth.md",
    "2015-11-30-mystical-angkor-temples.md",
  ];

  const container = document.getElementById("blog-container");
  const tocList = document.getElementById("toc-list");
  const tocListMobile = document.getElementById("toc-list-mobile");
  if (!container || !tocList || !tocListMobile) return;

  // --- Load posts ---
  const postsData = await Promise.all(
    posts.map(async post => {
      let text = await fetch(`blog-posts/${post}`).then(res => res.text());
      text = text.replace(/^---[\s\S]*?---/, '').trim();
      return { filename: post, content: text };
    })
  );

  // --- Sort newest first ---
  postsData.sort((a, b) => new Date(b.filename.slice(0, 10)) - new Date(a.filename.slice(0, 10)));

  // --- Render each post ---
  postsData.forEach((postData, index) => {
    // --- Get preview ---
    const paragraphs = postData.content.split(/\n\s*\n/);
    const previewText = paragraphs.slice(0, 5).join("\n\n");
    let previewHtml = marked.parse(previewText);

    // --- Constrain images in preview ---
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = previewHtml;
    tempDiv.querySelectorAll("img").forEach(img => {
      img.style.maxWidth = "100%";
      img.style.maxHeight = "300px";
      img.style.display = "block";
      img.style.margin = "0 auto";
      img.style.borderRadius = "6px";
    });

    // --- Build card ---
    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-3");

    const postId = `post${index}`;
    postDiv.id = postId;
    const postTitle = postData.content.split("\n").find(l => l.startsWith("# "))?.replace(/^# /, "") || postData.filename;

    postDiv.innerHTML = `
      <div class="card-body blog-post-content">
        ${tempDiv.innerHTML}
        <p class="text-align"><a href="blogpost.html?post=${encodeURIComponent(postData.filename)}" class="btn btn-primary btn-sm mt-2" target="_blank">Read More</a></p>
      </div>
    `;

    container.appendChild(postDiv);

    // --- TOC ---
    const tocItem = document.createElement('li');
    const postDate = postData.filename.slice(0, 10); 
    const dateFormatted = new Date(postDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    tocItem.innerHTML = `<a href="#${postId}"><strong>${postTitle}</strong><br><small class="text-muted">${dateFormatted}</small></a>`;
    tocList.appendChild(tocItem);
    tocListMobile.appendChild(tocItem.cloneNode(true));
  });
}

document.addEventListener("DOMContentLoaded", initBlog);
