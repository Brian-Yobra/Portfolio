import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/NavBar.css";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="nav-brand">
          <Link to="/">
            Brian<span className="highlight">.</span>
          </Link>
        </div>

        <button
          className={`mobile-menu-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/projects"
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/tools"
            className={`nav-link ${isActive("/tools") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Tools
          </Link>
          <Link
            to="/contacts"
            className={`nav-link ${isActive("/contacts") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
