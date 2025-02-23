import React, { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar'ı açma fonksiyonu
  const showSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Sidebar'ı kapatma fonksiyonu
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header>
        {/* Logo */}
        <img
          src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg"
          alt="Logo"
          className="logo"
        />

        {/* Navigation */}
        <nav>
          {/* Desktop Menü */}
          <ul className="navlinks">
            <li className="items">
              <a href="#">Home</a>
            </li>
            <li className="items">
              <a href="#">Services</a>
            </li>
            <li className="items">
              <a href="#">Blog</a>
            </li>
            <li className="items">
              <a href="#">About-Us</a>
            </li>
            <li>
              <a href="#">
                <button>Contact Us</button>
              </a>
            </li>
            {/* Mobile Menu Icon */}
            <li onClick={showSidebar}>
              <a href="#">
                <ion-icon name="menu-outline"></ion-icon>
              </a>
            </li>
          </ul>

          {/* Sidebar (Mobile Menü) */}
          <ul className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <li onClick={closeSidebar}>
              <a href="#">
                <ion-icon name="close-outline"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">About-Us</a>
            </li>
            <img
              src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg"
              alt="Sidebar Logo"
            />
          </ul>
        </nav>
      </header>

      {/* Açıklama Metni */}
      <h2>Adjust the screen to Mobile View to observe the reactions on navigation bar</h2>

      {/* Ionicons Script */}
      <script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
      ></script>
      <script
        nomodule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
      ></script>
    </>
  );
};

export default Header;