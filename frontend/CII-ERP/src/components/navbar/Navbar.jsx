import { useState, useEffect } from "react";
import "./Navbar.css";

const links = [
  { label: "Home",         href: "#home" },
  { label: "About Us",     href: "#about-us" },
  { label: "Course / Training", href: "#courses" },
  { label: "Achievements", href: "#showcase" },
  { label: "Events", href: "#events" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact Us",   href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (label, href) => {
    setActive(label);
    setMenuOpen(false);
    // smooth scroll
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="navbar-links">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`navbar-link ${active === l.label ? "navbar-link-active" : ""}`}
              onClick={(e) => { e.preventDefault(); handleClick(l.label, l.href); }}
            >
              {l.label}
              {active === l.label && <span className="navbar-indicator" />}
            </a>
          ))}
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
              href={l.href}
              className={`navbar-mobile-link ${active === l.label ? "navbar-mobile-active" : ""}`}
              onClick={(e) => { e.preventDefault(); handleClick(l.label, l.href); }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
