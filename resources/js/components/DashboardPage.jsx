import React from 'react';

function DashboardPage({ user }) {
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user ? user.name : 'Guest'}</p>
        </div>
    );
}

export default DashboardPage;