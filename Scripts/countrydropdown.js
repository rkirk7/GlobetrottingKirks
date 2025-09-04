// dropdown.js (load this once in index.html BEFORE loadpage.js)

function initCountryDropdown() {
  const container = document.querySelector('#content');
  if (!container) return;

  const dropdown = document.getElementById('countryDropdown');
  const searchInput = document.getElementById('searchInput');
  if (!dropdown || !searchInput) return;

  // clear previous list (safe re-init)
  dropdown.innerHTML = '';

  const headings = container.querySelectorAll('h2');
  if (!headings.length) return;

  let currentIndex = -1;

  // Populate dropdown with headings
  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = h.innerText.trim();
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dropdown.style.display = 'none';
      searchInput.value = '';
    });
    li.appendChild(a);
    dropdown.appendChild(li);
  });

  // Show dropdown initially
  dropdown.style.display = 'block';

  // Filter dropdown on input
  searchInput.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const items = dropdown.querySelectorAll('li');
    let anyVisible = false;
    currentIndex = -1;

    items.forEach(li => {
      const a = li.querySelector('a');
      const match = a.textContent.toLowerCase().includes(filter);
      li.style.display = match ? 'block' : 'none';
      if (match) anyVisible = true;
      a.classList.remove('active');
    });

    dropdown.style.display = anyVisible ? 'block' : 'none';
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', function (e) {
    const visibleItems = Array.from(dropdown.querySelectorAll('a'))
      .filter(a => a.parentElement.style.display !== 'none');
    if (!visibleItems.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % visibleItems.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0) visibleItems[currentIndex].click();
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }

    visibleItems.forEach((a, idx) =>
      a.classList.toggle('active', idx === currentIndex)
    );
  });

  // Click outside closes dropdown
  document.addEventListener('click', function (e) {
    if (e.target !== searchInput && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}
