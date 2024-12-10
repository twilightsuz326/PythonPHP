import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import PythonCodeExecutionModal from '../components/PythonCodeExecutionModal';

function FileDetail() {
    const { fileName } = useParams();
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newfilename, setnewFilename] = useState('');
    const [message, setMessage] = useState('');

    // ファイル内容を取得
    const fetchFileDetails = async () => {
        try {
            const response = await axios.get(`/api/python-files/${fileName}`);
            setnewFilename(fileName.replace('.py', ''));
            setCode([
                {
                    type: 'code',
                    children: [{ text: response.data.code }],
                },
            ]);
        } catch (err) {
            console.error('Failed to fetch file details:', err);
        }
    };

    // ファイルを保存
    const handleSave = async () => {
        if (!newfilename || code.length === 0 || !code[0]?.children[0]?.text) {
            setMessage('Filename and code are required!');
            return;
        }

        try {
            const strcode = code.map((block) => block.children.map((line) => line.text).join('\n')).join('\n');
            const response = await axios.post('/api/save-python', {
                filename: newfilename,
                code: strcode,
            });

            if (response.status === 200) {
                setMessage('Python file saved successfully!');
                fetchFiles(); // 保存後にファイルリストを更新
            } else {
                setMessage('Failed to save Python file.');
            }
        } catch (error) {
            if (error.response) {
                setMessage('Error: ' + error.response.data.message);
            } else {
                setMessage('An error occurred: ' + error.message);
            }
        }
    };

    useEffect(() => {
        if (fileName === 'new') {
            return;
        }else{
            fetchFileDetails();
        }
    }, [fileName]);

    return (
        <div>
            <h3>Editing File: {newfilename}.py</h3>

            {/* コードエディタ */}
            <CodeEditor code={code} onChange={setCode} />

            <div>
                <label>
                    Filename (without .py):
                    <input
                        type="text"
                        value={newfilename}
                        onChange={(e) => setnewFilename(e.target.value)}
                        required
                    />
                </label>
            </div>

            <button onClick={() => setModalOpen(true)}>Execute</button>
            <button onClick={handleSave}>Save Python File</button>
            {message && <p>{message}</p>}

            <PythonCodeExecutionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                code={code}
            />
        </div>
    );
}

export default FileDetail;
