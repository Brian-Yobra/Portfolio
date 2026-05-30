import { marked } from "marked";
import { pool, initDb } from "./db";

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  readingTime: string;
  slug: string;
}

export interface Post {
  metadata: PostMetadata;
  contentHtml: string;
  content: string; // Raw markdown content for editing
}

// Custom Markdown processor for alerts
function formatAlerts(markdown: string): string {
  // Regex to match blockquotes starting with alerts like:
  // > [!NOTE]
  // > ...content...
  const alertRegex = />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:>\s*.*\n?)*)/g;

  return markdown.replace(alertRegex, (match, type, content) => {
    // Clean up content by removing leading '>' and extra spaces
    const cleanContent = content
      .split("\n")
      .map((line: string) => line.replace(/^>\s?/, ""))
      .join("\n");

    let icon = "ℹ️";
    if (type === "TIP") icon = "💡";
    if (type === "IMPORTANT") icon = "🔔";
    if (type === "WARNING") icon = "⚠️";
    if (type === "CAUTION") icon = "🔥";

    return `<div class="alert-box alert-${type.toLowerCase()}">
      <div class="alert-header">
        <span class="alert-icon">${icon}</span>
        <span class="alert-title">${type}</span>
      </div>
      <div class="alert-body">${cleanContent}</div>
    </div>`;
  });
}

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function getAllPosts(): Promise<PostMetadata[]> {
  await initDb();
  
  try {
    const res = await pool.query(
      "SELECT slug, title, description, category, tags, cover_image, reading_time, created_at FROM blogs ORDER BY created_at DESC"
    );

    return res.rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description || "",
      category: row.category || "General",
      tags: row.tags || [],
      coverImage: row.cover_image || "",
      readingTime: row.reading_time || "3 min read",
      date: row.created_at ? new Date(row.created_at).toISOString() : "",
    }));
  } catch (error) {
    console.error("Error fetching all posts from database:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await initDb();

  try {
    const res = await pool.query(
      "SELECT slug, title, description, content, category, tags, cover_image, reading_time, created_at FROM blogs WHERE slug = $1",
      [slug]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];

    // Apply custom alert formatting
    const formattedMarkdown = formatAlerts(row.content);

    // Parse Markdown to HTML
    const contentHtml = await marked.parse(formattedMarkdown);

    const metadata: PostMetadata = {
      slug: row.slug,
      title: row.title,
      description: row.description || "",
      category: row.category || "General",
      tags: row.tags || [],
      coverImage: row.cover_image || "",
      readingTime: row.reading_time || "3 min read",
      date: row.created_at ? new Date(row.created_at).toISOString() : "",
    };

    return {
      metadata,
      contentHtml,
      content: row.content,
    };
  } catch (error) {
    console.error(`Error fetching post ${slug} from database:`, error);
    return null;
  }
}

// Function to insert a new blog post into the database
export async function createBlogPost(post: {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime?: string;
}): Promise<boolean> {
  await initDb();

  try {
    await pool.query(
      `INSERT INTO blogs (slug, title, description, content, category, tags, cover_image, reading_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) 
       DO UPDATE SET title = $2, description = $3, content = $4, category = $5, tags = $6, cover_image = $7, reading_time = $8, updated_at = CURRENT_TIMESTAMP`,
      [
        post.slug,
        post.title,
        post.description,
        post.content,
        post.category,
        post.tags,
        post.coverImage || "",
        post.readingTime || "3 min read",
      ]
    );
    return true;
  } catch (error) {
    console.error("Error creating/updating blog post in database:", error);
    return false;
  }
}

