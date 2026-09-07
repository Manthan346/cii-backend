import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const links = [
  { label: "Home", href: "#home", route: null },
  { label: "About Us", href: "#about-us", route: null },
  { label: "Course / Training", href: "#courses", route: null },
  { label: "Achievements", href: "#showcase", route: null },
  { label: "Events", href: null, route: "/events" },
  { label: "Placements", href: null, route: "/placements" },
  { label: "Testimonials", href: "#testimonials", route: null },
  { label: "Contact Us", href: "#contact", route: null },
  { label: "Login", href: "#login", route: "/LoginPage" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-highlight correct link based on current route
  useEffect(() => {
    if (location.pathname === "/events") setActive("Events");
    else if (location.pathname.startsWith("/placements")) setActive("Placements");
    else if (location.pathname === "/") setActive("Home");
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e, label, href, route) => {
    e.preventDefault();
    setActive(label);
    setMenuOpen(false);

    if (route) {
      navigate(route);
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(href.replace("#", ""));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(href.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="navbar-links">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.route || l.href}
              className={`navbar-link ${active === l.label ? "navbar-link-active" : ""}`}
              onClick={(e) => handleClick(e, l.label, l.href, l.route)}
            >
              {l.label}
              {active === l.label && <span className="navbar-indicator" />}
            </a>
          ))}
          {/* <button style={{color: "", background: "#f4c542", border: "1px solid ", borderRadius: "0.2rem", padding: "5px"}}>Login</button> */}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.route || l.href}
              className={`navbar-mobile-link ${active === l.label ? "navbar-mobile-active" : ""}`}
              onClick={(e) => handleClick(e, l.label, l.href, l.route)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}