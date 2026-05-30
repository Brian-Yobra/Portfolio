'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { PostMetadata } from '@/lib/blog';
import { deletePost } from './actions';

interface AdminBlogTableProps {
  posts: PostMetadata[];
}

export default function AdminBlogTable({ posts: initialPosts }: AdminBlogTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = (slug: string) => {
    setConfirmSlug(slug);
  };

  const handleDeleteCancel = () => {
    setConfirmSlug(null);
  };

  const handleDeleteExecute = (slug: string) => {
    setDeletingSlug(slug);
    setError(null);
    startTransition(async () => {
      const result = await deletePost(slug);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setConfirmSlug(null);
      } else {
        setError(result.error ?? 'Delete failed.');
      }
      setDeletingSlug(null);
    });
  };

  return (
    <div className="admin-table-wrapper">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">
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
            id="admin-blog-search"
            type="text"
            className="form-input admin-search-input"
            placeholder="Search posts by title, category, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="admin-search-clear"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <Link href="/blog/new" className="btn btn-primary admin-new-btn">
          <span>＋</span> New Post
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert-box alert-caution" style={{ marginBottom: 'var(--spacing-md)' }}>
          <div className="alert-header">
            <span className="alert-icon">
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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
            <span className="alert-title">Error</span>
          </div>
          <div className="alert-body">{error}</div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="admin-stats-bar">
        <span className="admin-stats-item">
          <span className="admin-stats-value">{posts.length}</span> total posts
        </span>
        {search && (
          <span className="admin-stats-item">
            <span className="admin-stats-value">{filtered.length}</span> results for &quot;{search}&quot;
          </span>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="admin-empty glass-card">
          <span className="admin-empty-icon">
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
          </span>
          <h3>No posts found</h3>
          <p>Try a different search term, or{' '}
            <Link href="/blog/new" className="admin-empty-link">create a new post</Link>.
          </p>
        </div>
      ) : (
        <div className="admin-blog-list">
          {filtered.map((post, index) => (
            <div
              key={post.slug}
              className="admin-blog-row glass-card animate-fade-in"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Left: Meta */}
              <div className="admin-row-meta">
                <span className="admin-row-category category-badge primary">{post.category}</span>
                <span className="admin-row-date">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="admin-row-reading-time">{post.readingTime}</span>
              </div>

              {/* Center: Title + Description */}
              <div className="admin-row-content">
                <h3 className="admin-row-title">
                  <Link href={`/blog/${post.slug}`} className="admin-row-title-link">
                    {post.title}
                  </Link>
                </h3>
                <p className="admin-row-description">{post.description}</p>
                <div className="admin-row-tags">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag blog-tag">#{tag}</span>
                  ))}
                  {post.tags.length > 4 && (
                    <span className="tag blog-tag">+{post.tags.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="admin-row-actions">
                <Link
                  href={`/blog/${post.slug}`}
                  className="admin-action-btn admin-action-view"
                  title="View Post"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '6px' }}
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg> View
                </Link>
                <Link
                  href={`/blog/${post.slug}/edit`}
                  className="admin-action-btn admin-action-edit"
                  title="Edit Post"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '6px' }}
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                  </svg> Edit
                </Link>

                {confirmSlug === post.slug ? (
                  <div className="admin-confirm-row">
                    <span className="admin-confirm-text">Delete?</span>
                    <button
                      className="admin-action-btn admin-action-delete-confirm"
                      onClick={() => handleDeleteExecute(post.slug)}
                      disabled={deletingSlug === post.slug || isPending}
                    >
                      {deletingSlug === post.slug ? '…' : 'Yes'}
                    </button>
                    <button
                      className="admin-action-btn admin-action-cancel"
                      onClick={handleDeleteCancel}
                      disabled={isPending}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    className="admin-action-btn admin-action-delete"
                    onClick={() => handleDeleteConfirm(post.slug)}
                    title="Delete Post"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: '6px' }}
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
