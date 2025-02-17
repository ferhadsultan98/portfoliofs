/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import "./AdminLogin.css";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logLeftImg from "../../../assets/logLeftImg.gif";
import toast from "react-hot-toast";

const AdminLogin = ({ setIsAuthenticated }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginHandle = (e) => {
    e.preventDefault();

    // Kullanıcı adı ve şifre kontrolü
    if (login === "farhad" && password === "farxad14") {
      // Başarılı giriş işlemi
      setLogin("");
      setPassword("");
      

      localStorage.setItem("isAuthenticated", "true");


      setIsAuthenticated(true);

      // Başarılı giriş mesajı
      setTimeout(() => toast.success("Müvəffəqiyyətlə daxil olduz", { position: "top-right" }), 500);

      // Admin paneline yönlendir
      setTimeout(() => {
        navigate("/admin/admin-main");
      }, 1000);
    } else {
      // Hatalı giriş mesajı
      setTimeout(() => toast.error("Şifrə yanlışdır.", { position: "top-right" }), 500);
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
              type="text"
              id="log-in"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="off"
              placeholder="Username"
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
              placeholder="Password"
              required
              maxLength="35"
            />
            <FaLock className="lockIcon" />
            <div
              className="eyeIcon"
              onClick={togglePasswordVisibility}
              title="Show Password"
            >
              {showPassword ? (
                <FaEye />
              ) : (
                <FaEyeSlash style={{ fontSize: "1.3rem" }} />
              )}
            </div>
          </div>
          <button type="submit" id="logIn">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
