import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import BlogList from "@/app/blog/BlogList";

export const metadata = {
  title: "Blog | Brian Kihara",
  description: "Technical writings, thoughts on modern web development, and terminal workflow tips.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header animate-fade-in">
          <span className="section-label">Writings</span>
          <h1 className="blog-title">My Blog</h1>
          <p className="blog-subtitle">
            Exploring modern front-end engineering, terminal-centric development workflows, and software craftsmanship.
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/blog/new" className="btn btn-primary">
              + Create Post
            </Link>
          </div>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
