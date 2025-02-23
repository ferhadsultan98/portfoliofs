import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { PiDevToLogo } from "react-icons/pi";
import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll durumuna göre header'ın görünürlüğünü kontrol etme
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

  // Belirli bir bölüme kaydırma fonksiyonu
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Menüyü kapat
  };

  return (
   <header className="Header">

        <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <h1 id="myLogo">
            <p>Farhad</p>
            <i>
              <PiDevToLogo style={{ color: "#5A1D60", fontSize: "52px", display: 'flex'}} />
            </i>
          </h1>
        </Link>
<ul className="Navbar">
  <ul>Projects</ul>
</ul>
   </header>

  );
};

export default Header;