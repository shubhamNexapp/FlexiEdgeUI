import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCheck } from "react-icons/fa";
import { TiPointOfInterest } from "react-icons/ti";

import "./Sidebar.css";

const menuItems = [
  { name: "Home", path: "/home", icon: <FaHome /> },
  { name: "System Checker", path: "/system-checker", icon: <FaCheck /> },
  { name: "Interfaces", path: "/interfaces", icon: <TiPointOfInterest /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          {/* <img src="/logo192.png" alt="Logo" /> */}
          {!collapsed && <span className="brand">Nexapp</span>}
        </div>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>
      </div>

      <div className="menu">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="text">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
