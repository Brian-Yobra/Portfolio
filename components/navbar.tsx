"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="nav-brand">
          <Link href="/">
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
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/tools"
            className={`nav-link ${isActive("/tools") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Tools
          </Link>
          <Link
            href="/contacts"
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
