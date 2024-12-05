import React, { useMemo, useState, useCallback } from 'react';
import CodeEditor from './CodeEditor';


const Home = () => {
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '# 初期Pythonコードa\nprint("Hello, World!")' }],
        },
    ]);

    return (
        <div>
            <h1>Home</h1>
            <CodeEditor code={code} onChange={setCode} />
        </div>
    );
};

export default Home;
