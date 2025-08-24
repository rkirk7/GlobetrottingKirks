
    marked.setOptions({
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
        "2015-10-03-reunion-magic-returning-to-goudy-and-lane.md",
        "2015-09-28-reunion-part-one.md",
        "2015-09-16-retirement-milestone-3-months-and-counting.md",
        "2015-09-14-yes-the-world-needs-another-website-mine.md",
        "2015-08-29-hello-world-2.md"
      ];
    
      const container = document.getElementById("blog-posts");
      const toc = document.getElementById("toc");
    
      for (const filename of posts) {
        try {
          // Fetch the markdown file as text
          const response = await fetch(`posts/${filename}`);
          const text = await response.text();
    
          // Convert markdown to HTML
          const html = marked.parse(text);
    
          // Create a wrapper div for the post
          const postDiv = document.createElement("div");
          postDiv.classList.add("post");
          postDiv.innerHTML = html;
    
          // Find the first heading for TOC
          const firstHeading = postDiv.querySelector("h1, h2, h3");
          let title = firstHeading ? firstHeading.innerText : "Untitled";
    
          // Make sure headings have an ID for TOC links
          if (firstHeading && !firstHeading.id) {
            firstHeading.id = filename.replace(".md", "");
          }
    
          // Add TOC entry
          const tocItem = document.createElement("li");
          if (firstHeading) {
            tocItem.innerHTML = `<a href="#${firstHeading.id}">${title}</a>`;
          } else {
            tocItem.textContent = title;
          }
          toc.appendChild(tocItem);
    
          // Add the post to the container
          container.appendChild(postDiv);
    
        } catch (err) {
          console.error(`Error loading ${filename}:`, err);
        }
      }
    
      // Add smooth scrolling for TOC links
      toc.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          e.preventDefault();
          const targetId = e.target.getAttribute("href").substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }
    
    initBlog();
    