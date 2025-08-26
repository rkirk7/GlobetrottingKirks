// ===========================
// blog.js - Main Blog Page
// ===========================

marked.setOptions({
  mangle: false,
  headerIds: true
});

const POSTS = [
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

const blogContainer = document.getElementById("blog-posts");

// Load and render all posts
async function initBlog() {
  for (let postFile of POSTS) {
    try {
      const response = await fetch(`blog-posts/${postFile}`);
      let markdown = await response.text();

      // Extract title
      const lines = markdown.split("\n");
      const firstHeadingIndex = lines.findIndex(l => l.startsWith("# "));
      const title = firstHeadingIndex >= 0
        ? lines[firstHeadingIndex].replace(/^# /, "")
        : postFile.replace(".md", "");

      // Create preview text (first 6 non-empty lines, skipping H1)
      const contentLines = lines.filter((l, i) => i !== firstHeadingIndex && l.trim() !== "");
      const previewLines = contentLines.slice(0, 6).join("\n");
      const previewHTML = marked.parse(previewLines);

      // Create card
      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm";
      card.innerHTML = `
        <div class="card-body">
          <h2 class="card-title mb-3">${title}</h2>
          <div class="card-text mb-3" style="line-height:1.6;">${previewHTML}</div>
          <a href="blogpost.html?post=${encodeURIComponent(postFile)}" class="btn btn-primary btn-sm">Read More</a>
        </div>
      `;

      blogContainer.appendChild(card);
    } catch (err) {
      console.error(`Error loading ${postFile}:`, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", initBlog);
