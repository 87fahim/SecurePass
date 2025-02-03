
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Home from './components/home/Home';
import About from './components/about/About';
import Services from './components/services/Services';
import Contact from './components/contact/Contact';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/Layout'
import Missed from './components/missedroutes/Missed'
import RequireAuth from './components/RequireAuth';
import './App.css'
const ROLES = {
    'User': 2000,
    'Admin': 3000,
    'Guest': 1000
}

function App() {
    return (

        <div className="background-overlay">
            <Navbar />
            <Routes>

                <Route path="/" element={<Layout />} >

                    {/* {Public Routes  */}

                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected route */}
                    <Route element={<RequireAuth allowedRoles={[ROLES.Guest, ROLES.User]} />}>
                        <Route path="/services" element={<Services />} />
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route path="/contact" element={<Contact />} />
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
                        <Route path="/dashboard" element={<Dashboard />} /> F
                    </Route>

                    {/* Missed Route */}
                    <Route path="*" element={<Missed />} F />
                </Route>
            </Routes>
        </div>

    );
}

export default App;
