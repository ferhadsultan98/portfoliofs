import { PiDevToLogo } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 
import './AdminHeader.scss';
import toast from "react-hot-toast";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setTimeout(() => {
      
      setTimeout(() => {
        toast.success('Çıxış etdiniz.', { position: "top-right" });
      }, 300); 
      navigate('/login'); 
    }, 0); 
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
