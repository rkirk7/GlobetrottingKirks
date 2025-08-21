async function loadPage(page) {
  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error(`Failed to load page: ${res.status}`);
    
    const content = await res.text();
    const element = document.getElementById("content");
    element.innerHTML = content;

    // Execute scripts inside the loaded content
    const scripts = element.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");

      // Copy inline code
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      // Copy src for external scripts
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false; // preserve execution order
      }

      // Replace old script with new to trigger execution
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("content").innerHTML = `<p class="text-danger">Error loading page.</p>`;
  }
}
