import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PythonFileSelector from '../components/PythonFileSelector';
import CodeEditor from '../components/CodeEditor';

function PythonFileUploader() {
    const [filename, setFilename] = useState('');
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');

    // ファイルリストを取得
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/python-files');
            setFiles(response.data.files);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        }
    };

    // 初期データの取得
    useEffect(() => {
        fetchFiles();
    }, []);

    // ファイルを開く
    const handleFileSelect = async (file) => {
        try {
            const response = await axios.get(`/api/python-files/${file}`);
            setSelectedFile(file);
            setFilename(file.replace('.py', ''));
            setCode([
                {
                    type: 'code',
                    children: [{ text: response.data.code }],
                },
            ]);
        } catch (err) {
            console.error('Failed to open file:', err);
        }
    };

    // ファイルを保存
    const handleSave = async (e) => {
        e.preventDefault();

        if (!filename || code.length === 0 || !code[0]?.children[0]?.text) {
            setMessage('Filename and code are required!');
            return;
        }

        try {
            const response = await axios.post('/api/save-python', {
                filename,
                code: code[0]?.children[0]?.text, // Slateの構造から実際のコードを取得
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

    return (
        <div>
            <h1>Python File Manager</h1>
            <PythonFileSelector
                files={files}
                selectedFile={selectedFile}
                setSelectedFile={handleFileSelect}
            />

            <form onSubmit={handleSave}>
                <div>
                    <label>
                        Filename (without .py):
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => {
                                setFilename(e.target.value);
                                if (!selectedFile) {
                                    setCode([{ type: 'code', children: [{ text: '' }] }]); // 新規ファイル時にリセット
                                }
                            }}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Python Code:
                        <CodeEditor code={code} onChange={setCode} />
                    </label>
                </div>
                <button type="submit">Save Python File</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PythonFileUploader;
