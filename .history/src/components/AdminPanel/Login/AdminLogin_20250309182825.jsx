/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { FaUserAstronaut, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logLeftImg from "../../../assets/logLeftImg.gif";
import toast from "react-hot-toast";
import { loginUser } from "../../"; // firebase.js dosyasını import et

const AdminLogin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(""); // login yerine email kullanıyoruz
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginHandle = async (e) => {
    e.preventDefault();

    try {
      console.log("Giriş deneniyor, email:", email);
      // Firebase Authentication ile giriş yap
      await loginUser(email, password);

      // Giriş başarılıysa
      setEmail("");
      setPassword("");
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      setTimeout(() => toast.success("Başarıyla giriş yapıldı!", { position: "top-right" }), 500);
      setTimeout(() => {
        navigate("/admin/admin-main");
      }, 1000);
    } catch (error) {
      console.error("Giriş hatası:", error.message);
      setTimeout(() => toast.error(error.message || "Giriş başarısız!", { position: "top-right" }), 500);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginLeftSection">
        <div className="logLeftSecImg">
          <img src={logLeftImg} alt="logLeftImg" />
        </div>
      </div>
      <form onSubmit={loginHandle} className="loginCard">
        <div className="logHeader">
          <h1>
            <FaUserAstronaut className="loginIcon" style={{ color: "#5A1D60" }} />
          </h1>
          <div className="logSection">
            <input
              type="email" // text yerine email türü kullanıyoruz
              id="log-in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              placeholder="Email"
              required
              maxLength="35"
            />
            <FaUser className="userIcon" />
          </div>
          <div className="passSection">
            <input
              type={showPassword ? "text" : "password"}
              id="log-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              placeholder="Şifre"
              required
              maxLength="35"
            />
            <FaLock className="lockIcon" />
            <div
              className="eyeIcon"
              onClick={togglePasswordVisibility}
              title="Şifreyi Göster"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash style={{ fontSize: "1.3rem" }} />}
            </div>
          </div>
          <button type="submit" id="logIn">
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;