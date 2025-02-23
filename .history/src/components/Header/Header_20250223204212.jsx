// Header.jsx (Only showing changes, rest remains the same)
import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { PiDevToLogo } from "react-icons/pi";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Rest of the functions remain the same (scrollToSection, handleScroll, useEffect)

  return (
    <header className={`header ${isHeaderVisible ? "header--visible" : "header--hidden"}`}>
      <div className="header__logo" title="Farhad Sultanov">
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <h1 className="logo-text">
            <span>Farhad</span>
            <PiDevToLogo className="logo-icon" />
          </h1>
        </a>
      </div>
      <nav className="header__nav">
        <Hamburger
          toggled={isMenuOpen}
          toggle={setIsMenuOpen}
          color="#5a1d60"
        />
        <ul className={`nav-menu ${isMenuOpen ? "nav-menu--active" : "nav-menu--inactive"}`}>
          {["projects", "about", "experience"].map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;