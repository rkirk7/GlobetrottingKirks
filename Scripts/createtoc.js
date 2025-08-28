function createTOCAndReturnLinks() {
    const container = document.querySelector(".container");
    if (!container) return;
  
    // Find all H2 elements
    const headers = container.querySelectorAll("h2");
  
    // Create TOC container
    const toc = document.createElement("nav");
    toc.id = "toc";
    toc.innerHTML = "<h3>Contents</h3>";
    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";
    ul.style.paddingLeft = "0";
  
    headers.forEach((h2, i) => {
      if (!h2.id) h2.id = `section-${i + 1}`;
      const li = document.createElement("li");
      li.style.marginBottom = "0.5rem";
      const a = document.createElement("a");
      a.href = `#${h2.id}`;
      a.textContent = h2.textContent;
      a.style.textDecoration = "none";
      a.style.color = "#007bff";
      a.onmouseover = () => a.style.textDecoration = "underline";
      a.onmouseout = () => a.style.textDecoration = "none";
      li.appendChild(a);
      ul.appendChild(li);
  
      const returnLink = document.createElement("p");
      returnLink.style.textAlign = "right";
      returnLink.innerHTML = `<a href="#top" style="text-decoration:none;color:#007bff;">Return to Top ↑</a>`;
  
      // Find end of section
      let sectionEnd = h2.nextElementSibling;
      while (sectionEnd && sectionEnd.tagName.toLowerCase() !== "h2") {
        if (!sectionEnd.nextElementSibling) break;
        sectionEnd = sectionEnd.nextElementSibling;
      }
      sectionEnd?.insertAdjacentElement("afterend", returnLink);
    });
  
    toc.appendChild(ul);
  
    const topHeading = document.querySelector("#content h1");
    if (topHeading) {
      topHeading.insertAdjacentElement("afterend", toc);
    } else {
      console.warn("No <h1> found to insert TOC after.");
    }
    
  
    const topAnchor = document.createElement("a");
    topAnchor.id = "top";
    container.insertBefore(topAnchor, container.firstChild);
  }
  
  window.addEventListener("DOMContentLoaded", createTOCAndReturnLinks);