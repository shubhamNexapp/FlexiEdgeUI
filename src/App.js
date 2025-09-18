import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SystemChecker from "./pages/SystemChecker";
import Interfaces from "./pages/Interfaces";
import Settings from "./pages/Settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = not checked yet

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    // still checking token → show splash or loader
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        Loading...
      </div>
    );
  }

  // Helper to get title based on path
  const getTitle = (pathname) => {
    switch (pathname) {
      case "/home":
        return "Home";
      case "/system-checker":
        return "System Checker";
      case "/interfaces":
        return "Interfaces";
      case "/settings":
        return "Device Settings";
      default:
        return "Home";
    }
  };

  // Custom wrapper to use location in Router
  const AppContent = () => {
    const location = useLocation();
    return (
      <>
        {isAuthenticated && <Sidebar />}
        <div className={isAuthenticated ? "content" : ""}>
          {isAuthenticated && (
            <Header
              onLogout={handleLogout}
              title={getTitle(location.pathname)}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/system-checker"
              element={
                isAuthenticated ? <SystemChecker /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/interfaces"
              element={
                isAuthenticated ? <Interfaces /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? <Settings /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
