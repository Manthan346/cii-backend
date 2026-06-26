import { useRef } from "react";
import "./Showcase.css";

const achievements = [
  { icon: "🏆", number: "100k+",  label: "Youth Trained",         desc: "Annually across India" },
  { icon: "🏫", number: "36+", label: "Skill Centres",         desc: "Pan-India network" },
  { icon: "🤝", number: "50+",  label: "Industry Partners",     desc: "Leading corporates" },
  { icon: "📜", number: "25+",  label: "States Covered",        desc: "Nationwide presence" },
  { icon: "💼", number: "95%",  label: "Placement Rate",        desc: "Within 3 months" },
  { icon: "⭐", number: "4.9",  label: "Student Rating",        desc: "Out of 5.0" },
  { icon: "🎓", number: "20+",  label: "Certified Programs",    desc: "NSQF aligned" },
  { icon: "🌍", number: "15yr", label: "of Excellence",         desc: "Trusted experience" },
];

const awards = [
  { year: "2023", title: "Best Skill Development Initiative", org: "FICCI Skill Awards" },
  { year: "2022", title: "National CSR Award – Education",   org: "Ministry of Corporate Affairs" },
  { year: "2021", title: "Top Skill Training Organisation",  org: "NSDC Recognition" },
  { year: "2020", title: "Excellence in Vocational Training",org: "CII National Awards" },
  { year: "2019", title: "Most Impactful NGO – Skills",      org: "Times of India Awards" },
];

const collaborators = [
  { name: "NASSCOM",        initial: "N",  bg: "#003087" },
  { name: "NSDC",           initial: "NS", bg: "#1a4da8" },
  { name: "ITC Hotels",     initial: "IT", bg: "#c8a96e" },
  { name: "Bajaj Finserv",  initial: "BF", bg: "#003087" },
  { name: "Blue Star",      initial: "BS", bg: "#003087" },
  { name: "Cisco",          initial: "C",  bg: "#00bceb" },
  { name: "L'Oréal",        initial: "L",  bg: "#1a1a1a" },
  { name: "Jubilant",       initial: "JF", bg: "#e8a020" },
  { name: "VFS Academy",    initial: "V",  bg: "#003087" },
  { name: "Nihon Edutech",  initial: "NE", bg: "#d62828" },
  { name: "Apparel Sector", initial: "AS", bg: "#ff6b9d" },
];

export default function Showcase() {
  const logoTrackRef = useRef(null);

  return (
    <section className="sc-section" id="showcase">
      {/* ── Achievements ── */}
      <div className="sc-achievements-block">
        <div className="sc-eyebrow">
          <span className="sc-eyebrow-line" />
          <span className="sc-eyebrow-text">Our Impact</span>
          <span className="sc-eyebrow-line" />
        </div>
        <h2 className="sc-heading">Achievements & <span className="sc-accent">Milestones</span></h2>
        <p className="sc-subtext">Numbers that reflect our commitment to transforming lives through skill education.</p>

        <div className="sc-stats-grid">
          {achievements.map((a) => (
            <div className="sc-stat-card" key={a.label}>
              <div className="sc-stat-icon">{a.icon}</div>
              <div className="sc-stat-number">{a.number}</div>
              <div className="sc-stat-label">{a.label}</div>
              <div className="sc-stat-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Awards timeline ── */}
      <div className="sc-awards-block">
        <h3 className="sc-sub-heading">🏅 Recognition & Awards</h3>
        <div className="sc-awards-list">
          {awards.map((a, i) => (
            <div className="sc-award-item" key={i}>
              <div className="sc-award-year">{a.year}</div>
              <div className="sc-award-dot" />
              <div className="sc-award-content">
                <div className="sc-award-title">{a.title}</div>
                <div className="sc-award-org">{a.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Collaborations – auto-scrolling ticker ── */}
      <div className="sc-collab-block">
        <h3 className="sc-sub-heading">🤝 Our Collaborations</h3>
        <p className="sc-collab-sub">Trusted by India's leading corporations, government bodies, and sector skill councils</p>

        <div className="sc-ticker-wrap">
          <div className="sc-ticker-track" ref={logoTrackRef}>
            {[...collaborators, ...collaborators].map((c, i) => (
              <div className="sc-collab-chip" key={i}>
                <div
                  className="sc-collab-avatar"
                  style={{ background: c.bg }}
                >
                  {c.initial}
                </div>
                <span className="sc-collab-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second row reverse */}
        <div className="sc-ticker-wrap sc-ticker-reverse">
          <div className="sc-ticker-track sc-ticker-track-reverse">
            {[...collaborators, ...collaborators].reverse().map((c, i) => (
              <div className="sc-collab-chip" key={i}>
                <div
                  className="sc-collab-avatar"
                  style={{ background: c.bg }}
                >
                  {c.initial}
                </div>
                <span className="sc-collab-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
