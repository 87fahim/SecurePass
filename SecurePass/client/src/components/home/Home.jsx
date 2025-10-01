import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';
import PageTile from '../pagetitle/PageTitle'
import useAuth from "../../hooks/userAuth";

const Home = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth(); // ⬅️ from AuthProvider via hook
    console.log('isAuthenticated value is: ', isAuthenticated)

    return (
        <div className='home-wrapper'>
            <div className="home">
                <PageTile title="🛡️SecurePass" style='style'/>

                <div className="intro-section">
                    <p>Your trusted password manager for ultimate security and convenience.</p>
                    {location.state?.message && <p className="info-message">{location.state.message}</p>}
                </div>

                <section className="features-section">
                    <h2>Why Choose SecurePass?</h2>
                    <ul>
                        <li>🔒 End-to-End Encryption</li>
                        <li>🛡️ Secure and Private</li>
                        <li>📱 Cross-Platform Access</li>
                        <li>⚡ Easy-to-Use Interface</li>
                    </ul>
                </section>

                <section className="cta-section">
                   {!isAuthenticated ? (
                    <>
                     <Link to="/login" className="cta-button secondary">Login</Link>
                     <Link to="/register" className='cta-button register'>Register</Link>
                    </>
                   
                    ) : (
                     <Link to="/logout" className="cta-button secondary">Logout</Link>
                    )}
                </section>
                <footer className="home-footer">
                    <p>&copy; 2025 SecurePass. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
