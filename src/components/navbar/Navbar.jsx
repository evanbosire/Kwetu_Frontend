import React, { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import "./navbar.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMenuClick = () => {
    // Only toggle mobile menu on small screens
    if (window.innerWidth <= 480) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    // Always trigger sidebar toggle
    toggleSidebar();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Left section with menu icon */}
          <div className="navbar-left">
            <button onClick={handleMenuClick} className="menu-button">
              <Menu className="menu-icon" />
            </button>
          </div>

          {/* Center section with logo and text */}
          <div className="navbar-center">
            <div className="logo-container">
              <img src={logo} alt="Kwetu Nutrition" className="logo" />
            </div>
            <div className="logo-text">
              <span className="company-name">Kwetu Nutrition</span>
              <span className="dashboard-label">ADMINISTRATOR DASHBOARD</span>
            </div>
          </div>

          {/* Right section with logout button */}
          <div className="navbar-right">
            <button
              onClick={handleLogout}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`logout-button ${isHovered ? "hovered" : ""}`}
            >
              <LogOut className="logout-icon" />
              <span className="logout-text">Logout</span>
            </button>
          </div>

          {/* Mobile Menu - Only shown on small screens */}
          {window.innerWidth <= 480 && isMobileMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <button onClick={handleLogout} className="mobile-logout-button">
                  <LogOut className="logout-icon" />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
