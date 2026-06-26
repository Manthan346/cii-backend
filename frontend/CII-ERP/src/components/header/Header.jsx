import "./Header.css";
// Change the line below to use relative pathing:
import header_logo_1 from "../../assets/header_logo_1.png";
import header_logo_3 from "../../assets/header_logo_3.png";

export default function Header() {
  return (
    <header className="header">
      <img src={header_logo_1} alt="Header-logo" />

      <img src={header_logo_3} alt="Header-logo" />
    </header>
  );
}
