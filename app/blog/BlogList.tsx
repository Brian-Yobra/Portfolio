"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PostMetadata } from "@/lib/blog";
import BlogFilters from "./BlogFilters";

export default function BlogList({ posts }: { posts: PostMetadata[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically extract unique categories from posts list
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  // Helper to count posts in categories
  const getCategoryCount = (category: string) => {
    if (category === "All") return posts.length;
    return posts.filter((p) => p.category === category).length;
  };

  // Filter posts based on active category and search query
  const filteredPosts = posts.filter((post) => {
    // 1. Category Filter
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    // 2. Search Query Filter (Title or Tags)
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    // Support searching with or without '#' for tags
    const cleanQuery = query.startsWith("#") ? query.slice(1) : query;

    const matchesTitle = post.title.toLowerCase().includes(query);
    const matchesTags = post.tags.some((tag) =>
      tag.toLowerCase().includes(cleanQuery)
    );

    return matchesCategory && (matchesTitle || matchesTags);
  });

  return (
    <div className="blog-layout-container">
      {/* Search and Category Filters on the Left */}
      <BlogFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        getCategoryCount={getCategoryCount}
      />

      {/* Main Content (Blog Cards Grid) on the Right */}
      <div className="blog-main-content">
        {filteredPosts.length === 0 ? (
          <div className="no-posts glass-card animate-fade-in animate-delay-2" style={{ textAlign: "center", padding: "var(--spacing-3xl)" }}>
            <span style={{ fontSize: "2rem" }}>📭</span>
            <h3 style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-primary)" }}>No posts found</h3>
            <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--spacing-sm)" }}>
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
                    <img src={post.coverImage} alt={post.title} />
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                )}
                
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
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
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSearchQuery(`#${tag}`);
                          setActiveCategory("All");
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
  );
}
