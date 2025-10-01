// linkmanager.jsx
import React, { useEffect, useRef } from "react";
import "./LinkManager.css";
import { uid, escapeHtml, escapeAttr, db } from "./utils.js"; // removed getSwatchesForTheme
import { ui } from "./popup.js";
import { useNotification } from "../notifications/NotificationProvider.jsx";

/**
 * LinkManager React Component
 * - Inherits application theme from main.css (no local theme picker)
 * - styles.css contains only LinkManager layout/structure
 */
const LinkManager = ({ idPrefix = "lm" }) => {
  const rootRef = useRef(null);
  const id = (suffix) => `${idPrefix}-${suffix}`;
  const { notify, confirm } = useNotification();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = (id) => root.querySelector(`#${idPrefix}-${id}`);

    // ------------------------------
    // Local Storage "DB"
    // ------------------------------
    const state = {
      categories: [],
      links: [],
      selectedCategoryId: "all",
      editingLinkId: null,
    };

    // ------------------------------
    // Elements (scoped)
    // ------------------------------
    const categoryListEl = $("categoryList");
    const addCategoryForm = $("addCategoryForm");
    const newCategoryNameEl = $("newCategoryName");

    const searchLinkEl = $("searchLink");

    const currentCategoryTitleEl = $("currentCategoryTitle");
    const linkCountEl = $("linkCount");
    const cardsEl = $("cards");

    const addLinkBtn = $("addLinkBtn");
    const editCategoryBtn = $("editCategoryBtn");

    const linkDialog = $("linkDialog");
    const linkDialogTitle = $("linkDialogTitle");
    const linkForm = $("linkForm");
    const linkNameEl = $("linkName");
    const linkUrlEl = $("linkUrl");
    const linkDescEl = $("linkDesc");

    const categoryDialog = $("categoryDialog");
    const renameCategoryInput = $("renameCategoryInput");
    const deleteCategoryBtn = $("deleteCategoryBtn");
    const saveCategoryBtn = $("saveCategoryBtn");
    const cancelLinkBtn = $("cancelLinkBtn");
    const saveLinkBtn = $("saveLinkBtn");

    // ------------------------------
    // Init
    // ------------------------------
    function ensureSeed() {
      const { categories, links, selectedCategoryId } = db.load();
      if (categories.length === 0 && links.length === 0) {
        const catDev = { id: uid(), name: "Development" };
        const catNews = { id: uid(), name: "News" };
        const catShopping = { id: uid(), name: "Shopping" };
        const seedLinks = [
          { id: uid(), categoryId: catDev.id, name: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "Canonical docs for the web platform", createdAt: Date.now() },
          { id: uid(), categoryId: catDev.id, name: "Stack Overflow", url: "https://stackoverflow.com/", desc: "Q&A for programmers", createdAt: Date.now() },
          { id: uid(), categoryId: catNews.id, name: "Hacker News", url: "https://news.ycombinator.com/", desc: "Tech news & discussions", createdAt: Date.now() },
          { id: uid(), categoryId: catShopping.id, name: "Amazon", url: "https://amazon.com", desc: "", createdAt: Date.now() },
        ];
        db.save({ categories: [catDev, catNews, catShopping], links: seedLinks, selectedCategoryId: "all" });
      } else {
        db.save({ categories, links, selectedCategoryId });
      }
    }

    function loadState() {
      const { categories, links, selectedCategoryId } = db.load();
      state.categories = categories;
      state.links = links;
      state.selectedCategoryId = selectedCategoryId || "all";
    }

    // ------------------------------
    // Render
    // ------------------------------
    function render() {
      renderCategories();
      renderCards();
      renderHeader();
    }

    function renderCards(linksOverride) {
      if (!cardsEl) return;
      cardsEl.innerHTML = "";
      const links = Array.isArray(linksOverride) ? linksOverride : filteredLinks();
      if (links.length === 0) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = "No links yet.";
        cardsEl.appendChild(empty);
        if (linkCountEl) linkCountEl.textContent = "0";
        return;
      }
      links.forEach((link) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <h4>${escapeHtml(link.name)}</h4>
          <p>${escapeHtml(link.desc || "")}</p>
          <p>${escapeHtml(link.url || "")}</p>
          <div class="card-actions">
            <button class="mini edit" data-action="edit" aria-label="Edit ${escapeAttr(link.name)}">Edit</button>
            <button class="mini delete" data-action="delete" aria-label="Delete ${escapeAttr(link.name)}">Delete</button>
          </div>
        `;
        card.addEventListener("click", (e) => {
          if (!e.target.closest("button")) {
            window.open(link.url, "_blank", "noopener,noreferrer");
          }
        });
        const editBtn = card.querySelector('[data-action="edit"]');
        const delBtn = card.querySelector('[data-action="delete"]');
        if (editBtn) editBtn.addEventListener("click", (e) => { e.stopPropagation(); openEditLink(link.id); });
        if (delBtn) delBtn.addEventListener("click", async (e) => { e.stopPropagation(); await deleteLink(link.id); });
        cardsEl.appendChild(card);
      });
      if (linkCountEl) linkCountEl.textContent = String(links.length);
    }

    function renderCategories() {
      if (!categoryListEl) return;
      categoryListEl.innerHTML = "";
      const allItem = document.createElement("div");
      allItem.className = "category-item" + (state.selectedCategoryId === "all" ? " active" : "");
      allItem.tabIndex = 0;
      allItem.innerHTML = `
        <span class="name">All Links</span>
        <span class="count">${state.links.length}</span>
      `;
      allItem.addEventListener("click", () => selectCategory("all"));
      categoryListEl.appendChild(allItem);

      state.categories.forEach((cat) => {
        const count = state.links.filter((l) => l.categoryId === cat.id).length;
        const item = document.createElement("div");
        item.className = "category-item" + (state.selectedCategoryId === cat.id ? " active" : "");
        item.tabIndex = 0;
        item.dataset.id = cat.id;
        item.innerHTML = `
          <span class="name">${escapeHtml(cat.name)}</span>
          <span class="count">${count}</span>
        `;
        item.addEventListener("click", () => selectCategory(cat.id));

        const remove = document.createElement("button");
        remove.className = "icon-btn trash-btn";
        remove.type = "button";
        remove.setAttribute("aria-label", `Delete category ${cat.name}`);
        remove.title = "Delete category";
        remove.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4V5h4V4a1 1 0 0 1 1-1zm2 2v0h2V5h-2zM7 7v12h10V7H7zm3 2h2v8h-2V9zm4 0h2v8h-2V9z" fill="currentColor"/>
          </svg>
        `;
        remove.addEventListener("click", async (e) => {
          e.stopPropagation();
          const cnt = state.links.filter((l) => l.categoryId === cat.id).length;
          const ok = await ui.confirmDelete(cat.name, `${cnt} link(s)`);
          if (!ok) return;
          state.links = state.links.filter((l) => l.categoryId !== cat.id);
          state.categories = state.categories.filter((c) => c.id !== cat.id);
          if (state.selectedCategoryId === cat.id) state.selectedCategoryId = "all";
          persist();
          render();
        });
        item.appendChild(remove);
        categoryListEl.appendChild(item);
      });
    }

    function renderHeader() {
      if (!currentCategoryTitleEl || !editCategoryBtn) return;
      if (state.selectedCategoryId === "all") {
        currentCategoryTitleEl.textContent = "All Links";
        editCategoryBtn.disabled = true;
        editCategoryBtn.title = "Select a category to rename/delete";
      } else {
        const cat = state.categories.find((c) => c.id === state.selectedCategoryId);
        currentCategoryTitleEl.textContent = cat ? cat.name : "Unknown";
        editCategoryBtn.disabled = false;
        editCategoryBtn.title = "Rename/Delete current category";
      }
    }

    // ------------------------------
    // Helpers
    // ------------------------------
    function filteredLinks() {
      if (state.selectedCategoryId === "all") {
        return [...state.links].sort((a, b) => b.createdAt - a.createdAt);
      }
      return state.links
        .filter((l) => l.categoryId === state.selectedCategoryId)
        .sort((a, b) => b.createdAt - a.createdAt);
    }

    function selectCategory(id) {
      state.selectedCategoryId = id;
      persist();
      render();
    }

    function persist() {
      db.save({
        categories: state.categories,
        links: state.links,
        selectedCategoryId: state.selectedCategoryId,
      });
    }

    // ------------------------------
    // Category CRUD
    // ------------------------------
    const onAddCategory = async (e) => {
      e.preventDefault();
      const name = newCategoryNameEl.value.trim();
      if (!name) return;
      const exists = state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
      if (exists) { await ui.error("Category already exists."); return; }
      const cat = { id: uid(), name };
      state.categories.push(cat);
      newCategoryNameEl.value = "";
      selectCategory(cat.id);
    };

    const onSearch = () => {
      const q = (searchLinkEl?.value || "").trim().toLowerCase();
      if (!q) { render(); return; }
      const pool = filteredLinks();
      const filtered = pool.filter((l) => {
        const name = (l.name || "").toLowerCase();
        const desc = (l.desc || "").toLowerCase();
        const url = (l.url || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || url.includes(q);
      });
      renderCards(filtered);
    };

    const onEditCategory = () => {
      if (state.selectedCategoryId === "all") return;
      const cat = state.categories.find((c) => c.id === state.selectedCategoryId);
      if (!cat) return;
      renameCategoryInput.value = cat.name;
      categoryDialog.showModal();
    };

    const onSaveCategory = async () => {
      if (state.selectedCategoryId === "all") return;
      const cat = state.categories.find((c) => c.id === state.selectedCategoryId);
      if (!cat) return;
      const name = renameCategoryInput.value.trim();
      if (!name) return;
      const exists = state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== cat.id);
      if (exists) { await ui.error("Another category with that name exists."); return; }
      cat.name = name;
      persist();
      render();
    };

    const onDeleteCategory = async () => {
      if (state.selectedCategoryId === "all") return;
      const cat = state.categories.find((c) => c.id === state.selectedCategoryId);
      if (!cat) return;
      const count = state.links.filter((l) => l.categoryId === cat.id).length;
      const ok = await ui.confirmDelete(cat.name, `${count} link(s)`);
      if (!ok) return;
      state.links = state.links.filter((l) => l.categoryId !== cat.id);
      state.categories = state.categories.filter((c) => c.id !== cat.id);
      state.selectedCategoryId = "all";
      persist();
      render();
      categoryDialog.close();
    };

    // ------------------------------
    // Link CRUD
    // ------------------------------
    const onOpenAddLink = () => {
      state.editingLinkId = null;
      linkDialogTitle.textContent = "Add Link";
      linkNameEl.value = "";
      linkUrlEl.value = "";
      linkDescEl.value = "";
      linkDialog.showModal();
    };

    const openEditLink = (linkId) => {
      const link = state.links.find((l) => l.id === linkId);
      if (!link) return;
      state.editingLinkId = linkId;
      linkDialogTitle.textContent = "Edit Link";
      linkNameEl.value = link.name;
      linkUrlEl.value = link.url;
      linkDescEl.value = link.desc || "";
      linkDialog.showModal();
    };

    const onSaveLink = async () => {
      const name = linkNameEl.value.trim();
      const url = linkUrlEl.value.trim();
      const desc = linkDescEl.value.trim();
      if (!name || !url) { await ui.info("Please enter both a name and a URL."); return; }
      const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      if (state.editingLinkId) {
        const link = state.links.find((l) => l.id === state.editingLinkId);
        if (!link) return;
        link.name = name;
        link.url = normalizedUrl;
        link.desc = desc;
      } else {
        if (state.selectedCategoryId === "all") { await ui.info("Please select a category on the left before adding a link."); return; }
        state.links.push({ id: uid(), categoryId: state.selectedCategoryId, name, url: normalizedUrl, desc, createdAt: Date.now() });
      }
      persist();
      render();
      linkDialog.close();
    };

    const deleteLink = async (linkId) => {
      const link = state.links.find((l) => l.id === linkId);
      if (!link) return;
      const ok = await ui.confirmDelete(link.name);
      if (!ok) return;
      state.links = state.links.filter((l) => l.id !== linkId);
      persist();
      render();
    };

    // ------------------------------
    // Wire events
    // ------------------------------
    addCategoryForm?.addEventListener("submit", onAddCategory);
    searchLinkEl?.addEventListener("input", onSearch);
    editCategoryBtn?.addEventListener("click", onEditCategory);
    saveCategoryBtn?.addEventListener("click", onSaveCategory);
    deleteCategoryBtn?.addEventListener("click", onDeleteCategory);
    addLinkBtn?.addEventListener("click", onOpenAddLink);
    linkForm?.addEventListener("submit", (e) => e.preventDefault());
    cancelLinkBtn?.addEventListener("click", () => linkDialog.close());
    saveLinkBtn?.addEventListener("click", onSaveLink);

    // Boot
    ensureSeed();
    loadState();
    render();

    // Cleanup
    return () => {
      addCategoryForm?.removeEventListener("submit", onAddCategory);
      searchLinkEl?.removeEventListener("input", onSearch);
      editCategoryBtn?.removeEventListener("click", onEditCategory);
      saveCategoryBtn?.removeEventListener("click", onSaveCategory);
      deleteCategoryBtn?.removeEventListener("click", onDeleteCategory);
      addLinkBtn?.removeEventListener("click", onOpenAddLink);
      linkForm?.removeEventListener("submit", (e) => e.preventDefault());
      cancelLinkBtn?.removeEventListener("click", () => linkDialog.close());
      saveLinkBtn?.removeEventListener("click", onSaveLink);
    };
  }, [idPrefix]);

  return (
    <div className="lm">
      <div ref={rootRef} className="lm-app">
        {/* Sidebar */}
        <aside className="sidebar">
          <header className="sidebar-header">
            <h1>Categories</h1>
            {/* Theme picker removed; inherits from app */}
          </header>

          <nav id={id("categoryList")} className="category-list" aria-label="Categories"></nav>

          <form id={id("addCategoryForm")} className="control add-form" autoComplete="off">
            <input id={id("newCategoryName")} type="text" placeholder="New category…" required />
            <button type="submit" className="btn">Add</button>
          </form>
        </aside>

        {/* Main */}
        <main className="main">
          <header className="main-header">
            <div className="title-group">
              <h2 id={id("currentCategoryTitle")}>All Links</h2>
              <span id={id("linkCount")} className="muted"></span>
            </div>

            <div className="actions">
               <input id={id("searchLink")} type="search" placeholder="Search links…" />
              <button id={id("addLinkBtn")} className="btn">+ Add Link</button>
              <button id={id("editCategoryBtn")} className="btn" title="Rename/Delete current category">Edit Category…</button>
             
            </div>
          </header>

          <section id={id("cards")} className="cards" aria-live="polite"></section>
        </main>

        {/* Add/Edit Link Dialog */}
        <dialog id={id("linkDialog")}>
          <form id={id("linkForm")} method="dialog">
            <h3 id={id("linkDialogTitle")}>Add Link</h3>
            <label>
              Link name
              <input id={id("linkName")} type="text" required />
            </label>
            <label>
              URL
              <input id={id("linkUrl")} type="url" placeholder="https://…" required />
            </label>
            <label>
              Description
              <textarea id={id("linkDesc")} rows="3" placeholder="Optional"></textarea>
            </label>
            <menu className="dialog-actions">
              <button id={id("cancelLinkBtn")} value="cancel" className="btn" type="button">Cancel</button>
              <button id={id("saveLinkBtn")} value="confirm" className="btn" type="button">Save</button>
            </menu>
          </form>
        </dialog>

        {/* Category Options Dialog */}
        <dialog id={id("categoryDialog")}>
          <form id={id("categoryForm")} method="dialog">
            <h3>Category Options</h3>
            <label>
              Rename category
              <input id={id("renameCategoryInput")} type="text" />
            </label>
            <div className="danger-zone">
              <p className="muted">Deleting a category will also delete its links.</p>
              <button id={id("deleteCategoryBtn")} className="btn" type="button">Delete Category</button>
            </div>
            <menu className="dialog-actions">
              <button value="cancel" className="btn" type="button">Close</button>
              <button id={id("saveCategoryBtn")} value="confirm" className="btn" type="button">Save Name</button>
            </menu>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default LinkManager;
