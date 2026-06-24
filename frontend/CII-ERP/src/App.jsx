import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./components/login/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Registration" element={<Home />} />
    </Routes>
  );
}

export default App;
