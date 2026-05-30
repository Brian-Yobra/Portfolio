'use client';

import React from 'react';

interface BlogFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  getCategoryCount: (category: string) => number;
}

export default function BlogFilters({
  activeCategory,
  setActiveCategory,
  categories,
  getCategoryCount,
}: BlogFiltersProps) {
  return (
    <aside className="blog-sidebar glass-card animate-fade-in animate-delay-1">
      {/* Categories Filter Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Categories</h4>
        <div className="sidebar-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`sidebar-category-btn ${activeCategory === category ? 'active' : ''}`}
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
