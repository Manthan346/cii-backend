import { useState } from "react";
import "./Courses.css";

import blueStarLogo    from "../../assets/bluestar-logo.png";
import itcLogo         from "../../assets/itc-logo.png";
import cosmosLogo      from "../../assets/cosmos-logo.png";
import dsciLogo        from "../../assets/dsci-logo.png";
import kalpatauruLogo  from "../../assets/kalpataru-logo.png";
import nihonLogo       from "../../assets/nihon edutech-logo.png";
import apparelLogo     from "../../assets/aparrel-logo.png";
import bajajLogo       from "../../assets/bajaj-logo.png";
import jubilantLogo    from "../../assets/jubliant-logo.png";
import lorealLogo      from "../../assets/loreal-logo.png";
import ciscoLogo       from "../../assets/cisco-logo.png";
import vfsLogo         from "../../assets/vfs-global-logo.png";

const partners = [
  {
    id: 1,
    name: "Blue Star",
    category: "RAC Servicing",
    desc: "Refrigeration & Air Conditioning Servicing – professional roles in AC service, maintenance and repair.",
    upcoming: false,
    logo: blueStarLogo,
  },
  {
    id: 2,
    name: "ITC Hotels Limited",
    category: "Hotel Management",
    desc: "Hotel Management Certification, F&B Service, F&B Production, Room Service & Front Desk Operations.",
    upcoming: false,
    logo: itcLogo,
  },
  {
    id: 3,
    name: "Cosmos Creative Academy",
    category: "Graphic Design & VFX",
    desc: "Graphic Design, 3D, VFX, Game Design & Generative AI – roles as Designer, Animator, VFX Artist.",
    upcoming: false,
    logo: cosmosLogo,
  },
  {
    id: 4,
    name: "NASSCOM – DSCI",
    category: "Cyber Security",
    desc: "High-level positions focused on data security, analysis and management within the IT sector.",
    upcoming: false,
    logo: dsciLogo,
  },
  {
    id: 5,
    name: "PSIPL – Kalpataru",
    category: "Housekeeping",
    desc: "Professional housekeeping and facility management roles in corporate environments.",
    upcoming: false,
    logo: kalpatauruLogo,
  },
  {
    id: 6,
    name: "Nihon Edutech",
    category: "Japanese Language",
    desc: "Japanese Language Training – employment opportunities in Japan in manufacturing and nursing industries.",
    upcoming: false,
    logo: nihonLogo,
  },
  {
    id: 7,
    name: "Apparel",
    category: "Fashion Designing",
    desc: "Sewing Machine Operator & Fashion Designing – specialized roles in garments and textile manufacturing.",
    upcoming: false,
    logo: apparelLogo,
  },
  {
    id: 8,
    name: "Bajaj Finserv",
    category: "BFSI Skill Training",
    desc: "Banking, Financial Services & Insurance Skill Training – entry-level positions in Insurance and Sales.",
    upcoming: false,
    logo: bajajLogo,
  },
  {
    id: 9,
    name: "Jubilant FoodWorks",
    category: "Quick Service Restaurants",
    desc: "Training for roles in the restaurant and hotel Quick Service sector with one of India's top F&B brands.",
    upcoming: false,
    logo: jubilantLogo,
  },
  {
    id: 10,
    name: "L'Oréal India",
    category: "Beauty & Make Up",
    desc: "Hairdressing Training, Beauty & Make Up Training, and Beauty Advisor Training. Batches coming soon.",
    upcoming: true,
    logo: lorealLogo,
  },
  {
    id: 11,
    name: "Cisco",
    category: "Artificial Intelligence",
    desc: "Artificial Intelligence (AI) training powered by Cisco. Stay connected for upcoming batch details.",
    upcoming: true,
    logo: ciscoLogo,
  },
  {
    id: 12,
    name: "VFS Global Academy",
    category: "Retail & AI Training",
    desc: "Retail & AI training with VFS Global Academy. Stay connected for upcoming batch details.",
    upcoming: true,
    logo: vfsLogo,
  },
];

const categories = [
  "All",
  "RAC Servicing",
  "Hotel Management",
  "Graphic Design & VFX",
  "Cyber Security",
  "Housekeeping",
  "Japanese Language",
  "Fashion Designing",
  "BFSI Skill Training",
  "Quick Service Restaurants",
  "Beauty & Make Up",
  "Artificial Intelligence",
  "Retail & AI Training",
];

export default function Courses() {
  const [activeTab, setActiveTab] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered =
    activeTab === "All"
      ? partners
      : partners.filter((p) => p.category === activeTab);

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section className="courses-section" id="courses">
      {/* Header */}
      <div className="courses-header">
        <div className="courses-eyebrow">
          <span className="courses-eyebrow-pill">INDUSTRY PARTNERS</span>
        </div>
        <h2 className="courses-heading">
          Free Industry-Led{" "}
          <span className="courses-accent">Multi-Skill Training</span>
        </h2>
        <p className="courses-subtext">
          Employment facilitation in partnership with India's leading industry
          brands – practical, job-oriented training at no cost.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="courses-tabs-wrap">
        <div className="courses-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={`courses-tab ${activeTab === c ? "courses-tab-active" : ""}`}
              onClick={() => {
                setActiveTab(c);
                setShowAll(false);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Partner cards grid */}
      <div className="partner-grid">
        {displayed.map((p) => (
          <div className="partner-card" key={p.id}>
            {p.upcoming && (
              <span className="partner-upcoming-badge">UPCOMING</span>
            )}

            {/* Logo box */}
            <div className="partner-logo-box">
              <img
                src={p.logo}
                alt={p.name}
                className="partner-logo-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* Category badge */}
            <span className="partner-category">{p.category}</span>

            {/* Name + desc */}
            <h3 className="partner-name">{p.name}</h3>
            <p className="partner-desc">{p.desc}</p>

            <a href="#" className="partner-learn-more">
              Learn more
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {filtered.length > 8 && (
        <div className="courses-show-more">
          <button
            className="courses-show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less ↑" : `Show All ${filtered.length} Partners ↓`}
          </button>
        </div>
      )}

      {/* Info strip */}
      <div className="courses-info-strip">
        <span>
          <strong style={{ color: "#f4c542" }}>Centre Timing:</strong> Monday –
          Friday · 10:00 am to 05:00 pm
        </span>
        <span>
          <strong style={{ color: "#f4c542" }}>Call:</strong> 99670 46042 /
          87675 10941 / 84529 46439
        </span>
        <span>
          <strong style={{ color: "#f4c542" }}>Eligibility:</strong> Age 18–35 ·
          SSC / HSC / ITI and Above
        </span>
        <span>
          <strong style={{ color: "#f4c542" }}>Job Drive:</strong> Every Friday ·
          10:00 am – 1:00 pm · Entry Free
        </span>
      </div>
    </section>
  );
}
