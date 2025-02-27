import { PiDevToLogo } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom"; 
import './AdminHeader.scss';
import toast from "react-hot-toast";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // sessionStorage'dan çıkış bilgisini sil
    sessionStorage.removeItem('isAuthenticated');

    setTimeout(() => {
      toast.success('Çıxış etdiniz.', { position: "top-right" });
    }, 300); 

    // Login sayfasına yönlendir
    navigate('/login'); 
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
      <FiLogOut 
        className="logoutBtn" 
        style={{ color: "white", cursor: "pointer" }} 
        onClick={handleLogout} 
      />
    </div>
  );
}

export default AdminHeader;
