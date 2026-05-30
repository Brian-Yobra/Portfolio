import toolsData from '@/data/Tools.json';
import Image from 'next/image';

interface Tool {
  id: number;
  name: string;
  description: string;
  icon: string;
  url?: string;
}

interface ToolCategory {
  category: string;
  items: Tool[];
}

function ToolCard({ tool }: { tool: Tool }) {
  if (tool.url) {
    return (
      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card glass-card">
        <Image
          className="tool-icon"
          src={tool.icon}
          alt={tool.name}
          width={48}
          height={48}
          unoptimized={tool.icon.startsWith('http')}
        />
        <div className="tool-info">
          <h3 className="tool-name">{tool.name}</h3>
          <p className="tool-description">{tool.description}</p>
        </div>
      </a>
    );
  }

  return (
    <div className="tool-card glass-card">
      <Image
        className="tool-icon"
        src={tool.icon}
        alt={tool.name}
        width={48}
        height={48}
        unoptimized={tool.icon.startsWith('http')}
      />
      <div className="tool-info">
        <h3 className="tool-name">{tool.name}</h3>
        <p className="tool-description">{tool.description}</p>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="tools-page">
      <div className="container">
        <div className="tools-header">
          <h1 className="tools-title">My Tools</h1>
          <p className="tools-subtitle">
            The software and tools I use daily to build projects and stay productive.
          </p>
        </div>

        {(toolsData as ToolCategory[]).map((category) => (
          <div key={category.category} id={category.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="tools-category">
            <h2 className="tools-category-title">{category.category}</h2>
            <div className="tools-grid">
              {category.items.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
