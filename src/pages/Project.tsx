import "../css/Projects.css";
import projects from "../json/Projects.json";

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
    <div className="project-card glass-card">
      <div className="project-image">
        {project.image ? (
          <img src={project.image} alt={project.title} />
        ) : (
          <div className="project-image-placeholder">
            <img src={project.icon} alt={project.title} className="project-placeholder-icon" />
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
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                className="link-icon"
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
              <img
                src="https://cdn.simpleicons.org/vercel/white"
                alt="Demo"
                className="link-icon"
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
          <h1 className="projects-title">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="projects-subtitle">
            A collection of projects I've worked on, showcasing my skills in web
            development and design.
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
