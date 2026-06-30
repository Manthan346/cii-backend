import React, { useState, useMemo } from "react";
import Header from "../homepage/header/Header";
import Navbar from "../homepage/navbar/Navbar";
import Footer from "../homepage/footer/Footer";
import "./EventsPage.css";

// ─────────────────────────────────────────────────────────────
// PAST EVENTS DATA
// ─────────────────────────────────────────────────────────────
const pastEvents = [
  {
    id: 4,
    title: "Annual Graduation Ceremony 2024",
    date: "December 10, 2024",
    dateObj: new Date("2024-12-10"),
    location: "Nehru Centre, Mumbai",
    category: "Ceremony",
    description:
      "Over 800 trainees received their certificates of completion, joined by industry partners and government dignitaries. The ceremony celebrated milestones achieved across all 36+ centres.",
    coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&auto=format&fit=crop&q=80",
    attendees: 1200,
    outcomes: [
      { icon: "🎓", label: "Certificates Issued", value: "800+" },
      { icon: "🏢", label: "Industry Partners", value: "25" },
      { icon: "⭐", label: "Satisfaction Rate", value: "98%" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80", caption: "Certificate distribution ceremony" },
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80", caption: "Opening address by director" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80", caption: "Trainees on stage" },
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", caption: "Guest of honour felicitation" },
    ],
    reviews: [
      { name: "Priya Sharma", role: "Graduate – Hotel Management", rating: 5, comment: "An incredibly emotional and proud moment. The ceremony was beautifully organized and felt truly special.", avatar: "PS", bg: "#ec4899" },
      { name: "Arjun Patil", role: "Graduate – Cyber Security", rating: 5, comment: "Seeing 800 of us receive certificates together was overwhelming. CII has truly changed my life trajectory.", avatar: "AP", bg: "#0c2d72" },
    ],
  },
  {
    id: 5,
    title: "Digital Literacy Drive – Rural Centres",
    date: "October 5, 2024",
    dateObj: new Date("2024-10-05"),
    location: "Nagpur & Nashik Centres",
    category: "Drive",
    description:
      "A two-day intensive digital literacy drive reaching over 500 rural youth across six ABVKVK centres. Sessions covered basic computing, internet safety, and digital payments.",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80",
    attendees: 520,
    outcomes: [
      { icon: "💻", label: "Youth Trained", value: "520+" },
      { icon: "🏫", label: "Centres Covered", value: "6" },
      { icon: "📱", label: "Digital Skills", value: "3 Modules" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80", caption: "Hands-on computer training" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80", caption: "Rural youth learning digital skills" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", caption: "Instructor-led session at Nagpur centre" },
    ],
    reviews: [
      { name: "Sunita Borde", role: "Participant – Nagpur Centre", rating: 5, comment: "I had never used a computer before this drive. Now I can make UPI payments and use the internet confidently!", avatar: "SB", bg: "#14b8a6" },
    ],
  },
  {
    id: 6,
    title: "Placement Fair – Hospitality Sector",
    date: "September 14, 2024",
    dateObj: new Date("2024-09-14"),
    location: "Hotel Taj, Aurangabad",
    category: "Placement",
    description:
      "Top hotel chains interviewed 300+ candidates from our Food & Beverage and Front Office programs. 78% of candidates received offer letters on the same day, marking our highest placement rate.",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80",
    attendees: 340,
    outcomes: [
      { icon: "💼", label: "Offer Letters", value: "234" },
      { icon: "🏨", label: "Hotel Partners", value: "12" },
      { icon: "📈", label: "Placement Rate", value: "78%" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80", caption: "Interview rounds in progress" },
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", caption: "Offer letters being distributed" },
      { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80", caption: "Panel of hospitality recruiters" },
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80", caption: "Selected candidates group photo" },
    ],
    reviews: [
      { name: "Rahul Deshmukh", role: "Placed – Taj Hotels", rating: 5, comment: "I got my offer letter the same day! The CII training gave me the confidence to ace the interview.", avatar: "RD", bg: "#f97316" },
      { name: "Meera Joshi", role: "Placed – Marriott", rating: 4, comment: "Great event, very professional. I was nervous but the interviewers were kind and the preparation from CII really helped.", avatar: "MJ", bg: "#6366f1" },
    ],
  },
  {
    id: 7,
    title: "Republic Day Skill Showcase",
    date: "January 26, 2024",
    dateObj: new Date("2024-01-26"),
    location: "Chembur Training Centre",
    category: "Showcase",
    description:
      "Live demonstrations of automotive repair, tailoring, and IT skills by trainees for the public and press. The event drew significant media coverage and highlighted the impact of vocational education.",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80",
    attendees: 680,
    outcomes: [
      { icon: "📺", label: "Media Coverage", value: "8 Outlets" },
      { icon: "🛠️", label: "Skills Showcased", value: "5" },
      { icon: "👥", label: "Public Visitors", value: "680" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80", caption: "Automotive repair live demo" },
      { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80", caption: "Tailoring skills exhibition" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", caption: "IT skills demo booth" },
    ],
    reviews: [
      { name: "Vijay Kumar", role: "Press – Maharashtra Times", rating: 5, comment: "Impressive showcase of practical skills. These young trainees demonstrated professional-level competency.", avatar: "VK", bg: "#8b5cf6" },
    ],
  },
  {
    id: 8,
    title: "Industry Connect Summit 2023",
    date: "November 18, 2023",
    dateObj: new Date("2023-11-18"),
    location: "CII Convention Centre, Pune",
    category: "Summit",
    description:
      "Annual industry connect summit bringing together 40+ corporates and 500 skill graduates. Keynote sessions on future of work, AI in manufacturing, and green skills.",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80",
    attendees: 620,
    outcomes: [
      { icon: "🤝", label: "MoUs Signed", value: "8" },
      { icon: "🏢", label: "Corporates", value: "40+" },
      { icon: "💼", label: "Jobs Pledged", value: "1,200" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80", caption: "Summit keynote session" },
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", caption: "Panel discussion on future skills" },
      { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80", caption: "MoU signing ceremony" },
    ],
    reviews: [
      { name: "Dr. Ananya Singh", role: "HR Director – Tech Corp", rating: 5, comment: "The quality of CII graduates continues to impress us. We signed an MoU to hire 200 more this year.", avatar: "AS", bg: "#0c2d72" },
    ],
  },
  {
    id: 9,
    title: "Women in Skills Workshop",
    date: "March 8, 2023",
    dateObj: new Date("2023-03-08"),
    location: "Dadar Training Centre, Mumbai",
    category: "Workshop",
    description:
      "A special workshop on International Women's Day celebrating 300+ women graduates and providing mentorship sessions with women industry leaders.",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80",
    attendees: 380,
    outcomes: [
      { icon: "👩", label: "Women Graduates", value: "300+" },
      { icon: "🎤", label: "Mentors", value: "15" },
      { icon: "🌟", label: "Scholarships", value: "50" },
    ],
    photos: [
      { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", caption: "Women graduates panel" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80", caption: "Mentorship sessions" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", caption: "Certificate and scholarship distribution" },
    ],
    reviews: [
      { name: "Kavita Rao", role: "Graduate – Fashion Design", rating: 5, comment: "This event made me realise I am not alone in my journey. The mentors shared stories that gave me strength.", avatar: "KR", bg: "#ec4899" },
    ],
  },
];

const upcomingEvents = [];

const CATEGORY_COLORS = {
  Summit:    "#0f2463",
  Workshop:  "#10b981",
  Networking:"#6366f1",
  Ceremony:  "#ec4899",
  Drive:     "#14b8a6",
  Placement: "#f97316",
  Showcase:  "#8b5cf6",
};

const EVENTS_PER_PAGE = 3;

// ─── Star rating component ────────────────────────────────────
function Stars({ rating, size = 14 }) {
  return (
    <span className="ep-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= rating ? "#f4c542" : "none"}
          stroke={i <= rating ? "#f4c542" : "#94a3b8"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

// ─── Review Modal ─────────────────────────────────────────────
function ReviewModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", role: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [localReviews, setLocalReviews] = useState(event.reviews || []);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    const initials = form.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["#0c2d72","#ec4899","#14b8a6","#f97316","#8b5cf6","#10b981"];
    const newReview = {
      name: form.name,
      role: form.role || "Event Attendee",
      rating: form.rating,
      comment: form.comment,
      avatar: initials,
      bg: colors[Math.floor(Math.random() * colors.length)],
    };
    setLocalReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    setForm({ name: "", role: "", rating: 5, comment: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal-box" onClick={e => e.stopPropagation()}>
        <div className="ep-modal-header">
          <div>
            <h3 className="ep-modal-title">Guest Reviews</h3>
            <p className="ep-modal-subtitle">{event.title}</p>
          </div>
          <button className="ep-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Write review form */}
        <div className="ep-review-form-wrap">
          <h4 className="ep-review-form-title">Share Your Experience</h4>
          {submitted && (
            <div className="ep-review-success">✅ Thank you! Your review has been submitted.</div>
          )}
          <form onSubmit={handleSubmit} className="ep-review-form">
            <div className="ep-review-row">
              <div className="ep-review-field">
                <label>Your Name *</label>
                <input
                  type="text" placeholder="Full name" required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="ep-review-field">
                <label>Your Role / Designation</label>
                <input
                  type="text" placeholder="e.g. Graduate – Hotel Management"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                />
              </div>
            </div>
            <div className="ep-review-field">
              <label>Rating *</label>
              <div className="ep-star-picker">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i} type="button"
                    className="ep-star-btn"
                    onMouseEnter={() => setHoveredStar(i)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setForm(f => ({ ...f, rating: i }))}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24"
                      fill={i <= (hoveredStar || form.rating) ? "#f4c542" : "none"}
                      stroke={i <= (hoveredStar || form.rating) ? "#f4c542" : "#cbd5e1"}
                      strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                <span className="ep-star-label">
                  {["","Poor","Fair","Good","Great","Excellent"][hoveredStar || form.rating]}
                </span>
              </div>
            </div>
            <div className="ep-review-field">
              <label>Your Review *</label>
              <textarea
                placeholder="Tell us about your experience at this event..."
                required rows={3}
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              />
            </div>
            <button type="submit" className="ep-review-submit">Submit Review</button>
          </form>
        </div>

        {/* Existing reviews */}
        <div className="ep-reviews-list">
          <h4 className="ep-reviews-list-title">
            {localReviews.length} Review{localReviews.length !== 1 ? "s" : ""}
          </h4>
          {localReviews.length === 0 ? (
            <p className="ep-reviews-empty">No reviews yet. Be the first to share your experience!</p>
          ) : (
            localReviews.map((r, i) => (
              <div className="ep-review-item" key={i}>
                <div className="ep-review-avatar" style={{ background: r.bg }}>{r.avatar}</div>
                <div className="ep-review-content">
                  <div className="ep-review-top">
                    <div>
                      <span className="ep-review-name">{r.name}</span>
                      <span className="ep-review-role">{r.role}</span>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="ep-review-comment">{r.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function EventsPage() {
  const [lightbox, setLightbox]       = useState(null);
  const [reviewEvent, setReviewEvent] = useState(null);
  const [sortBy, setSortBy]           = useState("newest");
  const [filterYear, setFilterYear]   = useState("all");
  const [filterCat, setFilterCat]     = useState("all");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const openLightbox  = (photos, index = 0) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prevPhoto     = () => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length }));
  const nextPhoto     = () => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % lb.photos.length }));

  // Unique years from events
  const years = useMemo(() => {
    const ys = [...new Set(pastEvents.map(e => e.dateObj.getFullYear()))].sort((a,b) => b - a);
    return ys;
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    return [...new Set(pastEvents.map(e => e.category))].sort();
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...pastEvents];

    if (filterYear !== "all")
      list = list.filter(e => e.dateObj.getFullYear() === parseInt(filterYear));

    if (filterCat !== "all")
      list = list.filter(e => e.category === filterCat);

    if (dateFrom)
      list = list.filter(e => e.dateObj >= new Date(dateFrom));

    if (dateTo)
      list = list.filter(e => e.dateObj <= new Date(dateTo));

    if (sortBy === "newest")
      list.sort((a, b) => b.dateObj - a.dateObj);
    else if (sortBy === "oldest")
      list.sort((a, b) => a.dateObj - b.dateObj);

    return list;
  }, [sortBy, filterYear, filterCat, dateFrom, dateTo]);

  // Pagination
  const totalPages  = Math.ceil(filtered.length / EVENTS_PER_PAGE);
  const paginated   = filtered.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE);

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSortBy("newest");
    setFilterYear("all");
    setFilterCat("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const hasActiveFilters = filterYear !== "all" || filterCat !== "all" || dateFrom || dateTo || sortBy !== "newest";

  return (
    <div className="events-page">
      <Header />
      <Navbar />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="ep-hero">
        <div className="ep-hero__inner">
          <div>
            <div className="ep-eyebrow">Events &amp; Programmes</div>
            <h1 className="ep-hero__title">Where Skills Meet<br />Opportunity</h1>
            <p className="ep-hero__sub">
              Summits, placement drives, and community events across all 36+ CII centres — bringing industry and youth together.
            </p>
          </div>
          <div className="ep-hero__stats">
            <div className="ep-stat">
              <span className="ep-stat__num">120+</span>
              <span className="ep-stat__label">Events Hosted</span>
            </div>
            <div className="ep-stat">
              <span className="ep-stat__num">50K+</span>
              <span className="ep-stat__label">Attendees</span>
            </div>
            <div className="ep-stat">
              <span className="ep-stat__num">36+</span>
              <span className="ep-stat__label">Centres</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────── */}
      <section className="ep-section" id="upcoming">
        <div className="ep-section__inner">
          <div className="ep-eyebrow">Don't Miss Out</div>
          <h2 className="ep-section__title">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="ep-empty">
              <div className="ep-empty__icon">📅</div>
              <h3 className="ep-empty__heading">No Upcoming Events</h3>
              <p className="ep-empty__text">
                There are no events scheduled at the moment.<br />
                Check back soon — new events are added regularly.
              </p>
            </div>
          ) : (
            <div className="ep-upcoming-grid">
              {upcomingEvents.map(event => <UpcomingCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>

      <div className="ep-divider-wrap"><hr className="ep-divider" /></div>

      {/* ── Past Events ───────────────────────────── */}
      <section className="ep-section ep-section--grey" id="past">
        <div className="ep-section__inner">
          <div className="ep-eyebrow">Highlights</div>
          <h2 className="ep-section__title">Past Events</h2>

          {/* ── Filter & Sort Bar ── */}
          <div className="ep-filter-bar">
            <div className="ep-filter-group">
              <label className="ep-filter-label">Sort By</label>
              <select className="ep-filter-select" value={sortBy} onChange={e => handleFilterChange(setSortBy)(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="ep-filter-group">
              <label className="ep-filter-label">Year</label>
              <select className="ep-filter-select" value={filterYear} onChange={e => handleFilterChange(setFilterYear)(e.target.value)}>
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="ep-filter-group">
              <label className="ep-filter-label">Category</label>
              <select className="ep-filter-select" value={filterCat} onChange={e => handleFilterChange(setFilterCat)(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="ep-filter-group">
              <label className="ep-filter-label">From Date</label>
              <input type="date" className="ep-filter-date" value={dateFrom} onChange={e => handleFilterChange(setDateFrom)(e.target.value)} />
            </div>
            <div className="ep-filter-group">
              <label className="ep-filter-label">To Date</label>
              <input type="date" className="ep-filter-date" value={dateTo} onChange={e => handleFilterChange(setDateTo)(e.target.value)} />
            </div>
            {hasActiveFilters && (
              <button className="ep-filter-reset" onClick={resetFilters}>✕ Reset</button>
            )}
          </div>

          {/* Results count */}
          <div className="ep-results-info">
            Showing <strong>{filtered.length}</strong> event{filtered.length !== 1 ? "s" : ""}
            {filterYear !== "all" && ` in ${filterYear}`}
            {filterCat !== "all" && ` · ${filterCat}`}
          </div>

          {/* Event list */}
          {paginated.length === 0 ? (
            <div className="ep-empty">
              <div className="ep-empty__icon">🔍</div>
              <h3 className="ep-empty__heading">No Events Found</h3>
              <p className="ep-empty__text">Try adjusting your filters or <button className="ep-empty-reset-link" onClick={resetFilters}>reset all filters</button>.</p>
            </div>
          ) : (
            <div className="ep-past-list">
              {paginated.map((event, idx) => (
                <PastCard
                  key={event.id}
                  event={event}
                  reverse={idx % 2 !== 0}
                  onViewPhotos={() => openLightbox(event.photos, 0)}
                  onReview={() => setReviewEvent(event)}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="ep-pagination">
              <button
                className="ep-page-btn ep-page-arrow"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isEllipsis = totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages;
                if (isEllipsis) return null;
                return (
                  <button
                    key={page}
                    className={`ep-page-btn ${currentPage === page ? "ep-page-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="ep-page-btn ep-page-arrow"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <span className="ep-page-info">Page {currentPage} of {totalPages}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────── */}
      {lightbox && (
        <div className="ep-lightbox" onClick={closeLightbox}>
          <div className="ep-lightbox__box" onClick={e => e.stopPropagation()}>
            <button className="ep-lightbox__close" onClick={closeLightbox}>✕</button>
            <img src={lightbox.photos[lightbox.index].url} alt={lightbox.photos[lightbox.index].caption} className="ep-lightbox__img" />
            <div className="ep-lightbox__caption">{lightbox.photos[lightbox.index].caption}</div>
            <div className="ep-lightbox__controls">
              <button className="ep-lightbox__btn" onClick={prevPhoto}>‹</button>
              <span className="ep-lightbox__counter">{lightbox.index + 1} / {lightbox.photos.length}</span>
              <button className="ep-lightbox__btn" onClick={nextPhoto}>›</button>
            </div>
            <div className="ep-lightbox__thumbs">
              {lightbox.photos.map((p, i) => (
                <img key={i} src={p.url} alt={p.caption}
                  className={`ep-lightbox__thumb${i === lightbox.index ? " ep-lightbox__thumb--active" : ""}`}
                  onClick={() => setLightbox(lb => ({ ...lb, index: i }))}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Review Modal ─────────────────────────── */}
      {reviewEvent && <ReviewModal event={reviewEvent} onClose={() => setReviewEvent(null)} />}

      <Footer />
    </div>
  );
}

/* ── Upcoming Card ───────────────────────────────────────────── */
function UpcomingCard({ event }) {
  const catColor = CATEGORY_COLORS[event.category] || "#0f2463";
  return (
    <div className="ep-ucard">
      <div className="ep-ucard__img-wrap">
        <img src={event.image} alt={event.title} className="ep-ucard__img" />
        <span className="ep-ucard__cat" style={{ background: catColor }}>{event.category}</span>
      </div>
      <div className="ep-ucard__body">
        <div className="ep-ucard__date-row">
          <span>{event.date}</span>
          <span className="ep-ucard__dot" />
          <span>{event.time}</span>
        </div>
        <h3 className="ep-ucard__title">{event.title}</h3>
        <p className="ep-ucard__desc">{event.description}</p>
        <div className="ep-ucard__location"><PinIcon /> {event.location}</div>
        <div className="ep-ucard__seats"><strong>{event.seatsLeft}</strong> seats remaining of {event.seats}</div>
      </div>
    </div>
  );
}

/* ── Past Event Card ─────────────────────────────────────────── */
function PastCard({ event, reverse, onViewPhotos, onReview }) {
  const catColor = CATEGORY_COLORS[event.category] || "#0f2463";
  const avgRating = event.reviews?.length
    ? Math.round(event.reviews.reduce((s, r) => s + r.rating, 0) / event.reviews.length)
    : 0;

  return (
    <div className={`ep-pcard${reverse ? " ep-pcard--reverse" : ""}`}>
      {/* Image side */}
      <div className="ep-pcard__img-wrap">
        <img src={event.coverImage} alt={event.title} className="ep-pcard__img" />
        <span className="ep-pcard__cat" style={{ background: catColor }}>{event.category}</span>
        <button className="ep-pcard__photo-btn" onClick={onViewPhotos}>
          <GalleryIcon /> View {event.photos.length} Photos
        </button>
      </div>

      {/* Content side */}
      <div className="ep-pcard__body">
        <div className="ep-pcard__date">{event.date}</div>
        <h3 className="ep-pcard__title">{event.title}</h3>
        <p className="ep-pcard__desc">{event.description}</p>

        {/* ── Event Outcomes ── */}
        <div className="ep-outcomes">
          <div className="ep-outcomes-label">Event Outcomes</div>
          <div className="ep-outcomes-grid">
            {event.outcomes.map((o, i) => (
              <div className="ep-outcome-chip" key={i}>
                <span className="ep-outcome-icon">{o.icon}</span>
                <div className="ep-outcome-text">
                  <span className="ep-outcome-value">{o.value}</span>
                  <span className="ep-outcome-lbl">{o.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ep-pcard__meta">
          <div className="ep-pcard__meta-item"><PinIcon /><span>{event.location}</span></div>
          <div className="ep-pcard__meta-item"><PeopleIcon /><span><strong>{event.attendees.toLocaleString()}</strong> attended</span></div>
        </div>

        {/* ── Action buttons ── */}
        <div className="ep-pcard__actions">
          <button className="ep-pcard__gallery-btn" onClick={onViewPhotos}>
            <GalleryIcon /> View Event Photos
          </button>
          <button className="ep-pcard__review-btn" onClick={onReview}>
            <ReviewIcon />
            {event.reviews?.length > 0 ? (
              <>
                <Stars rating={avgRating} size={12} />
                <span>({event.reviews.length})</span>
              </>
            ) : "Add Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PeopleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const GalleryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const ReviewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
