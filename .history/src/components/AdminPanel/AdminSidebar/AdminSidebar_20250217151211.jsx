import { NavLink } from "react-router-dom"
import { RiHomeLine } from "react-icons/ri";
import { CgWorkAlt } from "react-icons/cg";
import { IoMdInformationCircleOutline } from "react-icons/io";
import './AdminSidebar.scss'

const AdminSidebar = () => {
  return (
    <div className="sideBar">
          <ul>
            <NavLink to="admin-main" className={"navlink"}>
              <li>
                <i><RiHomeLine /></i>
                Main
              </li>
            </NavLink>
            <NavLink to="admin-projects" className={"navlink"}>
              <li>
              <i><CgWorkAlt /></i>
                Projects
              </li>
            </NavLink>
            <NavLink to="admin-about" className={"navlink"}>
              <li>
              <i><IoMdInformationCircleOutline /></i>
                About
              </li>
            </NavLink>
            <NavLink to="admin-about" className={"navlink"}>
              <li>
              <i><IoMdInformationCircleOutline /></i>
                About
              </li>
            </NavLink>
          </ul>
        </div>
  )
}

export default AdminSidebar