async function initBlog() {
  const posts = [
    "2025-08-14-panda-monium-close-encounters-in-chengdu-and-wolong-china.md",
    "2025-06-03-exploring-antarctica-and-the-arctic-how-did-two-floridians-end-up-at-both-polar-regions-in-one-year-and-what-did-they-discover.md",
    "2025-01-29-antarctica-calls-and-we-must-go.md",
    "2024-09-12-in-search-of-polar-bears-in-the-arctic.md",
    "2023-07-20-come-safari-with-us.md",
        "2015-10-03-reunion-magic-returning-to-goudy-and-lane.md",
      //  "2015-09-28-reunion-magic-yes-you-can-go-home-again.md",
        "2015-09-16-retirement-milestone-3-months-and-counting.md",
        "2015-09-14-yes-the-world-needs-another-website-mine.md",
    "2015-08-29-hello-world-2.md",
  ];

  const container = document.getElementById("blog-container");
  if (!container) return;

  const postsData = await Promise.all(
    posts.map(async post => {
      const text = await fetch(`blog-posts/${post}`).then(res => res.text());
      return { filename: post, content: text };
    })
  );

  postsData.sort((a, b) => {
    const dateA = new Date(a.filename.slice(0, 10));
    const dateB = new Date(b.filename.slice(0, 10));
    return dateB - dateA;
  });

  postsData.forEach(postData => {
    const html = marked.parse(postData.content);

    // wrap in a div for blog-specific styling
    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-5", "blog-post-content");

    // style images consistently
    const htmlWithStyledImages = html.replace(
      /<img /g,
      '<img class="img-fluid mb-3" style="max-width:50%;display:block;margin:0.5rem auto;" '
    );

    postDiv.innerHTML = `<div class="card-body">${htmlWithStyledImages}</div>`;
    container.appendChild(postDiv);
  });
}
