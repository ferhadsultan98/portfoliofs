import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { PiDevToLogo } from "react-icons/pi";
import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setIsHeaderVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`Header ${isHeaderVisible ? "visible" : "hidden"} ${
        isMenuOpen ? "menu-open" : ""
      }`}
    >
      <div className="header-container">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <h1 id="myLogo">
            <p>Farhad</p>
            <i>
              <PiDevToLogo
                style={{
                  color: "#5A1D60",
                  fontSize: "52px",
                  display: "flex",
                }}
              />
            </i>
          </h1>
        </Link>

        <div className="hamburger-menu">
          <Hamburger
            toggled={isMenuOpen}
            toggle={setIsMenuOpen}
            size={24}
            color="#5A1D60"
          />
        </div>

        <ul className={`Navbar ${isMenuOpen ? "open" : ""}`}>
          <li onClick={() => scrollToSection("projects")}>Projects</li>
          <li onClick={() => scrollToSection("about")}>About</li>
          <li onClick={() => scrollToSection("experiences")}>Experiences</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
