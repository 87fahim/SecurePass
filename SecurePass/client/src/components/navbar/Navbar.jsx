import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import ThemeOption from '../themes/ThemeOption';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-brand">SecurePass</div>
            <ul className="navbar-links">
                <li><Link to="/" className={isActive('/')}>Home</Link></li>
                <li><Link to="/about" className={isActive('/about')}>About</Link></li>
                <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
                <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
                <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
            </ul>
            <div className="theme-options">
                <ThemeOption theme="light" />
                <ThemeOption theme="dark" />
                <ThemeOption theme="purple" />
            </div>
        </nav>
    );
};

export default Navbar;
