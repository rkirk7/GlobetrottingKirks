document.addEventListener("DOMContentLoaded", () => {
  // Stop dropdown from closing when clicking submenu toggles
  document.querySelectorAll(".submenu-toggle").forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.stopPropagation(); // keep dropdown open for submenu headers
    });
  });

  // Close dropdown on normal links after loadPage runs
  document.querySelectorAll(".dropdown-menu a.dropdown-item:not(.submenu-toggle)").forEach(link => {
    link.addEventListener("click", e => {
      const dropdownMenu = e.target.closest(".dropdown-menu");
      const parentDropdown = dropdownMenu?.closest(".dropdown");
      if (parentDropdown) {
        const dropdownToggle = parentDropdown.querySelector('[data-bs-toggle="dropdown"]');
        if (dropdownToggle) {
          const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle) || new bootstrap.Dropdown(dropdownToggle);
          bsDropdown.hide(); // close menu after link click
        }
      }
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
});
