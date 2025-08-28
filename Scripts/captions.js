document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("image-data.json");
  const data = await res.json();
  const imgs = document.querySelectorAll(".container img, .blog-container img");

  imgs.forEach(img => {
    const src = img.getAttribute("src").split("/").pop().toLowerCase();
    if (data[src]) {
      const caption = document.createElement("div");
      caption.className = "caption";
      caption.textContent = data[src];
      img.after(caption);
    }
  });
});
