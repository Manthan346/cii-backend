// App.jsx — corrected routing for CandidatePage
//
// Your current App.jsx has:
//   <Route path="" element={<CandidatePage/>} />
//
// An empty path string doesn't reliably match anything — React Router
// needs either a concrete path or a wildcard. Since CandidateDashboard
// internally renders its own <Routes> for "/", "/my-courses", and
// "/my-profile" (via each module's Sidebar <Link> components), the
// parent route here must use a wildcard "/*" so those nested paths
// can match through to it.
//
// Replace this line:
//   <Route path="" element={<CandidatePage/>} />
//
// With:
//   <Route path="/*" element={<CandidatePage/>} />

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage/Home";
import LoginPage from "./components/login/LoginPage";
import EventsPage from "./components/event/EventsPage";
import CandidatePage from "./pages/CandidateDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import MobilizerDashboard from "./pages/MobilizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Registration" element={<Home />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/trainer/*" element={<TrainerDashboard />} />
      <Route path="/mobilizer/*" element={<MobilizerDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/*" element={<CandidatePage />} />
      <Route path="/recruiter/*" element={<RecruiterDashboard />} />
    </Routes>
  );
}

export default App;
