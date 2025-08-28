document.addEventListener("DOMContentLoaded", async () => {
    // Path to your JSON — update if your file lives elsewhere
    const JSON_PATH = "image-data.json";
  
    // Helper: normalize a filename for matching
    const normalize = s => (s || "").split("?")[0].split("#")[0].trim().toLowerCase();
  
    try {
      const res = await fetch(JSON_PATH);
      if (!res.ok) throw new Error(`Failed to fetch ${JSON_PATH}: ${res.status}`);
      const raw = await res.json();
  
      // Normalize keys to lower-case for case-insensitive lookup
      const captions = {};
      Object.keys(raw || {}).forEach(k => {
        captions[normalize(k)] = raw[k];
      });
  
      // Select images inside your content container(s)
      const imgs = document.querySelectorAll(".container img, .blog-container img, #post-content img");
  
      imgs.forEach(img => {
        // avoid processing the same image twice
        const parent = img.parentElement;
        if (parent && parent.classList && parent.classList.contains("img-wrapper")) return;
  
        // get filename
        const srcAttr = img.getAttribute("src") || img.src || "";
        const filename = normalize(srcAttr.split("/").pop());
  
        // match caption from JSON
        const jsonCaption = captions[filename];
  
        // If there's a small <p> directly before the image inside the same column,
        // use that as caption and remove the <p>.
        let finalCaption = jsonCaption || "";
        const prev = img.previousElementSibling;
        if (prev && prev.tagName === "P" && prev.childElementCount === 0) {
          const text = prev.textContent.trim();
          if (text.length) {
            finalCaption = text;
            prev.remove();
          }
        }
  
        if (!finalCaption) {
          // no caption found — keep whatever alt is already there, but still set alt to itself if empty
          img.alt = img.alt || "";
          return;
        }
  
        // set alt text
        img.alt = finalCaption;
  
        // wrap image and add overlay
        const wrapper = document.createElement("div");
        wrapper.className = "img-wrapper";
  
        // Move image into wrapper
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
  
        // Create overlay element
        const overlay = document.createElement("div");
        overlay.className = "img-overlay";
        overlay.innerText = finalCaption;
        wrapper.appendChild(overlay);
      });
  
    } catch (err) {
      console.error("Caption loader error:", err);
    }
  });
  