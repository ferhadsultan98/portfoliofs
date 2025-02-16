import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import "./AdminLayout.scss";

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="admin-content">
        <div className="adminContentHeader">
          
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
