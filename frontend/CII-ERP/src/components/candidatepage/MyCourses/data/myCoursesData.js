// myCoursesData.js
// Static course data for the My Courses screen.
// DELETE static imports below and use the useEffect fetches when API is ready.
//
// ─── Backend hookup ───────────────────────────────────────────
//
// In MyCourses_Screen/MyCourses.jsx, replace static data with:
//
//   const [courses, setCourses]   = useState([]);
//   const [stats, setStats]       = useState([]);
//
//   useEffect(() => {
//     fetch('/api/courses')
//       .then(r => r.json())
//       .then(data =>
//         setCourses(
//           data.map(c => ({
//             id:           c.id,
//             tag:          c.categoryLabel,
//             tagColor:     c.categoryBgColor,
//             tagTextColor: c.categoryTextColor,
//             company:      c.partnerName,
//             desc:         c.shortDescription,
//             upcoming:     c.isUpcoming,
//             applied:      c.isApplied,
//             status:       c.enrollmentStatus,  // 'in-progress' | 'completed' | 'enrolled'
//             progress:     c.progressPct,
//             logoSrc:      c.logoUrl,
//           }))
//         )
//       );
//
//     fetch('/api/candidate/stats')
//       .then(r => r.json())
//       .then(data =>
//         setStats(
//           data.map(s => ({
//             label:     s.label,
//             value:     s.value,
//             iconBg:    s.iconBgColor,
//             iconColor: s.iconColor,
//             icon:      s.iconName,
//           }))
//         )
//       );
//   }, []);
//
// ──────────────────────────────────────────────────────────────

import bluestarLogo from '../../../Assets/bluestar-logo.png';
import itcLogo      from '../../../Assets/itc-logo.png';
import cosmicLogo   from '../../../Assets/OIP (1).jpg';
import nasscomLogo  from '../../../Assets/dsci-logo.png';
import kalpataru    from '../../../Assets/kalpataru-logo.png';
import nihonLogo    from '../../../Assets/nihon edutech-logo.png';
import apparelLogo  from '../../../Assets/aparrel-logo.png';
import bajajLogo    from '../../../Assets/bajaj-logo.png';
import jubilantLogo from '../../../Assets/jubliant-logo.png';
import lorealLogo   from '../../../Assets/loreal-logo.png';
import ciscoLogo    from '../../../Assets/cisco-logo.png';
import vfsLogo      from '../../../Assets/vfs-global-logo.png';

export const courseCards = [
  {
    id: 1,
    tag: 'RAC SERVICING',
    tagColor: '#E6EEF8',
    tagTextColor: '#003C7E',
    company: 'Blue Star',
    desc: 'Refrigeration & Air Conditioning Servicing – professional roles in AC service, maintenance and repair.',
    upcoming: false,
    applied: true,
    status: 'in-progress',
    progress: 60,
    logoSrc: bluestarLogo,
  },
  {
    id: 2,
    tag: 'HOTEL MANAGEMENT',
    tagColor: '#FFF5E0',
    tagTextColor: '#B8892A',
    company: 'ITC Hotels Limited',
    desc: 'Hotel Management Certification, F&B Service, F&B Production, Room Service & Front Desk Operations.',
    upcoming: false,
    applied: true,
    status: 'completed',
    progress: 100,
    logoSrc: itcLogo,
  },
  {
    id: 3,
    tag: 'GRAPHIC DESIGN & VFX',
    tagColor: '#F0EBFF',
    tagTextColor: '#7C3AED',
    company: 'Cosmos Creative Academy',
    desc: 'Graphic Design, 3D, VFX, Game Design & Generative AI – roles as Designer, Animator, VFX Artist.',
    upcoming: false,
    applied: true,
    status: 'enrolled',
    progress: 10,
    logoSrc: cosmicLogo,
  },
  {
    id: 4,
    tag: 'CYBER SECURITY',
    tagColor: '#E0F5FA',
    tagTextColor: '#0891B2',
    company: 'NASSCOM – DSCI',
    desc: 'High-level positions focused on data security, analysis and management within the IT sector.',
    upcoming: false,
    logoSrc: nasscomLogo,
  },
  {
    id: 5,
    tag: 'HOUSEKEEPING',
    tagColor: '#E6EEF8',
    tagTextColor: '#003C7E',
    company: 'PSIPL – Kalpataru',
    desc: 'Professional housekeeping and facility management roles in corporate environments.',
    upcoming: false,
    logoSrc: kalpataru,
  },
  {
    id: 6,
    tag: 'JAPANESE LANGUAGE',
    tagColor: '#FFE8E8',
    tagTextColor: '#C0392B',
    company: 'Nihon Edutech',
    desc: 'Japanese Language Training – employment opportunities in Japan in manufacturing and nursing industries.',
    upcoming: false,
    logoSrc: nihonLogo,
  },
  {
    id: 7,
    tag: 'FASHION DESIGNING',
    tagColor: '#F0EBFF',
    tagTextColor: '#7C3AED',
    company: 'Apparel Sector',
    desc: 'Sewing Machine Operator & Fashion Designing – specialized roles in garments and textile manufacturing.',
    upcoming: false,
    logoSrc: apparelLogo,
  },
  {
    id: 8,
    tag: 'BFSI SKILL TRAINING',
    tagColor: '#E6EEF8',
    tagTextColor: '#003C7E',
    company: 'Bajaj Finserv',
    desc: 'Banking, Financial Services & Insurance Skill Training – entry-level positions in Insurance and Sales.',
    upcoming: false,
    logoSrc: bajajLogo,
  },
  {
    id: 9,
    tag: 'QUICK SERVICE RESTAURANTS',
    tagColor: '#E2F4EE',
    tagTextColor: '#0D6E50',
    company: 'Jubilant Food Works',
    desc: "Training for roles in the restaurant and hotel Quick Service sector with one of India's top F&B brands.",
    upcoming: false,
    logoSrc: jubilantLogo,
  },
  {
    id: 10,
    tag: 'BEAUTY & MAKE UP',
    tagColor: '#FFE8F5',
    tagTextColor: '#A0297A',
    company: "L'Oreal India",
    desc: 'Hairdressing Training, Beauty & Make Up Training, and Beauty Advisor Training. Batches coming soon.',
    upcoming: true,
    logoSrc: lorealLogo,
  },
  {
    id: 11,
    tag: 'ARTIFICIAL INTELLIGENCE',
    tagColor: '#E0F5FA',
    tagTextColor: '#0891B2',
    company: 'Cisco',
    desc: 'Artificial Intelligence (AI) training powered by Cisco. Stay connected for upcoming batch details.',
    upcoming: true,
    logoSrc: ciscoLogo,
  },
  {
    id: 12,
    tag: 'RETAIL & AI TRAINING',
    tagColor: '#E6EEF8',
    tagTextColor: '#0055B3',
    company: 'VFS Global Academy',
    desc: 'Retail & AI training with VFS Global Academy. Stay connected for upcoming batch details.',
    upcoming: true,
    logoSrc: vfsLogo,
  },
];

export const candidateStats = [
  { label: 'Total Enrolled', value: '3',   iconBg: '#E6EEF8', iconColor: '#003C7E', icon: 'courses'      },
  { label: 'In Progress',    value: '2',   iconBg: '#FFF5E0', iconColor: '#B8892A', icon: 'dashboard'    },
  { label: 'Completed',      value: '1',   iconBg: '#E2F4EE', iconColor: '#0D6E50', icon: 'certificates' },
  { label: 'Learning Time',  value: '48h', iconBg: '#FFF0EB', iconColor: '#E05A2B', icon: 'assessments'  },
];
