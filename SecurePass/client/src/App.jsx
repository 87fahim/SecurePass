import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Home from './components/home/Home';
import About from './components/about/About';
import Expenses from './components/expenses/Expenses';
import Services from './components/services/Services';
import Contact from './components/contact/Contact';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/Layout';
import Missed from './components/missedroutes/Missed';
import RequireAuth from './components/RequireAuth';
import LinkManager from './components/linkmanagement/LinkManager';
import Logout from "./components/logout/Logout";
import './App.css';

const ROLES = { User: 2000, Admin: 3000, Guest: 1000 };

function App() {
  return (
    <div className="background-overlay">
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="about" element={<About />} />
          <Route path="register" element={<Register />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="links" element={<LinkManager idPrefix="lm1" />} />
          <Route path="unauthorized" element={<div>Unauthorized</div>} />
          <Route path="logout" element={<Logout />} />

          {/* Protected */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Guest, ROLES.User]} />}>
            <Route path="services" element={<Services />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Missed />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
