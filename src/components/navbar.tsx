import { Link } from "react-router-dom";
import "../css/NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">BRIAN KIHARA</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/projects" className="nav-link">
          Projects
        </Link>
        <Link to="/contacts" className="nav-link">
          Contact
        </Link>
      </div>
    </nav>
  );
}
