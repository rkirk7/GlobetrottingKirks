document.addEventListener("DOMContentLoaded", function () {
  fetch("posts.json")
    .then(response => response.json())
    .then(posts => {
      const blogContainer = document.getElementById("blog-posts");

      // Custom renderer to give headings IDs for TOC
      const renderer = new marked.Renderer();
      renderer.heading = function (text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${level} id="${escapedText}">${text}</h${level}>`;
      };
      marked.setOptions({ renderer, mangle: false, headerIds: true });

      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      posts.forEach((post, index) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("card", "mb-3");

        postDiv.innerHTML = `
          <div class="card-header" id="heading${index}">
            <h2 class="mb-0">
              <button class="btn btn-link" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${index}" aria-expanded="true"
                aria-controls="collapse${index}">
                ${post.title} - ${post.date}
              </button>
            </h2>
          </div>
          <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}">
            <div class="card-body"></div>
          </div>
        `;

        const blogBody = postDiv.querySelector(".card-body");
        blogBody.innerHTML = marked.parse(post.content);

        // TOC container
        const tocContainer = document.createElement("div");
        tocContainer.classList.add("post-toc-container");

        // Grab headings and build TOC links
        const headings = blogBody.querySelectorAll("h2, h3");
        const tocList = document.createElement("ul");

        headings.forEach(h => {
          if (!h.id) return; // skip if no ID for some reason
          const li = document.createElement("li");
          li.classList.add(h.tagName === "H2" ? "toc-h2" : "toc-h3");
          const a = document.createElement("a");
          a.href = `#${h.id}`;
          a.innerText = h.innerText;
          li.appendChild(a);
          tocList.appendChild(li);
        });

        if (tocList.children.length > 0) {
          tocContainer.innerHTML = "<strong>Contents</strong>";
          tocContainer.appendChild(tocList);
          // Insert TOC at top of collapse container, not inside body
          postDiv.querySelector(`#collapse${index}`).prepend(tocContainer);
        }

        blogContainer.appendChild(postDiv);
      });
    });
});
