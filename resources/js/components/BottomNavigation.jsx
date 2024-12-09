// components/BottomNavigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaCog, FaRegFileCode } from 'react-icons/fa';
import { BiCodeAlt } from 'react-icons/bi';

function BottomNavigation({ user }) {
    const location = useLocation();

    const links = [
        { to: '/save-python', label: 'Python File', icon: <FaRegFileCode /> },
        { to: '/run-python', label: 'Python Execute', icon: <BiCodeAlt /> },
        { to: '/settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <>
            {user ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: 60,
                    backgroundColor: '#fff',
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) / 2)',
                    borderTop: '1px solid #ddd',
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    zIndex: 1000,
                    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
                }}>
                    {links.map(link => (
                        <Link key={link.to} to={link.to} style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: location.pathname === link.to ? '#ff6600' : '#555',
                            textDecoration: 'none',
                            padding: '10px 0',
                            fontSize: 12,
                            transition: 'background-color 0.2s ease'
                        }}>
                            <div style={{ fontSize: 20 }}>{link.icon}</div>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>
            ) : null}
        </>
    );
}

export default BottomNavigation;