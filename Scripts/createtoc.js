function createTOCAndReturnLinks() {
  const container = document.querySelector(".container");
  if (!container) return;

  // Find all H2 elements
  const headers = container.querySelectorAll("h2");
  if (!headers.length) return;

  console.log("Found headings:", headers.length);

  // Get the UL for the TOC
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  tocList.innerHTML = ""; // Clear old contents

  headers.forEach((h2, i) => {
    if (!h2.id) h2.id = `section-${i + 1}`;

    // Create TOC entry
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
    tocList.appendChild(li);

    // Add "Return to Top" after each section
    const returnLink = document.createElement("p");
    returnLink.style.textAlign = "right";
    returnLink.innerHTML = `<a href="#top" style="text-decoration:none;color:#007bff;">Return to Top ↑</a>`;

    // Insert after section end
    let sectionEnd = h2.nextElementSibling;
    while (sectionEnd && sectionEnd.tagName.toLowerCase() !== "h2") {
      if (!sectionEnd.nextElementSibling) break;
      sectionEnd = sectionEnd.nextElementSibling;
    }
    sectionEnd?.insertAdjacentElement("afterend", returnLink);
  });

  // Add top anchor at start
  const topAnchor = document.createElement("a");
  topAnchor.id = "top";
  container.insertBefore(topAnchor, container.firstChild);
}