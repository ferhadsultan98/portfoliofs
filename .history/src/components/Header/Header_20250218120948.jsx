import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { PiDevToLogo } from "react-icons/pi";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${isHeaderVisible ? "visible" : "hidden"}`}>
      <div className="logo" title="Farhad Sultanov">
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <h1 id="myLogo">
            <p>Farhad</p>
            <i>
              <PiDevToLogo style={{ color: "#5A1D60", fontSize: "52px", display: 'flex'}} />
            </i>
          </h1>
        </a>
      </div>
      <div className="header-right">
        <i>
          <Hamburger
            toggled={isMenuOpen}
            toggle={setIsMenuOpen}
            color="#5a1d60"
          />
        </i>
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("experience");
              }}
            >
              Experience
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
