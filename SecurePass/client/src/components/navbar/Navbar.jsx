import './Navbar.css';

// import AuthContext from '../context/AuthProvider';
import ThemeOption from '../themes/ThemeOption';
import appIcon from '../../assets/icons/app-icon.png';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { React, useContext } from 'react';


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const { accessToken, setAccessToken } = useContext(AuthContext);
    const isActive = (path) => location.pathname === path ? 'active' : 'inactive';

    const handleLogout = async () => {
        try{
        const response = await fetch("http://localhost:5050/api/auth/logout", {
            method: "POST",
            credentials: 'include',
        });

        if (response.ok) {
            // setAccessToken(null);
            navigate("/");

        }
        else{
            console.error("Logout Failed due to:", response.statusText)
        }

    }catch(err){
        console.error("Something went wrong when logging oout:",err)
    }

    }
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                {/* Link wrapping both image and text */}
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
                {!false ? (
                    <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
                ) : (
                    <li><Link to="/login" className={isActive('/login')} onClick={handleLogout}>Logout</Link></li>
                )}

            </ul>
            <div className="theme-options">
                <ThemeOption theme="light" />
                <ThemeOption theme="dark" />
                <ThemeOption theme="purple" />
                <ThemeOption theme="green" />
                <ThemeOption theme="blue" />
            </div>
        </nav>
    );
};

export default Navbar;
