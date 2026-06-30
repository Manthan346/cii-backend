import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./components/login/LoginPage";
import EventsPage from "./components/event/EventsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Registration" element={<Home />} />
      <Route path="/events" element={<EventsPage />} />
    </Routes>
  );
}

export default App;
