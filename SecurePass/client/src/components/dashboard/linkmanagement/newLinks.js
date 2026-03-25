document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search');
  const clearSearchButton = document.getElementById('clear-search');
  const categoryList = document.getElementById('category-list');
  const categoryTitle = document.getElementById('category-title');
  const pinnedSection = document.getElementById('pinned-section');
  const pinnedContainer = pinnedSection.querySelector('.pinned-container');
  const importantLinksContainer = document
    .getElementById('important-links')
    .querySelector('.link-container');
  const themeButtons = document.querySelectorAll('.theme-btn');

  const links = Array.isArray(window.linksData) ? window.linksData : [];

  let selectedCategory = 'All';
  let pinnedUrls = new Set();

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function savePinnedLinks() {
    localStorage.setItem('pinned-links', JSON.stringify(Array.from(pinnedUrls)));
  }

  function loadPinnedLinks() {
    const saved = localStorage.getItem('pinned-links');
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        pinnedUrls = new Set(parsed);
      }
    } catch (error) {
      pinnedUrls = new Set();
    }
  }

  function normalizeCategories() {
    links.forEach((link) => {
      link.category =
        link.category && link.category.trim()
          ? link.category.trim()
          : 'Other';
    });
  }

  function getCategories() {
    const categorySet = new Set(['All']);

    links.forEach((link) => {
      if (link.category) {
        categorySet.add(link.category);
      }
    });

    const categories = Array.from(categorySet).filter(
      (category) => category !== 'All'
    );

    categories.sort((a, b) => a.localeCompare(b));

    const withoutOther = categories.filter((category) => category !== 'Other');
    const hasOther = categories.includes('Other');
    const sorted = hasOther ? [...withoutOther, 'Other'] : withoutOther;

    return ['All', ...sorted];
  }

  function displayLinks() {
    const filteredLinks = filterLinksByCategory(
      selectedCategory,
      searchInput.value
    );
    const pinnedLinks = filteredLinks.filter((link) => pinnedUrls.has(link.url));
    const regularLinks = filteredLinks.filter(
      (link) => !pinnedUrls.has(link.url)
    );

    renderPinnedSection(pinnedLinks);

    if (regularLinks.length === 0) {
      if (pinnedLinks.length > 0) {
        importantLinksContainer.innerHTML = '';
        return;
      }

      importantLinksContainer.innerHTML =
        '<div class="no-results">No Result for your search</div>';
      return;
    }

    importantLinksContainer.innerHTML = regularLinks
      .map(createLinkCard)
      .join('');
  }

  function renderPinnedSection(pinnedLinks) {
    if (pinnedLinks.length === 0) {
      pinnedSection.classList.add('hidden');
      pinnedContainer.innerHTML = '';
      return;
    }

    pinnedSection.classList.remove('hidden');
    pinnedContainer.innerHTML = pinnedLinks
      .map(
        (link) => `
        <div class="pinned-card" data-url="${escapeHtml(link.url)}">
          <div class="pinned-name" title="${escapeHtml(link.name)}">${escapeHtml(link.name)}</div>
          <button class="icon-btn unpin-btn" type="button" data-action="unpin" aria-label="Unpin link" title="Unpin">★</button>
        </div>
      `
      )
      .join('');
  }

  function createCategories() {
    categoryList.innerHTML = '';

    getCategories().forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `category-btn${
        category === selectedCategory ? ' active' : ''
      }`;
      button.textContent = category;
      button.addEventListener('click', () => setCategory(category));
      categoryList.appendChild(button);
    });
  }

  function setCategory(category) {
    selectedCategory = category;
    updateActiveCategory();
    updateCategoryTitle();
    displayLinks();
  }

  function updateCategoryTitle() {
    categoryTitle.textContent =
      selectedCategory === 'All'
        ? 'All Links'
        : `${selectedCategory} Links`;
  }

  function applyTheme(theme) {
    if (theme === 'teal') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    themeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    localStorage.setItem('links-theme', theme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('links-theme') || 'teal';
    applyTheme(savedTheme);
  }

  function updateActiveCategory() {
    const buttons = categoryList.querySelectorAll('.category-btn');
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.textContent === selectedCategory);
    });
  }

  function createLinkCard(link) {
    const descriptionText =
      link.description && link.description.trim()
        ? link.description.trim()
        : 'No Description';
    const isPinned = pinnedUrls.has(link.url);

    return `
      <div class="link-card" data-title="${escapeHtml(link.name)}" data-url="${escapeHtml(link.url)}">
        <div class="card-content">
          <div class="card-title">${escapeHtml(link.name)}</div>
          <div class="card-desc">${escapeHtml(descriptionText)}</div>
          <div class="card-url">${escapeHtml(link.url)}</div>
        </div>
        <div class="card-actions">
          <button class="icon-btn pin-btn ${isPinned ? 'is-pinned' : ''}" type="button" data-action="pin" aria-label="${
            isPinned ? 'Unpin Link' : 'Pin Link'
          }" title="${isPinned ? 'Unpin' : 'Pin'}">★</button>
          <button class="icon-btn copy-btn" type="button" data-action="copy" aria-label="Copy Link" title="Copy Link">📋</button>
          <button class="icon-btn edit-btn" type="button" data-action="edit" aria-label="Edit Link" title="Edit Link">✎</button>
        </div>
      </div>
    `;
  }

  function filterLinksByCategory(category, query) {
    const lowerQuery = query.trim().toLowerCase();
    let filtered = links;

    if (category !== 'All') {
      filtered = links.filter((link) => link.category === category);
    }

    if (lowerQuery) {
      filtered = filtered.filter((link) =>
        link.name.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  importantLinksContainer.addEventListener('click', function (event) {
    const iconButton = event.target.closest('.icon-btn');

    if (iconButton) {
      event.stopPropagation();

      const card = iconButton.closest('.link-card');
      const url = card ? card.getAttribute('data-url') : '';

      if (iconButton.dataset.action === 'pin' && url) {
        if (pinnedUrls.has(url)) {
          pinnedUrls.delete(url);
        } else {
          pinnedUrls.add(url);
        }

        savePinnedLinks();
        displayLinks();
        return;
      }

      if (iconButton.dataset.action === 'copy' && url) {
        copyToClipboard(url);
        return;
      }

      return;
    }

    const linkElement = event.target.closest('.link-card');
    if (!linkElement) {
      return;
    }

    const url = linkElement.getAttribute('data-url');
    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener');
  });

  pinnedContainer.addEventListener('click', function (event) {
    const button = event.target.closest('.icon-btn');

    if (button && button.dataset.action === 'unpin') {
      const card = button.closest('.pinned-card');
      const url = card ? card.getAttribute('data-url') : '';

      if (!url) {
        return;
      }

      pinnedUrls.delete(url);
      savePinnedLinks();
      displayLinks();
      return;
    }

    const card = event.target.closest('.pinned-card');
    if (!card) {
      return;
    }

    const url = card.getAttribute('data-url');
    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener');
  });

  searchInput.addEventListener('input', () => {
    displayLinks();
    clearSearchButton.style.display = searchInput.value.trim()
      ? 'block'
      : 'none';
  });

  clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchButton.style.display = 'none';
    displayLinks();
    searchInput.focus();
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });

  normalizeCategories();
  loadPinnedLinks();
  createCategories();
  updateCategoryTitle();
  initTheme();
  displayLinks();
});