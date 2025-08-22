// blog.js
function initBlog() {
  const posts = [
    "2015-08-29-hello-world-2.md",
    "2015-09-14-yes-the-world-needs-another-website-mine.md",
    "2015-09-16-retirement-milestone-3-months-and-counting.md",
    "2015-09-28-reunion-magic-yes-you-can-go-home-again.md"
    // Add more markdown posts here
  ];

  const container = document.getElementById("blog-container");
  if (!container) return;

  posts.forEach(post => {
    fetch(`blog-posts/${post}`)
      .then(res => res.text())
      .then(text => {
        const html = marked.parse(text);

        const postDiv = document.createElement("div");
        postDiv.classList.add("card", "shadow-lg", "mb-5");

        // Optional: style images consistently
        const htmlWithStyledImages = html.replace(/<img /g, '<img class="img-fluid mb-3" ');

        postDiv.innerHTML = `<div class="card-body">${htmlWithStyledImages}</div>`;
        container.appendChild(postDiv);
      })
      .catch(err => {
        console.error(`Failed to load ${post}:`, err);
      });
  });
}
