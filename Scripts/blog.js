// blog.js
function initBlog() {
  const posts = [
    "2015-08-29-hello-world-2.md",
    "2015-09-14-yes-the-world-needs-another-website-mine.md",
    "2015-09-16-retirement-milestone-3-months-and-counting.md",
    "2015-09-28-reunion-magic.md",
    "2015-10-03-reunion-magic-returning-to-goudy-and-lane.md"
    // Add more markdown posts here
  ];

  const container = document.getElementById("blog-container");
  if (!container) return;

posts.sort((a, b) => {
  const dateA = new Date(a.slice(0, 10));
  const dateB = new Date(b.slice(0, 10));
  return dateB - dateA; // descending: newest first
});

  
  posts.forEach(post => {
    fetch(`blog-posts/${post}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        // Convert Markdown to HTML
        const html = marked.parse(text);

        // Wrap content in a scoped container
        const postDiv = document.createElement("div");
        postDiv.classList.add("card", "shadow-lg", "mb-5");

        // Add Bootstrap styling for images inside the blog post
        const htmlWithStyledImages = html.replace(/<img /g, '<img class="img-fluid mb-3" ');

        postDiv.innerHTML = `<div class="card-body blog-post-content">${htmlWithStyledImages}</div>`;
        container.appendChild(postDiv);
      })
      .catch(err => {
        console.error(`Failed to load ${post}:`, err);
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("alert", "alert-danger");
        errorDiv.textContent = `Failed to load ${post}: ${err.message}`;
        container.appendChild(errorDiv);
      });
  });
}
