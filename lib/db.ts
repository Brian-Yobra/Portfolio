import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Clean up and parse the SERVICE_URI from env
let connectionString = process.env.SERVICE_URI || process.env.DATABASE_URL;

if (connectionString) {
  connectionString = connectionString.trim().replace(/^["']|["']$/g, '');
}

// Parse and strip query params from the connection string by splitting on '?' to preserve special characters in password
let cleanUri = connectionString;
if (cleanUri) {
  cleanUri = cleanUri.split('?')[0];
}

export const pool = new Pool({
  connectionString: cleanUri,
  ssl: {
    rejectUnauthorized: false,
  },
});

let dbInitialized = false;

export async function initDb() {
  if (dbInitialized) return;

  const client = await pool.connect();
  try {
    // 1. Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        tags TEXT[] DEFAULT '{}',
        cover_image VARCHAR(500),
        reading_time VARCHAR(50) DEFAULT '3 min read',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Check if table is empty, if so, seed from markdown files
    const res = await client.query('SELECT COUNT(*) FROM blogs');
    const count = parseInt(res.rows[0].count, 10);

    if (count === 0) {
      console.log("Database 'blogs' table is empty. Seeding from local markdown files...");
      const postsDirectory = path.join(process.cwd(), 'data/posts');

      if (fs.existsSync(postsDirectory)) {
        const fileNames = fs.readdirSync(postsDirectory);
        for (const fileName of fileNames) {
          if (fileName.endsWith('.md')) {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            await client.query(
              `INSERT INTO blogs (slug, title, description, content, category, tags, cover_image, reading_time, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (slug) DO NOTHING`,
              [
                slug,
                data.title || 'Untitled',
                data.description || '',
                content,
                data.category || 'General',
                data.tags || [],
                data.coverImage || '',
                data.readingTime || '3 min read',
                data.date ? new Date(data.date) : new Date(),
              ]
            );
            console.log(`Seeded post: ${slug}`);
          }
        }
      }
    }

    dbInitialized = true;
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    client.release();
  }
}
