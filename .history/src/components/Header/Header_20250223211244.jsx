import React, { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Menüyü açma/kapama fonksiyonu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header>
      <div className="header-wrapper">
        {/* Logo */}
        <div className="logo animated">
          <h1>Logo</h1>
        </div>

        {/* Menu Icon (Açma Butonu) */}
        <div className={`menu-icon animated ${isNavOpen ? "open" : ""}`} onClick={toggleNav}>
          <span></span>
          <span></span>
        </div>

        {/* Navigation */}
        <nav className={isNavOpen ? "open-nav" : ""}>
          {/* Close Icon (Kapama Butonu) */}
          <div className="close-icon" onClick={toggleNav}>
            <span></span>
            <span></span>
          </div>

          <div className="container">
            <ul>
              <li>
                <a href="javascript:void(0)">
                  <span>Home</span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <span>Work</span>
                  <span>Work</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <span>Services</span>
                  <span>Services</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <span>About</span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <span>Contact</span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;