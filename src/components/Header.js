// src/components/Header.js
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const Header = ({ onLogout, title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="navbar navbar-light bg-white shadow-sm px-3">
      <div className="d-flex align-items-center">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div>
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
          <DropdownToggle caret color="light" className="d-flex align-items-center">
            Admin
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={onLogout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
