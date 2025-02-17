
import './Navbar.css';
import AuthContext from '../context/AuthProvider';
import ThemeOption from '../themes/ThemeOption';
import appIcon from '../../assets/icons/app-icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { React, useContext } from 'react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const isActive = (path) => (location.pathname === path ? 'active' : 'inactive');

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5050/api/auth/logout", {
                method: "POST",
                credentials: 'include',
            });

            if (response.ok) {
                setAuth({}); // Clear the auth state
                navigate("/"); // Redirect to home page
            } else {
                console.log(response.status)
                console.error("Logout failed due to:", response.statusText);
            }
        } catch (err) {
            console.error("Something went wrong during logout:", err);
        }
    };

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
                <li><Link to="/expenses" className={isActive('expenses')}>Expenses</Link></li>
                {auth?.accessToken ? (
                    <Link className="logout-button" onClick={handleLogout}>
                        Logout: {auth.username}
                    </Link>
                ) : (
                    <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
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
