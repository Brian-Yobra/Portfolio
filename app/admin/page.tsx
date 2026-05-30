import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import AdminBlogTable from './AdminBlogTable';
import LogoutButton from './LogoutButton';

export const metadata = {
  title: 'Admin Dashboard | Brian Kihara',
  description: 'Manage and edit blog posts from the admin control panel.',
};

export default async function AdminPage() {
  const posts = await getAllPosts();

  const totalPosts = posts.length;
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const totalTags = Array.from(new Set(posts.flatMap((p) => p.tags))).length;

  return (
    <div className="admin-page-clean animate-fade-in">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-text">
          <span className="section-label">Control Panel</span>
          <h1 className="admin-title">Blog Manager</h1>
          <p className="admin-subtitle">
            Create, edit, and manage all blog posts from one place. Changes are reflected
            instantly across your portfolio.
          </p>
        </div>
        <div className="admin-header-actions">
          <LogoutButton />
          <Link href="/blog/new" className="btn btn-primary">
            <span>＋</span> New Post
          </Link>
        </div>
      </div>

      {/* Stats and Quick Actions Row */}
      <div className="admin-stats-row">
        {/* Quick Stats */}
        <div className="admin-quick-stats glass-card animate-fade-in animate-delay-1">
          <h4 className="admin-quick-stats-title">📊 Stats</h4>
          <ul className="admin-quick-stats-list">
            <li>
              <span className="qs-label">Posts</span>
              <span className="qs-value">{totalPosts}</span>
            </li>
            <li>
              <span className="qs-label">Categories</span>
              <span className="qs-value">{categories.length}</span>
            </li>
            <li>
              <span className="qs-label">Unique Tags</span>
              <span className="qs-value">{totalTags}</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions glass-card animate-fade-in animate-delay-2">
          <h4 className="admin-quick-stats-title">⚡ Quick Actions</h4>
          <div className="admin-quick-actions-grid">
            <Link href="/blog/new" className="admin-quick-action-btn">
              <span>✍️</span> Write New Post
            </Link>
            <Link href="/blog" className="admin-quick-action-btn">
              <span>📖</span> View Public Blog
            </Link>
            <Link href="/" className="admin-quick-action-btn">
              <span>🏠</span> Go to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Table */}
      <AdminBlogTable posts={posts} />
    </div>
  );
}
