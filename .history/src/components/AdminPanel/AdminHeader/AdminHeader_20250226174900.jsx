import { PiDevToLogo } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.scss";
import toast from "react-hot-toast";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");

    setTimeout(() => {
      toast.success("Çıxış etdiniz.", { position: "top-right" });
    }, 300);


    navigate("/login");
  };

  return (
    <div className="adminHeader">
      <div>
        <a href="/admin/admin-main">
          <p>Farhad</p>
          <i>
            <PiDevToLogo />
          </i>
        </a>
      </div>
      <IoMdLogOut
        className="logoutBtn"
        style={{ color: "#5a1d60", cursor: "pointer" }}
        onClick={handleLogout}
      />
    </div>
  );
};

export default AdminHeader;
