import { getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditBlogPostForm from "./EditForm";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata = {
  title: "Edit Blog Post | Brian Kihara",
  description: "Update and edit existing articles in the PostgreSQL database.",
};

export default async function EditBlogPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="edit-post-page container">
      <div className="blog-post-back-nav">
        <Link href={`/blog/${slug}`} className="back-link">
          <span>←</span> Back to Article
        </Link>
      </div>

      <div className="blog-header animate-fade-in">
        <span className="section-label">Editor Mode</span>
        <h1 className="blog-title">Edit Post</h1>
        <p className="blog-subtitle">
          Make updates to &ldquo;{post.metadata.title}&rdquo;. Changes will be reflected instantly across your portfolio.
        </p>
      </div>

      <EditBlogPostForm post={post} />
    </div>
  );
}
