import { useState, useRef, useEffect } from "react";
import "./Testimonials.css";

// ─────────────────────────────────────────────────────────────────
// VIDEO REVIEWS DATA
//
// Backend integration guide (for later):
// Instead of hardcoding this array, fetch it from your API:
//
//   useEffect(() => {
//     fetch('/api/video-testimonials')
//       .then(res => res.json())
//       .then(data => setVideoReviews(data));
//   }, []);
//
// Each record your API returns should have this shape:
//   {
//     id:        string/number  — unique DB id
//     videoId:   string         — YouTube video ID (part after /shorts/)
//     name:      string         — student full name
//     role:      string         — "Placed at ITC Hotels"
//     course:    string         — "Hotel Management"
//     avatarBg:  string         — hex color for fallback avatar
//   }
//
// How to get a YouTube Short's videoId:
//   Open the Short → URL is youtube.com/shorts/ABC123xyz
//   Copy the part after /shorts/ → "ABC123xyz"
// ─────────────────────────────────────────────────────────────────
const videoReviews = [
  {
    id: "v1",
    videoId: "toXhR7f6G5I",
    name: "Priya Sharma",
    role: "Placed at ITC Hotels",
    course: "Hotel Management",
    avatarBg: "#0c2d72",
  },
  {
    id: "v2",
    videoId: "9QlLxQZkLl8",
    name: "Khushi Yadav",
    role: "AC Technician – Blue Star",
    course: "RAC Servicing",
    avatarBg: "#1a4da8",
  },
  {
    id: "v3",
    videoId: "TfEaiLAamoE",
    name: "Sneha Kulkarni",
    role: "Graphic Designer – CCA",
    course: "Graphic Design & VFX",
    avatarBg: "#e63946",
  },
  {
    id: "v4",
    videoId: "E2Mk6jkOidk",
    name: "Mohammed Ansari",
    role: "Banking Associate – Bajaj",
    course: "BFSI Skill Training",
    avatarBg: "#003087",
  },
  {
    id: "v5",
    videoId: "M9YxUTS45a4",
    name: "Kavita Desai",
    role: "Retail Supervisor – VFS",
    course: "Retail & AI Training",
    avatarBg: "#f4a023",
  },
  {
    id: "v6",
    videoId: "6jVLACvTWAQ",
    name: "Arjun Nair",
    role: "Japanese Interpreter",
    course: "Japanese Language",
    avatarBg: "#d62828",
  },
  {
    id: "v6",
    videoId: "To-HwAlkdoE",
    name: "Arjun Nair",
    role: "Japanese Interpreter",
    course: "Japanese Language",
    avatarBg: "#d62828",
  },
];

// ─────────────────────────────────────────────────────────────────
// TEXT REVIEWS DATA
//
// Backend integration guide (for later):
// Fetch from: GET /api/text-testimonials
// Shape: { id, name, role, location, rating, avatar, avatarBg, text, course }
// ─────────────────────────────────────────────────────────────────
const textReviews = [
  {
    id: 1,
    name: "Kavita Desai",
    role: "Retail Supervisor – VFS Academy",
    location: "Thane",
    rating: 5,
    avatar: "KD",
    avatarBg: "#f4a023",
    text: "From a homemaker to a full-time retail professional – CII made this journey possible. The trainers understood our challenges and the flexible timings made it easy to attend every session.",
    course: "Retail & AI Training",
  },
  {
    id: 2,
    name: "Arjun Nair",
    role: "Japanese Language Interpreter",
    location: "Nagpur",
    rating: 5,
    avatar: "AN",
    avatarBg: "#d62828",
    text: "Learning Japanese felt impossible before I joined Nihon Edutech's program here. Now I have a confirmed job offer in Japan. The instructors were native-level proficient and incredibly patient.",
    course: "Japanese Language",
  },
  {
    id: 3,
    name: "Deepa Jadhav",
    role: "Housekeeping Supervisor – PSIPL",
    location: "Pune",
    rating: 5,
    avatar: "DJ",
    avatarBg: "#1a3a6b",
    text: "The hands-on training at CII was unlike anything I had experienced. Every practical session was supervised by real industry professionals. I got placed before I even finished the course!",
    course: "Housekeeping",
  },
  {
    id: 4,
    name: "Vikram Shinde",
    role: "F&B Associate – Jubilant FoodWorks",
    location: "Mumbai",
    rating: 5,
    avatar: "VS",
    avatarBg: "#e8a020",
    text: "The Job Drive every Friday was the best thing about this centre. I attended two and got my offer letter on the second one. The staff genuinely wants you to succeed.",
    course: "Quick Service Restaurants",
  },
];

// ── Star rating component ──────────────────────────────────────
function StarRating({ count }) {
  return (
    <div className="tm-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i < count ? "#f4c542" : "rgba(255,255,255,0.2)"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

// ── Single video card ──────────────────────────────────────────
function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  // Thumbnail URL from YouTube — works for both regular videos and Shorts
  const thumbUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  // Embed URL — autoplay=1 so it starts immediately when user clicks play
  const embedSrc = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&loop=1&playlist=${video.videoId}`;
  

  return (
    <div className="tm-vcard">
      {/* Portrait video frame — 9:16 ratio to match Shorts */}
      <div className="tm-vcard-frame">
        {playing ? (
          <iframe
            className="tm-vcard-iframe"
            src={embedSrc}
            title={`${video.name} testimonial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="tm-vcard-thumb">
            <img
              src={thumbUrl}
              alt={video.name}
              className="tm-vcard-thumb-img"
              /* Fallback: if thumbnail 404s (video ID not set yet), show a gradient */
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {/* Gradient overlay so play button is always visible */}
            <div className="tm-vcard-overlay">
              <button
                className="tm-vcard-play"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${video.name}'s testimonial`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#06194a">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Name / role below card — matching reference design */}
      <div className="tm-vcard-meta">
        <div
          className="tm-vcard-avatar"
          style={{ background: video.avatarBg }}
          aria-hidden="true"
        >
          {video.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>
        <div className="tm-vcard-info">
          <span className="tm-vcard-name">{video.name}</span>
          <span className="tm-vcard-role">{video.role}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function Testimonials() {
  const [tab, setTab]             = useState("video");
  const [activeText, setActiveText] = useState(0);
  const [animating, setAnimating]   = useState(false);
  const scrollRef = useRef(null);

  // Auto-advance text reviews every 5 s
  useEffect(() => {
    if (tab !== "text") return;
    const t = setInterval(() => goText((activeText + 1) % textReviews.length), 5000);
    return () => clearInterval(t);
  }, [tab, activeText]);

  const goText = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setActiveText(idx); setAnimating(false); }, 250);
  };

  // Scroll the video row left / right (same pattern as the Courses scroller)
  const scrollVideos = (dir) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="tm-section" id="testimonials">

      {/* ── Section header ── */}
      <div className="tm-header">
        <div className="tm-eyebrow">
          <span className="tm-eyebrow-line" />
          <span className="tm-eyebrow-text">Success Stories</span>
          <span className="tm-eyebrow-line" />
        </div>
        <h2 className="tm-heading">What Our <span className="tm-accent">Students Say</span></h2>
        <p className="tm-subtext">
          Real voices, real results. Watch video testimonials or read what our graduates have to say.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div className="tm-tab-switcher">
        <button
          className={`tm-tab-btn ${tab === "video" ? "tm-tab-active" : ""}`}
          onClick={() => setTab("video")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          Video Reviews
        </button>
        <button
          className={`tm-tab-btn ${tab === "text" ? "tm-tab-active" : ""}`}
          onClick={() => setTab("text")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Written Reviews
        </button>
      </div>

      {/* ════════════════════════════════════════════
          VIDEO TAB — horizontal scroll row
          (exactly like the reference image)
      ════════════════════════════════════════════ */}
      {tab === "video" && (
        <div className="tm-video-section">

          {/* Scroll track */}
          <div className="tm-vscroll-track" ref={scrollRef}>
            {videoReviews.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>

          {/* Arrow buttons — bottom right, matching reference */}
          <div className="tm-vscroll-arrows">
            <button
              className="tm-varrow"
              onClick={() => scrollVideos(-1)}
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              className="tm-varrow"
              onClick={() => scrollVideos(1)}
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TEXT TAB — rotating featured card
      ════════════════════════════════════════════ */}
      {tab === "text" && (
        <div className="tm-text-section">

          {/* Featured review card */}
          <div className={`tm-featured ${animating ? "tm-fade-out" : "tm-fade-in"}`}>
            <div className="tm-featured-quote-mark">"</div>
            <p className="tm-featured-text">{textReviews[activeText].text}</p>
            <div className="tm-featured-meta">
              <div className="tm-avatar" style={{ background: textReviews[activeText].avatarBg }}>
                {textReviews[activeText].avatar}
              </div>
              <div className="tm-featured-info">
                <div className="tm-featured-name">{textReviews[activeText].name}</div>
                <div className="tm-featured-role">{textReviews[activeText].role}</div>
                <div className="tm-featured-loc">📍 {textReviews[activeText].location}</div>
              </div>
              <div className="tm-featured-right">
                <StarRating count={textReviews[activeText].rating} />
                <span className="tm-course-badge">{textReviews[activeText].course}</span>
              </div>
            </div>
          </div>

          {/* Selector pills */}
          <div className="tm-cards-row">
            {textReviews.map((r, i) => (
              <button
                key={r.id}
                className={`tm-mini-card ${i === activeText ? "tm-mini-active" : ""}`}
                onClick={() => goText(i)}
              >
                <div className="tm-mini-avatar" style={{ background: r.avatarBg }}>{r.avatar}</div>
                <div className="tm-mini-info">
                  <span className="tm-mini-name">{r.name}</span>
                  <span className="tm-mini-course">{r.course}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Prev / dots / next */}
          <div className="tm-controls">
            <button className="tm-arrow" onClick={() => goText((activeText - 1 + textReviews.length) % textReviews.length)} aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="tm-dots">
              {textReviews.map((_, i) => (
                <button key={i} className={`tm-dot ${i === activeText ? "tm-dot-active" : ""}`} onClick={() => goText(i)} aria-label={`Review ${i + 1}`}/>
              ))}
            </div>
            <button className="tm-arrow" onClick={() => goText((activeText + 1) % textReviews.length)} aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Stats bar — always visible ── */}
      <div className="tm-stats">
        <div className="tm-stat">
          <span className="tm-stat-num">4.9</span>
          <div className="tm-stat-stars"><StarRating count={5} /></div>
          <span className="tm-stat-lbl">Average Rating</span>
        </div>
        <div className="tm-stat-div" />
        <div className="tm-stat">
          <span className="tm-stat-num">2,400+</span>
          <span className="tm-stat-lbl">Happy Students</span>
        </div>
        <div className="tm-stat-div" />
        <div className="tm-stat">
          <span className="tm-stat-num">92%</span>
          <span className="tm-stat-lbl">Placement Rate</span>
        </div>
        <div className="tm-stat-div" />
        <div className="tm-stat">
          <span className="tm-stat-num">50+</span>
          <span className="tm-stat-lbl">Hiring Partners</span>
        </div>
      </div>

    </section>
  );
}
