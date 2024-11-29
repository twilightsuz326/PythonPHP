import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ user, handleLogout }) {
    return (
        <div>
            <h1>NavBar</h1>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            {user ? (
                <>
                    <span>Welcome, {user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <NavLink to="/login">Login</NavLink>
            )}
        </div>
    );
}

export default NavBar;