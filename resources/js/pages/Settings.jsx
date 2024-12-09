// pages/Settings.jsx
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

function Settings({ user, handleLogout }) {
    const settingsOptions = [
        { label: 'アカウント設定', path: '/settings/account' },
        { label: '通知設定', path: '/settings/notifysettings' },
    ];

    return (
        <>
            <NavBar user={user} handleLogout={handleLogout} />
            <div style={{ padding: 20 }}> {/* Appbarの高さに合わせて余白 */}
                {settingsOptions.map((option, index) => (
                    <div key={index} style={{ padding: '16px 20px', borderBottom: '1px solid #ddd' }}>
                        <Link to={option.path} style={{ color: '#007bff', textDecoration: 'none' }}>
                            {option.label}
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Settings;