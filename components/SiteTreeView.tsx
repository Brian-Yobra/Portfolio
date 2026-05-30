'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PostMetadata } from '@/lib/blog';

interface TreeNode {
  label: string;
  href?: string;
  badge?: string;
  children?: TreeNode[];
}

/** Build the full site tree, injecting blog post nodes dynamically */
function buildTree(
  posts: PostMetadata[],
  projects: Array<{ id: number; title: string }> = [],
  tools: Array<{ category: string }> = []
): TreeNode[] {
  // 1. Dynamic projects nodes
  const projectNodes: TreeNode[] = projects.map((p) => ({
    label: p.title,
    href: `/projects#project-${p.id}`,
  }));

  // 2. Dynamic tools category nodes
  const toolNodes: TreeNode[] = tools.map((t) => ({
    label: t.category,
    href: `/tools#${t.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  }));

  // 3. Dynamic blog posts (user-facing, clean layout)
  const blogPostNodes: TreeNode[] = posts.map((post) => ({
    label: post.title,
    href: `/blog/${post.slug}`,
    badge: post.category,
  }));

  return [
    {
      label: 'Portfolio',
      children: [
        {
          label: 'Home',
          href: '/',
          children: [
            { label: 'Intro', href: '/#hero' },
            { label: 'Tech Stack', href: '/#skills' },
            { label: 'Experience', href: '/#experience' },
          ],
        },
        {
          label: 'Projects',
          href: '/projects',
          children: projectNodes,
        },
        {
          label: 'Tools',
          href: '/tools',
          children: toolNodes,
        },
        { label: 'Contact', href: '/contacts' },
        {
          label: 'Blog',
          href: '/blog',
          children: [
            { label: 'All Posts', href: '/blog' },
            ...blogPostNodes,
          ],
        },
      ],
    },
  ];
}

interface TreeItemProps {
  node: TreeNode;
  depth?: number;
  pathname: string;
  activeSection: string;
}

function TreeItem({ node, depth = 0, pathname, activeSection }: TreeItemProps) {
  const hasChildren = !!node.children?.length;

  // Mark active when the pathname matches OR if it is a hash route matching the current active section
  let isActive = false;
  if (node.href) {
    if (node.href.includes('#')) {
      const parts = node.href.split('#');
      const routePath = parts[0] || '/';
      const hash = parts[1];
      isActive = pathname === routePath && activeSection === hash;
    } else {
      isActive = pathname === node.href;
    }
  }

  const isAncestor =
    !!node.href &&
    node.href !== '/' &&
    !node.href.includes('#') &&
    pathname.startsWith(node.href);

  // Auto-open if this node or a descendant is active
  const [open, setOpen] = useState(depth < 1 || isAncestor || isActive);

  // Keep it open if state changes
  useEffect(() => {
    if (isAncestor || isActive) {
      setOpen(true);
    }
  }, [isAncestor, isActive]);

  return (
    <div
      className="tree-item-wrapper"
      onMouseEnter={() => setOpen(true)}
    >
      <div
        className={`tree-item ${isActive ? 'tree-item-active' : ''} ${isAncestor && !isActive ? 'tree-item-ancestor' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            className="tree-item-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <span className={`tree-chevron ${open ? 'open' : ''}`}>›</span>
          </button>
        ) : (
          <span className="tree-leaf-spacer" />
        )}

        {node.href ? (
          <Link href={node.href} className="tree-item-link">
            <span className="tree-item-label">{node.label}</span>
            {node.badge && (
              <span className="tree-item-badge">{node.badge}</span>
            )}
          </Link>
        ) : (
          <button
            className="tree-item-label-btn"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="tree-item-label">{node.label}</span>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeItem
              key={child.label + (child.href ?? '')}
              node={child}
              depth={depth + 1}
              pathname={pathname}
              activeSection={activeSection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SiteTreeViewProps {
  posts?: PostMetadata[];
  projects?: Array<{ id: number; title: string }>;
  tools?: Array<{ category: string }>;
}

export default function SiteTreeView({
  posts = [],
  projects = [],
  tools = [],
}: SiteTreeViewProps) {
  const pathname = usePathname();
  const tree = buildTree(posts, projects, tools);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    let sections: string[] = [];

    if (pathname === '/') {
      sections = ['hero', 'skills', 'experience'];
    } else if (pathname === '/projects') {
      sections = projects.map((p) => `project-${p.id}`);
    } else if (pathname === '/tools') {
      sections = tools.map((t) => t.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    } else {
      setActiveSection('');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -50% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      let currentActive = sections[0] || '';
      const scrollPosition = window.scrollY + 220;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          currentActive = id;
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial invocation

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, projects, tools]);

  return (
    <nav
      className="site-tree-view animate-fade-in"
      aria-label="Site map"
      style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
    >
      <div className="site-tree-header" style={{ border: 'none', background: 'transparent', paddingLeft: 0, paddingRight: 0 }}>
        <span className="site-tree-title">SITE MAP</span>
        <span className="site-tree-count">{posts.length} posts</span>
      </div>
      <div className="site-tree-body" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {tree.map((node) => (
          <TreeItem
            key={node.label}
            node={node}
            depth={0}
            pathname={pathname}
            activeSection={activeSection}
          />
        ))}
      </div>
    </nav>
  );
}
