import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer glass-card">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand-section">
          <div className="nav-brand" style={{ marginBottom: "var(--spacing-sm)" }}>
            <Link href="/" style={{ color: "white" }}>
              <img src="/favicon.svg" alt="Logo" className="nav-brand-logo" />
              <span>Brian <span className="highlight" style={{ color: "var(--color-accent-primary)" }}>Kihara</span></span>
            </Link>
          </div>
          <p className="footer-brand-text">
            A fullstack developer specializing in modern web technologies, building performant, state-of-the-art web experiences.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-section">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/tools">Tools</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contacts">Contacts</Link></li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className="footer-connect-section">
          <h4 className="footer-title">Connect</h4>
          <ul className="footer-links-list">
            <li>
              <a href="mailto:briankihara@example.com" className="footer-contact-item">
                briankihara@example.com
              </a>
            </li>
            <li className="footer-contact-item" style={{ color: "var(--color-text-muted)" }}>
              Eldoret, Kenya
            </li>
          </ul>
          
          <div className="footer-socials" style={{ marginTop: "var(--spacing-md)", display: "flex", gap: "var(--spacing-sm)" }}>
            <a
              href="https://github.com/Brian-Yobra"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="GitHub"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                style={{ width: "24px", height: "24px" }}
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                style={{ width: "24px", height: "24px" }}
              />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {currentYear} Brian Kihara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
