"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitBlogPost } from "@/app/blog/new/actions";
import { Post } from "@/lib/blog";

export default function EditBlogPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.metadata.title);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Explicitly add the slug (since the disabled input won't submit it automatically)
    formData.set("slug", post.metadata.slug);

    try {
      await submitBlogPost(formData);
    } catch (err: any) {
      if (err && (err.message === "NEXT_REDIRECT" || err.digest?.startsWith("NEXT_REDIRECT"))) {
        throw err;
      }
      console.error(err);
      setError(err?.message || "Something went wrong while updating your post.");
      setIsPending(false);
    }
  };

  return (
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
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug-display" className="form-label">
            Slug (URL Address - Immutable)
          </label>
          <input
            type="text"
            id="slug-display"
            className="form-input"
            value={post.metadata.slug}
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed", background: "rgba(0,0,0,0.05)" }}
          />
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
            The slug is locked to preserve existing URL references.
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
            defaultValue={post.metadata.description}
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
            defaultValue={post.metadata.category}
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
            defaultValue={post.metadata.tags.join(", ")}
            placeholder="React, CSS, Postgres, SQL"
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
            defaultValue={post.metadata.coverImage}
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
            defaultValue={post.metadata.readingTime}
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
            defaultValue={post.content}
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
          {isPending ? "Updating Post..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
