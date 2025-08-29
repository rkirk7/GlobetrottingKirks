function createTOCAndReturnLinks() {
  const container = document.querySelector(".container");
  if (!container) return;

  const headers = container.querySelectorAll("h2");
  if (!headers.length) return;

  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  tocList.innerHTML = ""; // Clear old entries

  // Add top anchor once
  if (!document.getElementById("top")) {
    const topAnchor = document.createElement("a");
    topAnchor.id = "top";
    container.insertBefore(topAnchor, container.firstChild);
  }

  headers.forEach((h2, i) => {
    if (!h2.id) h2.id = `section-${i + 1}`;

    // Create TOC entry
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    a.style.textDecoration = "none";
    a.style.color = "#007bff";
    a.onmouseover = () => a.style.textDecoration = "underline";
    a.onmouseout = () => a.style.textDecoration = "none";
    li.appendChild(a);
    tocList.appendChild(li);

    // Add "Return to Top" without scanning the DOM
    const returnLink = document.createElement("p");
    returnLink.style.textAlign = "right";
    returnLink.innerHTML = `<a href="#top" style="text-decoration:none;color:#007bff;">Return to Top ↑</a>`;
    
    h2.insertAdjacentElement("afterend", returnLink);
  });

  document.getElementById('toc').classList.remove('d-none');
}
