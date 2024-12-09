// components/Appbar.jsx
import { useNavigate } from 'react-router-dom';

function Appbar({ title}) {
    const navigate = useNavigate();

    return (
        <div style={{
            height: 50,
            backgroundColor: '#ff6600',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'fixed', // 固定
            top: 0, // 上部に配置
            width: '100%', // 横幅いっぱいに
            zIndex: 1000 // 上層に表示
        }}>
            <h1 style={{ fontSize: 20, margin: 0 }}>{title}</h1>
        </div>
    );
}

export default Appbar;