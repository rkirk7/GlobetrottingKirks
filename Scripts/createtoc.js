function createTOCAndReturnLinks() {
  // Make sure to select the container inside #content
  const container = document.querySelector("#content .container");
  if (!container) {
    console.log("No container found for TOC");
    return;
  }

  const headers = container.querySelectorAll("h2");
  if (!headers.length) {
    console.log("No H2 headers found for TOC");
    return;
  }

  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  tocList.innerHTML = "";

  // Add top anchor
  if (!document.getElementById("top")) {
    const topAnchor = document.createElement("a");
    topAnchor.id = "top";
    container.insertBefore(topAnchor, container.firstChild);
  }

  headers.forEach((h2, i) => {
    if (!h2.id) h2.id = `section-${i + 1}`;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    li.appendChild(a);
    tocList.appendChild(li);

    // Add "Return to Top"
    const returnLink = document.createElement("p");
    returnLink.style.textAlign = "right";
    returnLink.innerHTML = `<a href="#top" style="text-decoration:none;color:#007bff;">Return to Top ↑</a>`;
    h2.insertAdjacentElement("afterend", returnLink);
  });

  document.getElementById('toc').classList.remove('d-none');
}

function addReturnToTopLinks(container) {
  // Grab all sections that start with an H2
  const sections = container.querySelectorAll("h2");

  sections.forEach(h2 => {
    // Find the next sibling elements until the next H2 or end of container
    let current = h2.nextElementSibling;
    let lastElement = h2; 

    while (current && current.tagName !== "H2") {
      lastElement = current;
      current = current.nextElementSibling;
    }

    // Add "Return to top" at the end of this section
    const returnLink = document.createElement("a");
    returnLink.href = "#top";
    returnLink.textContent = "Return to top ↑";
    returnLink.classList.add("d-block", "text-center", "my-3");

    lastElement.insertAdjacentElement("afterend", returnLink);
  });
}
