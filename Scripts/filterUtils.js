/**
 * Reusable SPA-safe filtering utility
 *
 * HTML Requirements:
 * - Filter buttons: .filter-btn[data-filter]
 * - Items to filter: .filter-item[data-type]
 * - Optional wrapper: [data-filter-group]
 *
 * Example:
 * <div data-filter-group="cruises">
 *   <button class="filter-btn" data-filter="river"></button>
 *   <div class="filter-item" data-type="river luxury"></div>
 * </div>
 */

(function () {
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const filter = btn.dataset.filter;
    if (!filter) return;

    // Find nearest filter group (or fallback to #content)
    const group =
      btn.closest("[data-filter-group]") ||
      document.getElementById("content");

    if (!group) return;

    const buttons = group.querySelectorAll(".filter-btn");
    const items = group.querySelectorAll(".filter-item");

    // Activate button
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Filter items
    items.forEach((item) => {
      const types = item.dataset.type?.split(" ") || [];

      if (filter === "all" || types.includes(filter)) {
        item.classList.remove("is-hidden");
      } else {
        item.classList.add("is-hidden");
      }
    });
  });
})();
