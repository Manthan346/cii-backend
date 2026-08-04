import Header      from "../../components/homepage/header/Header";
import Navbar      from "../../components/homepage/navbar/Navbar";
import HeroSection from "../../components/homepage/herosection/HeroSection";
import AboutUs     from "../../components/homepage/aboutus/AboutUs";
import Courses     from "../../components/homepage/courses/Courses";
import Showcase    from "../../components/homepage/showcase/Showcase";
import Testimonials from "../../components/homepage/testimonials/Testimonials";
import Footer      from "../../components/homepage/footer/Footer";
// import Registration from "../components/homepage/registration/Registration";
import EnquiryForm from "../../components/enquiryform/EnquiryForm";
import buildingImg  from "../../assets/abvkvk.jpg";

import "./Home.css";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />

      {/* ── Hero section: building image left, registration form right ── */}
      <section className="main-section" id="home">

        {/* Left — building photo */}
        <div className="hero-image-panel">
          <img src={buildingImg} alt="ABVKVK Skill Centre" className="hero-building-img" />
          {/* Overlay text on top of image */}
          <div className="hero-image-overlay">
            <p className="hero-overlay-tag">Atal Bihari Vajpayee Kaushalya Vikas Kendra</p>
            <h1 className="hero-overlay-heading">
              Making a Difference:<br />
              Touching Lives of<br />
              <span className="hero-overlay-accent">1 Million Youth</span><br />
              Annually
            </h1>
            <div className="hero-overlay-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">36+</span>
                <span className="hero-stat-lbl">Centres</span>
              </div>
              <div className="hero-stat-div" />
              <div className="hero-stat">
                <span className="hero-stat-num">25+</span>
                <span className="hero-stat-lbl">Programs</span>
              </div>
              <div className="hero-stat-div" />
              <div className="hero-stat">
                <span className="hero-stat-num">95%</span>
                <span className="hero-stat-lbl">Placed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — registration form */}
        <div className="hero-form-panel">
          <EnquiryForm />
        </div>

      </section>

      <AboutUs />
      <Courses />
      <Showcase />
      <Testimonials />
      <Footer />
    </>
  );
}
