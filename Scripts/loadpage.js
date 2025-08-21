async function loadPage(page) {
  try {
    const res = await fetch(page);
    const text = await res.text();

    // Create a temporary DOM to parse the fetched page
    const temp = document.createElement("div");
    temp.innerHTML = text;

    // Grab only the part we want (e.g., the container)
    const content = temp.querySelector(".container"); // or #main, etc.
    const element = document.getElementById("content");

    if (content) {
      element.innerHTML = content.outerHTML;
    } else {
      element.innerHTML = "<p>Content not found</p>";
    }
  } catch (err) {
    console.error("Error loading page:", err);
  }
}
