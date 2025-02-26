import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiHomeLine } from "react-icons/ri";
import { CgWorkAlt } from "react-icons/cg";
import { IoMdInformationCircleOutline } from "react-icons/io";
import "./AdminSidebar.scss";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";

const AdminSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`sidebar-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <FaBars />
      </button>

      <div className={`sideBar ${isMenuOpen ? "mobile-open" : ""}`}>
        <ul>
          <NavLink to="admin-main" className={"navlink"} onClick={() => setIsMenuOpen(false)}>
            <li>
              <i>
                <RiHomeLine />
              </i>
              Main
            </li>
          </NavLink>
          <NavLink to="admin-projects" className={"navlink"} onClick={() => setIsMenuOpen(false)}>
            <li>
              <i>
                <CgWorkAlt />
              </i>
              Projects
            </li>
          </NavLink>
          <NavLink to="admin-about" className={"navlink"} onClick={() => setIsMenuOpen(false)}>
            <li>
              <i>
                <IoMdInformationCircleOutline />
              </i>
              About
            </li>
          </NavLink>
          <NavLink to="admin-experience" className={"navlink"} onClick={() => setIsMenuOpen(false)}>
            <li>
              <i>
                <IoMdInformationCircleOutline />
              </i>
              Experience
            </li>
          </NavLink>
          <NavLink to="admin-chat" className={"navlink"} onClick={() => setIsMenuOpen(false)}>
            <li>
              <i>
                <IoChatbubblesOutline />
              </i>
              Chat
            </li>
          </NavLink>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;