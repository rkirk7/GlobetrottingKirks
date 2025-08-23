// blog.js

// Configure marked with custom renderer for heading IDs
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

marked.setOptions({
  renderer,
  headerIds: true,
  mangle: false,
  headerPrefix: ''
});

// Fetch and render blog posts
async function initBlog() {
  try {
    const response = await fetch('blog-posts.json');
    const posts = await response.json();
    const blogContainer = document.getElementById('blog');

    posts.forEach((post, index) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'card mb-3';

      // Build card header
      postDiv.innerHTML = `
        <div class="card-header" id="heading${index}">
          <h2 class="mb-0">
            <button class="btn btn-link" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapse${index}" aria-expanded="true"
                    aria-controls="collapse${index}">
              ${post.title}
            </button>
          </h2>
        </div>
        <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}"
             data-bs-parent="#blog">
          <div class="card-body"></div>
        </div>
      `;

      blogContainer.appendChild(postDiv);

      // Load markdown content
      fetch(post.file)
        .then(res => res.text())
        .then(content => {
          const html = marked.parse(content);
          const blogBody = postDiv.querySelector('.card-body');
          blogBody.innerHTML = html;

          // Build TOC
          const headings = blogBody.querySelectorAll('h2, h3');
          if (headings.length > 0) {
            const tocContainer = document.createElement('div');
            tocContainer.className = 'post-toc-container';
            const tocList = document.createElement('ul');
            tocList.className = 'post-toc';

            headings.forEach(h => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = `#${h.id}`;
              a.textContent = h.textContent;
              li.appendChild(a);
              tocList.appendChild(li);
            });

            tocContainer.appendChild(tocList);

            // Insert TOC at top of collapse section, above body
            postDiv.querySelector(`#collapse${index}`).prepend(tocContainer);
          }
        });
    });
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', initBlog);
