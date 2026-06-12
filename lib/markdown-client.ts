import { marked } from 'marked';

// Custom Markdown processor for GitHub-style alerts (client-side version)
function formatAlerts(markdown: string): string {
  const alertRegex = />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:>\s*.*\n?)*)/g;

  return markdown.replace(alertRegex, (match, type, content) => {
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

// Configure marked for client-side rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(raw: string): string {
  if (!raw.trim()) return '';
  const formatted = formatAlerts(raw);
  return marked.parse(formatted) as string;
}
