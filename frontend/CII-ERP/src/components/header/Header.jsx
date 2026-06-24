import "./Header.css";
import logo from "../../assets/Logo.png";

export default function Header() {
    return (
        <header className="header">
            <img src={logo} alt="Logo" />

            <div className="header-center">
                <h2>CII - Rahul Bajaj</h2>

                <p>
                    Centre of Excellence on Skills
                    <br />
                    Enhancing Workforce Productivity
                </p>
            </div>

            <img src={logo} alt="Logo" />
        </header>
    );
}