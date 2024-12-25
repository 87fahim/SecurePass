import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Access the message from the `state` object
    const message = location.state?.message || '';

    const processSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5050/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate('/dashboard', { state: { message: "HAHAHA, You are logged in" } });
            } else if (response.status === 401) {
                const data = await response.json();
                console.log('Error: ', data.error);
            } else {
                console.log("Login failed: ", response.status);
            }
        } catch (err) {
            console.log("Login Error: ", err);
        }
    };

    return (
        <div className="home">
            <h1>Welcome to the Login Page</h1>
            
            {/* Conditionally display the success message */}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={processSignin} className="sign-in-form">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    className="user-name"
                    value={username}
                    placeholder="Enter your username"
                    required
                    onChange={(e) => setUserName(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    className="password"
                    value={password}
                    placeholder="Enter your password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="sign-in-button">
                    Sign In
                </button>
            </form>

            <p>Don't have an account?</p>
            <Link to="/createaccount" className="register-link">
                <button className="register-button">Register</button>
            </Link>
        </div>
    );
};

export default Login;
