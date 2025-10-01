// components/navbar/Navbar.jsx
import './Navbar.css';
import ThemeOption from '../themes/ThemeOption';
import appIcon from '../../assets/icons/app-icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import useAuth from '../../hooks/userAuth'; // ✅ use the hook that reads AuthContext

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); // ✅ from AuthProvider

  const isActive = (path) => (location.pathname === path ? 'active' : 'inactive');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          <img src={appIcon} alt="App Icon" className="app-icon" />
          <span className="brand-name">SecurePass</span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/" className={isActive('/')}>Home</Link></li>
        <li><Link to="/about" className={isActive('/about')}>About</Link></li>
        <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
        <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>

        {isAuthenticated ? (
          <li>
        
              <Link to="/logout" className={isActive("/logout")}>
                Logout{user?.username ? `: ${user.username}` : ""}
              </Link>
            </li>
         
        ) : (
          <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
        )}
      </ul>

      <div className="theme-options">
        <ThemeOption theme="light" />
        <ThemeOption theme="dark" />
      </div>
    </nav>
  );
};

export default Navbar;
