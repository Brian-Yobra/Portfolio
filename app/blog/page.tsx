import { getAllPosts } from '@/lib/blog';
import BlogList from '@/app/blog/BlogList';

export const metadata = {
  title: 'Blog | Brian Kihara',
  description:
    'Technical writings, thoughts on modern web development, and terminal workflow tips.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header animate-fade-in">
          <span className="section-label">Writings</span>
          <h1 className="blog-title">My Blog</h1>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
