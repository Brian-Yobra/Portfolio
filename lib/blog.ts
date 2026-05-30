import { marked } from 'marked';
import { pool, initDb } from './db';

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
      .split('\n')
      .map((line: string) => line.replace(/^>\s?/, ''))
      .join('\n');

    let icon = `<svg class="alert-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === 'TIP') icon = `<svg class="alert-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M15.09 14c.18-.19.33-.42.44-.67A4.32 4.32 0 0 0 16 11.5a5.5 5.5 0 1 0-11 0c0 .93.2 1.84.59 2.63.11.25.26.48.44.67l1.47 1.7h7.12l1.47-1.7z"></path></svg>`;
    if (type === 'IMPORTANT') icon = `<svg class="alert-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-12 9a3 3 0 0 0 6 0"></path></svg>`;
    if (type === 'WARNING') icon = `<svg class="alert-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    if (type === 'CAUTION') icon = `<svg class="alert-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>`;

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
      'SELECT slug, title, description, category, tags, cover_image, reading_time, created_at FROM blogs ORDER BY created_at DESC'
    );

    return res.rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description || '',
      category: row.category || 'General',
      tags: row.tags || [],
      coverImage: row.cover_image || '',
      readingTime: row.reading_time || '3 min read',
      date: row.created_at ? new Date(row.created_at).toISOString() : '',
    }));
  } catch (error) {
    console.error('Error fetching all posts from database:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await initDb();

  try {
    const res = await pool.query(
      'SELECT slug, title, description, content, category, tags, cover_image, reading_time, created_at FROM blogs WHERE slug = $1',
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
      description: row.description || '',
      category: row.category || 'General',
      tags: row.tags || [],
      coverImage: row.cover_image || '',
      readingTime: row.reading_time || '3 min read',
      date: row.created_at ? new Date(row.created_at).toISOString() : '',
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

// Function to delete a blog post from the database
export async function deleteBlogPost(slug: string): Promise<boolean> {
  await initDb();

  try {
    const res = await pool.query('DELETE FROM blogs WHERE slug = $1 RETURNING slug', [slug]);
    return res.rowCount !== null && res.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting blog post ${slug} from database:`, error);
    return false;
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
        post.coverImage || '',
        post.readingTime || '3 min read',
      ]
    );
    return true;
  } catch (error) {
    console.error('Error creating/updating blog post in database:', error);
    return false;
  }
}
