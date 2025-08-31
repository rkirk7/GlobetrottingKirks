document.addEventListener('DOMContentLoaded', () => {
  const submenuToggles = document.querySelectorAll('.dropdown-item.submenu-toggle');

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default link behavior
      e.stopPropagation(); // Prevent main dropdown from closing

      const targetSelector = this.getAttribute('href');
      const target = document.querySelector(targetSelector);

      // Toggle the submenu
      const bsCollapse = bootstrap.Collapse.getInstance(target) || new bootstrap.Collapse(target, { toggle: false });
      bsCollapse.toggle();

      // Rotate this caret based on submenu state
      const icon = this.querySelector('i');
      if (target.classList.contains('show')) {
        icon.classList.add('rotate');  // will rotate 180deg
      } else {
        icon.classList.remove('rotate'); // reset if closed
      }

      // Optional: reset carets of other submenus in the same dropdown
      submenuToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          const otherTarget = document.querySelector(otherToggle.getAttribute('href'));
          const otherIcon = otherToggle.querySelector('i');
          if (otherTarget.classList.contains('show')) {
            bootstrap.Collapse.getInstance(otherTarget)?.hide();
          }
          otherIcon.classList.remove('rotate');
        }
      });
    });
  });
});
