'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostMetadata } from '@/lib/blog';

export default function BlogList({ posts }: { posts: PostMetadata[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Dynamically extract unique categories from posts list
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  // Helper to count posts in categories
  const getCategoryCount = (category: string) => {
    if (category === 'All') return posts.length;
    return posts.filter((p) => p.category === category).length;
  };

  // Filter posts based on active category and search query
  const filteredPosts = posts.filter((post) => {
    // 1. Category Filter
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

    // 2. Search Query Filter (Title or Tags)
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    // Support searching with or without '#' for tags
    const cleanQuery = query.startsWith('#') ? query.slice(1) : query;

    const matchesTitle = post.title.toLowerCase().includes(query);
    const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));

    return matchesCategory && (matchesTitle || matchesTags);
  });

  return (
    <div className="blog-list-wrapper">
      {/* Search Input Section at the Top */}
      <div className="blog-search-wrapper animate-fade-in">
        <span className="blog-search-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          className="blog-search-input"
          placeholder="Search articles by title or #tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="blog-search-clear"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Horizontal Category Filters at the Top */}
      <div className="blog-category-filters animate-fade-in animate-delay-1">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-filter-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className="category-name">{category}</span>
            <span className="category-count-badge">{getCategoryCount(category)}</span>
          </button>
        ))}
      </div>

      <div className="blog-layout-container">
        {/* Main Content (Blog Cards Grid) */}
        <div className="blog-main-content">
        {filteredPosts.length === 0 ? (
          <div
            className="no-posts glass-card animate-fade-in animate-delay-2"
            style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto var(--spacing-sm) auto', color: 'var(--color-text-muted)', display: 'block' }}
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
            <h3 style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
              No posts found
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
              Try adjusting your search terms or picking another category tab.
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`blog-card glass-card animate-fade-in`}
                style={{ animationDelay: `${(index % 4) * 0.1}s` }}
              >
                {post.coverImage && (
                  <div className="blog-card-image">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      priority={index < 2}
                      unoptimized={post.coverImage.startsWith('http')}
                    />
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                )}

                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="blog-card-divider">•</span>
                    <span className="blog-card-reading-time">{post.readingTime}</span>
                  </div>

                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="blog-card-description">{post.description}</p>

                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag blog-tag"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSearchQuery(`#${tag}`);
                          setActiveCategory('All');
                        }}
                        title={`Filter by #${tag}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="blog-card-link">
                    Read Article <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
