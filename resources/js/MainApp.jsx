import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import DashboardPage from './components/DashboardPage';
import About from './components/About';

function MainApp() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/user', { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }
    , []);

    const handleLogout = () => {
        axios.post('/api/logout', {}, { withCredentials: true })
            .then(() => setUser(null));
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            <NavBar user={user} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route
                    path="/dashboard"
                    element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />}
                />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default MainApp;
