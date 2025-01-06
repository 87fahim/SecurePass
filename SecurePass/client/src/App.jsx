



// function App() {
//     return (
//         <BrowserRouter>
//             <AuthProvider>
//                 <main>
//                     <Navbar />
//                     <Routes>
//                         <Route path="/*" element={<Home />} />
//                         <Route path="/home" element={<Home />} />
//                         <Route path="/dashboard" element={<Dashboard />} />
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/about" element={<About />} />
//                         <Route path="/services" element={<Services />} />
//                         <Route path="/contact" element={<Contact />} />
//                         <Route path="/register" element={<Register />} />
//                     </Routes>
//                 </main>
//             </AuthProvider>
//         </BrowserRouter>
//     );
// }

// export default App;
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

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Layout />} />
                {/* {Public Routes  */}
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<Register />} />

                {/* Protected route */}
                <Route element={<RequireAuth />}> 
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/dashboard" element={<Dashboard />} /> F
                </Route>

                {/* Missed Route */}
                <Route path="*" element={<Missed />} />
            </Routes>
        </>
    );
}

export default App;
