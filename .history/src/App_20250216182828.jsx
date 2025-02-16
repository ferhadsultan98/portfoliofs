import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../src/components/";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const location = useLocation();

  // Conditionally render the header title based on the pathname
  let pageTitle = "";
  if (location.pathname === "/admin/admin-main") {
    pageTitle = "Main";
  } else if (location.pathname === "/admin/admin-about") {
    pageTitle = "About";
  } else if (location.pathname === "/admin/admin-projects") {
    pageTitle = "Projects";
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
