
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import useAuth from "../../hooks/userAuth";

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrMsg] = useState("");
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const message = location.state?.message || "";

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    const processSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5050/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            // console.log(response.status)
            // console.log(response.ok);
            // console.log("Server replied to login: ",result);
            if (response.ok) {

                const accessToken = result.accessToken;
                setAuth({ username, password, accessToken });
                setUserName('');
                setPassword('');
                console.log(from);
                navigate(from, { replace: true });

            } else if (response.status === 400) {
                setErrMsg(result.err || "Missing Username or Password");
            }
            else if (response.status === 401) {
                setErrMsg(result.error || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setErrMsg("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login">

                <form onSubmit={processSignin} className="sign-in-form">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        placeholder="Enter your username"
                        required
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Enter your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="sign-in-button">
                        Sign In
                    </button>
                    <p className='not-have-account'>Don't have an account?</p>
                    <Link to="/register" className="register-link">
                        <button className="register-button-login">Register</button>
                    </Link>
                    {message && <div className="success-message">{message}</div>}
                    <p ref={errRef} className={errorMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errorMsg}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

