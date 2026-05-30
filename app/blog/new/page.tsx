"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitBlogPost } from "./actions";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to generate slug preview from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    
    // Auto-generate slug preview
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanSlug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-");
    setSlug(cleanSlug);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Explicitly set the finalized slug
    formData.set("slug", slug);

    try {
      await submitBlogPost(formData);
    } catch (err: any) {
      if (err && (err.message === "NEXT_REDIRECT" || err.digest?.startsWith("NEXT_REDIRECT"))) {
        throw err;
      }
      console.error(err);
      setError(err?.message || "Something went wrong while saving your post.");
      setIsPending(false);
    }
  };

  return (
    <div className="new-post-page container">
      <div className="blog-post-back-nav">
        <Link href="/blog" className="back-link">
          <span>←</span> Back to Blog
        </Link>
      </div>

      <div className="blog-header animate-fade-in">
        <span className="section-label">Creator Studio</span>
        <h1 className="blog-title">Add New Post</h1>
        <p className="blog-subtitle">
          Write and publish articles with full Markdown styling, custom code highlight blocks, and colored alert boxes.
        </p>
      </div>

      <div className="contact-form-section glass-card animate-fade-in animate-delay-1" style={{ maxWidth: "800px", margin: "0 auto var(--spacing-3xl)" }}>
        <form onSubmit={handleSubmit} className="contact-form">
          {error && (
            <div className="alert-box alert-caution" style={{ margin: "0 0 var(--spacing-md)" }}>
              <div className="alert-header">
                <span className="alert-icon">🔥</span>
                <span className="alert-title">Submission Error</span>
              </div>
              <div className="alert-body">{error}</div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="e.g. Building micro-frontends with React"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug" className="form-label">
              Slug (URL Address)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="form-input"
              placeholder="e.g. building-microfrontends-with-react"
              value={slug}
              onChange={handleSlugChange}
            />
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Preview: <strong>/blog/{slug || "your-slug"}</strong>
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Short Description / Excerpt
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-input"
              placeholder="A brief summary showing up on the card listing..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form-input"
              style={{ background: "var(--color-bg-secondary)", appearance: "none" }}
              required
            >
              <option value="Web Dev">Web Dev</option>
              <option value="Tools">Tools</option>
              <option value="Database">Database</option>
              <option value="Architecture">Architecture</option>
              <option value="Tutorial">Tutorial</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="form-input"
              placeholder="React, CSS, Postgres, SQL (no '#' symbol needed)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage" className="form-label">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              className="form-input"
              placeholder="e.g. /blog/nextjs_portfolio.png or https://example.com/cover.png"
            />
          </div>

          <div className="form-group">
            <label htmlFor="readingTime" className="form-label">
              Estimated Reading Time (Optional)
            </label>
            <input
              type="text"
              id="readingTime"
              name="readingTime"
              className="form-input"
              placeholder="e.g. 5 min read"
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="content" className="form-label">
                Content (Markdown Format)
              </label>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-accent-primary)" }}>
                Supports standard MD, inline codes, code blocks &amp; GitHub alerts
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              className="form-textarea"
              placeholder="# My Awesome Heading&#10;&#10;Here is some description showing code blocks:&#10;&#10;```javascript&#10;const val = 100;&#10;```&#10;&#10;> [!NOTE]&#10;> This is a custom alert boxes!&#10;&#10;> [!TIP]&#10;> Bind your prefix keys inside your configuration files!"
              required
              style={{ minHeight: "350px", fontFamily: "monospace" }}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isPending}
            style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
          >
            {isPending ? "Publishing Post..." : "Publish Blog Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
