import projects from '@/data/Projects.json';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
  icon: string;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card glass-card" id={`project-${project.id}`}>
      <div className="project-image">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            unoptimized={project.image.startsWith('http')}
          />
        ) : (
          <div className="project-image-placeholder">
            {project.icon ? (
              <Image
                src={project.icon}
                alt={project.title}
                className="project-placeholder-icon"
                width={64}
                height={64}
                unoptimized={project.icon.startsWith('http')}
              />
            ) : (
              <span style={{ fontSize: '3rem' }}>🗂️</span>
            )}
          </div>
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <Image
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                className="link-icon"
                width={16}
                height={16}
                unoptimized
              />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <Image
                src="https://cdn.simpleicons.org/vercel/white"
                alt="Demo"
                className="link-icon"
                width={16}
                height={16}
                unoptimized
              />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="container">
        <div className="projects-header">
          <h1 className="projects-title">My Projects</h1>
          <p className="projects-subtitle">
            A collection of projects I&apos;ve worked on, showcasing my skills in web development
            and design.
          </p>
        </div>

        <div className="projects-grid">
          {(projects as Project[]).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
