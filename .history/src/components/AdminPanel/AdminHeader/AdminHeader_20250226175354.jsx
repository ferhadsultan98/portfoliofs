import { PiDevToLogo } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.scss";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmAlert({
      title: "Çıxışı Təsdiqləyin",
      message: "Çıxış etmək istədiyinizə əminsiniz?",
      buttons: [
        {
          label: "Bəli",
          onClick: () => {
            sessionStorage.removeItem("isAuthenticated");
            toast.success("Çıxış etdiniz.", {
              position: "top-right",
              style: {
                background: "none",
                border: "1px solid #5a1d60",
                borderRadius: "15px",
                color: "#5a1d60",
              },
            });
            setTimeout(() => {
              navigate("/login");
            }, 300);
          },
        },
        {
          label: "Xeyr",
          onClick: () =>
            toast.error("Çıxış ləğv edildi.", {
              position: "top-center",
              style: {
                background: "none",
                border: "1px solid #5a1d60",
                borderRadius: "15px",
                color: "#5a1d60",
              },
            }),
        },
      ],
    });
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