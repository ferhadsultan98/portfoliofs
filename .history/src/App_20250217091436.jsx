import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import MainOne from "./components/Main/MainOne";
import Layout from "./components/Layout/Layout";
import ErrorPage from "./components/Error/ErrorPage";
import Loader from "./components/Loader/Loader";
import AdminLogin from "./components/AdminPanel/Login/AdminLogin";
import AdminLayout from "./components/AdminPanel/AdminLayout/AdminLayout";
import AdminAbout from "./components/AdminPanel/AdminAbout/AdminAbout";
import AdminMain from "./components/AdminPanel/AdminMain/AdminMain";
import AdminProjects from "./components/AdminPanel/AdminProjects/AdminProjects";
import { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }

    const times = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(times);
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <Loader />}
      {!loading && (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <MainOne />
                </Layout>
              }
            />
            <Route path="*" element={<ErrorPage />} />
            <Route
              path="/login"
              element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route path="admin-main" element={<AdminMain />} />
              <Route path="admin-projects" element={<AdminProjects />} />
              <Route path="admin-about" element={<AdminAbout />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
