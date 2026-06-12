'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitBlogPost } from '@/app/blog/new/actions';
import { Post } from '@/lib/blog';
import MarkdownEditor from '@/components/MarkdownEditor';

interface BlogFormProps {
  post?: Post;
}

export default function BlogForm({ post }: BlogFormProps) {
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.metadata.title || '');
  const [slug, setSlug] = useState(post?.metadata.slug || '');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    if (!isEdit) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEdit) return;
    const val = e.target.value;
    const cleanSlug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-');
    setSlug(cleanSlug);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('slug', slug);

    try {
      await submitBlogPost(formData);
    } catch (err: any) {
      if (err && (err.message === 'NEXT_REDIRECT' || err.digest?.startsWith('NEXT_REDIRECT'))) {
        throw err;
      }
      console.error(err);
      setError(err?.message || `Something went wrong while ${isEdit ? 'updating' : 'saving'} your post.`);
      setIsPending(false);
    }
  };

  return (
    <div
      className="contact-form-section glass-card animate-fade-in animate-delay-1"
      style={{ maxWidth: '1100px', margin: '0 auto var(--spacing-3xl)' }}
    >
      <form onSubmit={handleSubmit} className="contact-form">
        {error && (
          <div className="alert-box alert-caution" style={{ margin: '0 0 var(--spacing-md)' }}>
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
            {isEdit ? 'Slug (URL Address - Immutable)' : 'Slug (URL Address)'}
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="form-input"
            placeholder="e.g. building-microfrontends-with-react"
            value={slug}
            onChange={handleSlugChange}
            disabled={isEdit}
            style={isEdit ? { opacity: 0.6, cursor: 'not-allowed', background: 'rgba(0,0,0,0.05)' } : undefined}
          />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: '2px',
            }}
          >
            {isEdit ? (
              'The slug is locked to preserve existing URL references.'
            ) : (
              <>Preview: <strong>/blog/{slug || 'your-slug'}</strong></>
            )}
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
            defaultValue={post?.metadata.description || ''}
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
            defaultValue={post?.metadata.category || 'Web Dev'}
            style={{ background: 'var(--color-bg-secondary)', appearance: 'none' }}
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
            defaultValue={post?.metadata.tags.join(', ') || ''}
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
            defaultValue={post?.metadata.coverImage || ''}
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
            defaultValue={post?.metadata.readingTime || ''}
            placeholder="e.g. 5 min read"
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">
              Content (Markdown Format)
            </label>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-primary)' }}>
              Supports standard MD, inline codes, code blocks &amp; GitHub alerts
            </span>
          </div>
          <MarkdownEditor
            name="content"
            defaultValue={post?.content || ''}
            placeholder={
              !isEdit
                ? '# My Awesome Heading\n\nHere is some description showing code blocks:\n\n```javascript\nconst val = 100;\n```\n\n> [!NOTE]\n> This is a custom alert box!\n\n> [!TIP]\n> Bind your prefix keys inside your configuration files!'
                : undefined
            }
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isPending}
          style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {isPending ? (isEdit ? 'Updating Post...' : 'Publishing Post...') : (isEdit ? 'Save Changes' : 'Publish Blog Post')}
        </button>
      </form>
    </div>
  );
}
