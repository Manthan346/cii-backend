import "./HeroSection.css";
import hero from "../../assets/hero.png";

// HeroSection now shows only the animated graphic/image
// The heading text has been moved to the Home.jsx overlay on the building photo
export default function HeroSection() {
  return (
    <div className="hero-image-wrap">
      <img src={hero} alt="Skill Centre Visual" className="hero-img" />
    </div>
  );
}
