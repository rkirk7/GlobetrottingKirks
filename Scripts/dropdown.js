document.addEventListener("DOMContentLoaded", () => {
  // Stop dropdown from closing when clicking submenu toggles
  document.querySelectorAll(".submenu-toggle").forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.stopPropagation(); // keep dropdown open
    });
  });

  // Rotate carets on submenu expand/collapse
  document.querySelectorAll(".dropdown-menu .collapse").forEach(submenu => {
    submenu.addEventListener("shown.bs.collapse", function () {
      const toggle = document.querySelector(`[href="#${this.id}"] i.bi-caret-down-fill`);
      if (toggle) toggle.classList.add("rotate");
    });

    submenu.addEventListener("hidden.bs.collapse", function () {
      const toggle = document.querySelector(`[href="#${this.id}"] i.bi-caret-down-fill`);
      if (toggle) toggle.classList.remove("rotate");
    });
  });

  // Regular links will still close the dropdown normally
});
