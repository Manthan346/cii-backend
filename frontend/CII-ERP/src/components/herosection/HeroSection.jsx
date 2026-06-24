import "./HeroSection.css";
import hero from "../../assets/hero.png";

export default function HeroSection() {
    return (
        <>
            <div className="hero-text">
                <h1>
                    Making a Difference:
                    <br />
                    Touching Lives of 1 Million Youth Annually
                </h1>
            </div>

            <div className="hero-image">
                <img src={hero} alt="Hero" />
            </div>
        </>
    );
}