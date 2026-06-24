import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import Registration from "../components/registration/Registration";
import HeroSection from "../components/herosection/HeroSection";

import "./Home.css";

export default function Home() {
    return (
        <>
            <Header />

            <Navbar />

            <section className="main-section">

                <div className="left-panel">
                    <Registration />
                </div>

                <div className="right-panel">
                    <HeroSection />
                </div>

            </section>
        </>
    );
}

