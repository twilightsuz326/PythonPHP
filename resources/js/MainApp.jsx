import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import DashboardPage from './components/DashboardPage';
import Appbar from './components/Appbar';
import PythonFileUploader from './pages/PythonFileUploader';
import PythonExecutor from './pages/PythonExecutor';
import PythonScheduler from './pages/PythonScheduler';
import BottomNavigation from './components/BottomNavigation';
import Settings from './pages/Settings';



function MainApp() {
    const location = useLocation();
    const [title, setTitle] = useState('Python Web App');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/user', { withCredentials: true })
            .then(response => setUser(response.data))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));

        const titles = {
            '/': 'Home',
            '/login': 'Login',
            '/save-python': 'Python File Manager',
            '/run-python': 'Python File Executor',
            '/python-schedules': 'Python Scheduler',
            '/settings': 'Settings',
        };
        setTitle(titles[location.pathname] || 'KatamichiGo');
    }, [location]);

    const handleLogout = () => {
        axios.post('/api/logout', {}, { withCredentials: true })
            .then(() => setUser(null));
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Appbar title={title} />
            <div style={{ paddingTop: 60, paddingBottom: 80 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route
                        path="/dashboard"
                        element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />}
                    />
                    <Route path="/save-python" element={user ? <PythonFileUploader /> : <Navigate to="/login" />} />
                    <Route path="/run-python" element={user ? <PythonExecutor /> : <Navigate to="/login" />} />
                    <Route path="/python-schedules" element={user ? <PythonScheduler /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={user ? <Settings user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
                </Routes>
            </div>
            <BottomNavigation user={user} />
        </>
    );
}

export default MainApp;
