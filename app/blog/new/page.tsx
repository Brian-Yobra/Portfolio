'use client';

import React from 'react';
import Link from 'next/link';
import BlogForm from '@/components/BlogForm';

export default function NewBlogPostPage() {
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
          Write and publish articles with full Markdown styling, custom code highlight blocks, and
          colored alert boxes.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
