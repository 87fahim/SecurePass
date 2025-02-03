import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';
import PageTile from '../pagetitle/PageTitle'
const Home = () => {
    const location = useLocation();

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
                   
                    <Link to="/login" className="cta-button secondary">Login</Link>
                    <Link to="/register" className='cta-button register'>Register</Link>
                </section>

                <section className="demo-section">
                    <h2>How it Works</h2>
                    <p>Explore our intuitive interface and features in a quick demo!</p>
                    <Link to="/demo" className="demo-button">View Demo</Link>
                </section>

                <footer className="home-footer">
                    <p>&copy; 2024 SecurePass. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
