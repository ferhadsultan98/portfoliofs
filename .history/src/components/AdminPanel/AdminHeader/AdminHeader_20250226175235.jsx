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
      title: "Confirm",
      message: "Are you certain you want to do this?",
      buttons: [
        {
          label: "Yes!",
          onClick: () => {
            handleDeleteChat(email);
            toast.success("The process has been confirmed!", {
              position: "top-center",
              style: {
                background: "none",
                border: "1px solid #5a1d60",
                borderRadius: "15px",
                color: "#5a1d60",
              },
            });
          },
        },
        {
          label: "No!",
          onClick: () =>
            toast.error("The process has been canceled.", {
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
