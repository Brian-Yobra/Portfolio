import { getPostBySlug, getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import CodeCopyInstaller from "@/components/CodeCopyInstaller";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts at compile time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each dynamic blog post
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.metadata.title} | Brian Kihara`,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.metadata.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="blog-post-page container">
      <CodeCopyInstaller />
      <div className="blog-post-back-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/blog" className="back-link">
          <span>←</span> Back to Blog
        </Link>
        <Link href={`/blog/${slug}/edit`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "var(--font-size-xs)" }}>
          ✏️ Edit Post
        </Link>
      </div>

      <header className="blog-post-header animate-fade-in">
        <div className="blog-post-meta">
          <span className="category-badge primary">{post.metadata.category}</span>
          <span className="meta-divider">•</span>
          <time className="post-date">{formattedDate}</time>
          <span className="meta-divider">•</span>
          <span className="reading-time">{post.metadata.readingTime}</span>
        </div>

        <h1 className="blog-post-title">{post.metadata.title}</h1>
        <p className="blog-post-description">{post.metadata.description}</p>

        <div className="blog-post-tags">
          {post.metadata.tags.map((tag) => (
            <span key={tag} className="tag blog-tag">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {post.metadata.coverImage && (
        <div className="blog-post-cover animate-fade-in animate-delay-1">
          <img src={post.metadata.coverImage} alt={post.metadata.title} />
        </div>
      )}

      <div className="blog-post-content-container animate-fade-in animate-delay-2">
        <div className="blog-post-content glass-card">
          <div 
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
          />
        </div>
      </div>
    </article>
  );
}
