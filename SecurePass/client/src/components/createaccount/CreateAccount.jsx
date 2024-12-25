import React, { useState } from 'react';
import './CreateAccount.css';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../pagetitle/PageTitle';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [apiResponse, setApiResponse] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target; // Correctly get the "name" attribute from inputs
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear field-specific errors

        if (name === 'password') updatePasswordStrength(value); // Update password strength on input
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.username.trim()) newErrors.username = 'Username is required.';
        if (!emailRegex.test(formData.email))
            newErrors.email = 'Please enter a valid email address.';
        if (!passwordRegex.test(formData.password))
            newErrors.password =
                'Password must be at least 8 characters long, contain one uppercase letter and one number.';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updatePasswordStrength = (password) => {
        if (password.length === 0) {
            setPasswordStrength('');
        } else if (password.length < 6) {
            setPasswordStrength('Weak');
        } else if (/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
            setPasswordStrength('Strong');
        } else {
            setPasswordStrength('Moderate');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) return;

        setIsSubmitting(true); // Show loader during submission
        console.log('Sending data to backend:\n', formData);
        try {
            const response = await fetch('http://localhost:5050/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setApiResponse({ success: true, message: data.message });
                navigate('/login', {state:{message:'Account was created successfully!'}})
            }else if(response.status === 409){
                const errorData = await response.json();
                setApiResponse({ success: false, message: errorData.message });
                // navigate("/login", { state: { message: "Account already exists. Please log in." } });
            } 
           
        } catch (error) {
            setApiResponse({ success: false, message: 'Something went wrong. Please try again later.' });
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="create-account">
            <PageTitle title="Register Account"></PageTitle>
            <p>Welcome to the registration page. Please fill out your details below.</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                />
                {errors.username && <p className="error-message">{errors.username}</p>}

                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
                {errors.password && <p className="error-message">{errors.password}</p>}

                <div className="password-strength">
                    Password Strength: <span>{passwordStrength}</span>
                </div>

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                <button type="submit" className="register-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>

            {apiResponse && (
                <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
                    {apiResponse.message}
                </div>
            )}

            <p>Already have an account?</p>
            <Link to="/login" className="have-account">
                <button className="register-button">Login</button>
            </Link>
        </div>
    );
};

export default CreateAccount;
