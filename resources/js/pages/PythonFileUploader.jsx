import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PythonFileSelector from '../components/PythonFileSelector';

function PythonFileUploader() {
    const [filename, setFilename] = useState('');
    const [code, setCode] = useState('');
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
            setCode(response.data.code);
        } catch (err) {
            console.error('Failed to open file:', err);
        }
    }

    // ファイルを保存
    const handleSave = async (e) => {
        e.preventDefault();

        if (!filename || !code) {
            setMessage('Filename and code are required!');
            return;
        }

        try {
            const response = await axios.post('/api/save-python', {
                filename,
                code,
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
                            onChange={(e) => setFilename(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Python Code:
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows="10"
                            cols="50"
                            required
                        />
                    </label>
                </div>
                <button type="submit">Save Python File</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PythonFileUploader;
