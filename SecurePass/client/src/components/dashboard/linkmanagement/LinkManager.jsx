import React, { useEffect, useMemo, useState } from "react";
import "./newLinks.css";

const linksData = [
  { category: "Glass", name: "Glass Releases", url: "https://example.com/glass-releases", description: "Glass release links" },
  { category: "Glass", name: "Glass Issues", url: "https://example.com/glass-issues", description: "Glass issue tracking" },
  { category: "Octane", name: "Octane Home Page", url: "https://example.com/octane", description: "Open octane home page" },
  { category: "Octane", name: "Octane Tests", url: "https://example.com/octane-tests", description: "Octane test page" },
  { category: "QTest", name: "QTest Home Page", url: "https://example.com/qtest", description: "QTest portal" },
  { category: "Meeting", name: "Fahim Webex", url: "https://example.com/fahim-webex", description: "Meeting room" },
  { category: "Other", name: "Tech Self Service", url: "https://example.com/self-service", description: "Tech self service portal" },
];

const LinkManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [pinnedUrls, setPinnedUrls] = useState(new Set());

  const normalizedLinks = useMemo(() => {
    return linksData.map((link) => ({
      ...link,
      category:
        link.category && String(link.category).trim()
          ? String(link.category).trim()
          : "Other",
      description:
        link.description && String(link.description).trim()
          ? String(link.description).trim()
          : "No Description",
    }));
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set(["All"]);

    normalizedLinks.forEach((link) => {
      if (link.category) categorySet.add(link.category);
    });

    const allCategories = Array.from(categorySet).filter((c) => c !== "All");
    allCategories.sort((a, b) => a.localeCompare(b));

    const withoutOther = allCategories.filter((c) => c !== "Other");
    const hasOther = allCategories.includes("Other");

    return ["All", ...(hasOther ? [...withoutOther, "Other"] : withoutOther)];
  }, [normalizedLinks]);

  const filteredLinks = useMemo(() => {
    let filtered = normalizedLinks;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((link) => link.category === selectedCategory);
    }

    const lowerQuery = search.trim().toLowerCase();
    if (lowerQuery) {
      filtered = filtered.filter((link) =>
        link.name.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [normalizedLinks, selectedCategory, search]);

  const pinnedLinks = useMemo(
    () => filteredLinks.filter((link) => pinnedUrls.has(link.url)),
    [filteredLinks, pinnedUrls]
  );

  const regularLinks = useMemo(
    () => filteredLinks.filter((link) => !pinnedUrls.has(link.url)),
    [filteredLinks, pinnedUrls]
  );

  useEffect(() => {
    const savedPinned = localStorage.getItem("pinned-links");
    if (!savedPinned) return;

    try {
      const parsed = JSON.parse(savedPinned);
      if (Array.isArray(parsed)) {
        setPinnedUrls(new Set(parsed));
      }
    } catch {
      setPinnedUrls(new Set());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pinned-links", JSON.stringify(Array.from(pinnedUrls)));
  }, [pinnedUrls]);

  const togglePin = (url) => {
    setPinnedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const openLink = (url) => {
    window.open(url, "_blank", "noopener");
  };

  const title =
    selectedCategory === "All" ? "All Links" : `${selectedCategory} Links`;

  return (
    <div className="link-manager">
      <div className="container">
        <aside id="links-panel">
          <h3 className="panel-title">Categories</h3>

          <div id="category-list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-btn ${category === selectedCategory ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <div className="content-container">
          <div className="page-header">
            <h2 id="category-title">{title}</h2>
          </div>

          <div className="app-box">
            <main id="important-links">
              <div id="title-bar">
                <div className="search-wrapper">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search selected category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button
                    type="button"
                    id="clear-search"
                    aria-label="Clear search"
                    title="Clear"
                    onClick={() => setSearch("")}
                    style={{ display: search.trim() ? "block" : "none" }}
                  >
                    ×
                  </button>
                </div>

                <hr className="search-divider" />
              </div>

              <section
                id="pinned-section"
                className={`pinned-section ${pinnedLinks.length === 0 ? "hidden" : ""}`}
                aria-label="Pinned links"
              >
                <div className="pinned-container">
                  {pinnedLinks.map((link) => (
                    <div
                      key={link.url}
                      className="pinned-card"
                      onClick={() => openLink(link.url)}
                    >
                      <div className="pinned-name" title={link.name}>
                        {link.name}
                      </div>

                      <button
                        className="icon-btn unpin-btn"
                        type="button"
                        aria-label="Unpin link"
                        title="Unpin"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(link.url);
                        }}
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>

                <hr className="pinned-divider" />
              </section>

              <div className="link-container">
                {regularLinks.length === 0 && pinnedLinks.length === 0 ? (
                  <div className="no-results">No Result for your search</div>
                ) : (
                  regularLinks.map((link) => {
                    const isPinned = pinnedUrls.has(link.url);

                    return (
                      <div key={link.url} className="link-card">
                        <div
                          className="card-content"
                          onClick={() => openLink(link.url)}
                        >
                          <div className="card-title">{link.name}</div>
                          <div className="card-desc">{link.description}</div>
                          <div className="card-url">{link.url}</div>
                        </div>

                        <div className="card-actions">
                          <button
                            className={`icon-btn pin-btn ${isPinned ? "is-pinned" : ""}`}
                            type="button"
                            aria-label={isPinned ? "Unpin Link" : "Pin Link"}
                            title={isPinned ? "Unpin" : "Pin"}
                            onClick={() => togglePin(link.url)}
                          >
                            ★
                          </button>

                          <button
                            className="icon-btn copy-btn"
                            type="button"
                            aria-label="Copy Link"
                            title="Copy Link"
                            onClick={() => copyToClipboard(link.url)}
                          >
                            📋
                          </button>

                          <button
                            className="icon-btn edit-btn"
                            type="button"
                            aria-label="Edit Link"
                            title="Edit Link"
                            onClick={() => console.log("Edit clicked for:", link)}
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="footer-credit">Muhamad Fahim</div>
    </div>
  );
};

export default LinkManager;