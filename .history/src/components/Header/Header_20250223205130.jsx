import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const logoRef = useRef(null);
  const menuIconRef = useRef(null);

  // Handle animations on mount
  useEffect(() => {
    if (logoRef.current && menuIconRef.current) {
      logoRef.current.classList.add('animated');
      menuIconRef.current.classList.add('animated');
    }
  }, []);

  // Toggle navigation
  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <>
      <header>
        <div className="header-wrapper">
          <div className="logo" ref={logoRef}>
            <h1>Logo</h1>
          </div>
          <div className="menu-icon" ref={menuIconRef} onClick={toggleNav}>
            <span></span>
            <span></span>
          </div>
          <nav className={isNavOpen ? 'open-nav' : ''}>
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
      <main>
        <h1 className="title">This is a header with some animation!</h1>
      </main>
    </>
  );
};

export default Header;