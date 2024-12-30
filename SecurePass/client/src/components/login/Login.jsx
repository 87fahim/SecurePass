import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageTitle from '../pagetitle/PageTitle'
const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", result.token);
                console.log('Token Received: ', localStorage.getItem('authToken'));
                navigate('/dashboard', { state: { message: "HAHAHA, You are logged in" } });

            } else if (response.status === 401) {
                setErrorMessage("Invalid username or password. Please try again.");
            } else {
                setErrorMessage(`Login failed with status code: ${response.status}`);
            }
        } catch (err) {
            console.error("Login Error: ", err);
            setErrorMessage("An error occurred while trying to log in. Please try again later.");
        }
    };

    return (
        <div className='login-wrapper'>
            <div className="login">
                <PageTitle title='🔑 Login' style='simple'/>
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

                    {/* Display error message dynamically */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button type="submit" className="sign-in-button">
                        Sign In
                    </button>
                </form>

                <p className='not-have-account'>Don't have an account?</p>
                <Link to="/register" className="register-link">
                    <button className="register-button-login">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Login;
