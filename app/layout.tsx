import type { Metadata } from 'next';
import './globals.scss';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import SiteTreeView from '@/components/SiteTreeView';
import { getAllPosts } from '@/lib/blog';
import projects from '@/data/Projects.json';
import tools from '@/data/Tools.json';

export const metadata: Metadata = {
  title: 'Brian Kihara | Portfolio',
  description: 'A fullstack developer specializing in modern web technologies',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = await getAllPosts();

  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="global-layout">
          <aside className="global-sidebar animate-fade-in">
            <SiteTreeView posts={posts} projects={projects} tools={tools} />
          </aside>
          <div className="global-content-wrapper">
            <main className="main-content">{children}</main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
