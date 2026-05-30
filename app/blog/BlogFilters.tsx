"use client";

import React from "react";

interface BlogFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  getCategoryCount: (category: string) => number;
}

export default function BlogFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  getCategoryCount,
}: BlogFiltersProps) {
  return (
    <aside className="blog-sidebar glass-card animate-fade-in animate-delay-1">
      {/* Search Input Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Search</h4>
        <div className="search-bar-wrapper" style={{ position: "relative", width: "100%" }}>
          <span 
            className="search-icon" 
            style={{ 
              position: "absolute", 
              left: "var(--spacing-md)", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--color-text-muted)",
              pointerEvents: "none"
            }}
          >
            🔍
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Title or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: "100%", 
              paddingLeft: "2.75rem",
              background: "var(--color-bg-glass)",
              borderRadius: "var(--radius-full)"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "var(--spacing-md)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                fontSize: "1.1rem"
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Section */}
      <div className="sidebar-section" style={{ marginTop: "var(--spacing-md)" }}>
        <h4 className="sidebar-section-title">Categories</h4>
        <div className="sidebar-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`sidebar-category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="category-name">{category}</span>
              <span className="category-count">{getCategoryCount(category)}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
