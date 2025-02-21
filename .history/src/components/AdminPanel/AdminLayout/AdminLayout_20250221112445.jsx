import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const location = useLocation();


  let pageTitle = "";
  if (location.pathname === "/admin/admin-main") {
    pageTitle = "Main";
  } else if (location.pathname === "/admin/admin-about") {
    pageTitle = "About";
  } else if (location.pathname === "/admin/admin-projects") {
    pageTitle = "Projects";
  } else if (location.pathname === "/admin/admin-experience") {
    pageTitle = "Experience";
  } else if (location.pathname === "/admin/admin-chat") {
    pageTitle = "Experience";
  }
  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content">
        <div className="adminContentHeader">
          <h1>{pageTitle}</h1>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
