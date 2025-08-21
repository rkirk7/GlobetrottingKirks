document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navbar .nav-link");

  function setActiveLink() {
    const hash = window.location.hash || "#home.html";

    links.forEach(link => {
      // Remove previous active
      link.classList.remove("active");

      // Check if the link href matches the current hash
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      }
    });
  }

  // Initial highlight
  setActiveLink();

  // Update highlight on hash change (when clicking navbar links)
  window.addEventListener("hashchange", setActiveLink);
});
