import "./AboutUs.css";

const stats = [
  { number: "100k+",  label: "Youth Trained Annually" },
  { number: "36+", label: "Skill Centres" },
  { number: "25+",  label: "Courses & Programs" },
  { number: "95%",  label: "Placement Rate" },
];

const pillars = [
  {
    icon: "🎓",
    title: "World-Class Training",
    desc: "Industry-aligned curriculum designed with leading corporates and sector skill councils to ensure job-ready graduates.",
  },
  {
    icon: "🤝",
    title: "Industry Partnerships",
    desc: "Deep ties with 200+ employers across manufacturing, IT, healthcare, retail, and hospitality sectors.",
  },
  {
    icon: "🌍",
    title: "Pan-India Presence",
    desc: "Operating across 25+ states with a strong network of residential and non-residential skill centres.",
  },
  {
    icon: "💡",
    title: "Innovation in Learning",
    desc: "Blended learning with digital labs, simulation tools, and mentorship from industry experts.",
  },
];

export default function AboutUs() {
  return (
    <section className="about-section" id="about-us">
      {/* Section label */}
      <div className="about-eyebrow">
        <span className="about-eyebrow-line" />
        <span className="about-eyebrow-text">Who We Are</span>
        <span className="about-eyebrow-line" />
      </div>

      <h2 className="about-heading">
        Transforming Lives Through <span className="about-accent">Skill Education</span>
      </h2>
      <p className="about-intro">
        CII – Centre of Excellence on Skills is a non-profit initiative of the
        Confederation of Indian Industry (CII), committed to bridging the skill gap and
        creating a future-ready workforce for India.
      </p>

      {/* Stats bar */}
      <div className="about-stats-bar">
        {stats.map((s) => (
          <div className="about-stat-item" key={s.label}>
            <span className="about-stat-num">{s.number}</span>
            <span className="about-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Pillars grid */}
      <div className="about-pillars">
        {pillars.map((p) => (
          <div className="about-pillar-card" key={p.title}>
            <div className="about-pillar-icon">{p.icon}</div>
            <h3 className="about-pillar-title">{p.title}</h3>
            <p className="about-pillar-desc">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission strip */}
      <div className="about-mission-strip">
        <p className="about-mission-quote">
          "Our mission is to empower every young Indian with the skills, confidence, and
          opportunity to lead a dignified and productive life."
        </p>
        <span className="about-mission-attr">— CII Skill Mission</span>
      </div>
    </section>
  );
}
