async function initBlog() {
  const posts = [
    "2015-08-29-hello-world-2.md",
    "2015-09-14-yes-the-world-needs-another-website-mine.md",
    "2015-09-16-retirement-milestone-3-months-and-counting.md",
    "2015-09-28-reunion-part-one.md",
    "2015-10-03-reunion-magic-returning-to-goudy-and-lane.md"
  ];

  const container = document.getElementById("blog-container");
  if (!container) return;

  // Fetch all posts in parallel and keep content with filename
  const postsData = await Promise.all(
    posts.map(async post => {
      const text = await fetch(`blog-posts/${post}`).then(res => res.text());
      return { filename: post, content: text };
    })
  );

  // Sort by date extracted from filename (newest first)
  postsData.sort((a, b) => {
    const dateA = new Date(a.filename.slice(0, 10));
    const dateB = new Date(b.filename.slice(0, 10));
    return dateB - dateA;
  });

  // Now append in order
  postsData.forEach(postData => {
    const html = marked.parse(postData.content);
    const postDiv = document.createElement("div");
    postDiv.classList.add("card", "shadow-lg", "mb-5");

    const htmlWithStyledImages = html.replace(/<img /g, '<img class="img-fluid mb-3" ');

    postDiv.innerHTML = `<div class="card-body">${htmlWithStyledImages}</div>`;
    container.appendChild(postDiv);
  });
}
