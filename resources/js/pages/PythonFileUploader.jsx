import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PythonFileSelector from '../components/PythonFileSelector';
import CodeEditor from '../components/CodeEditor';
import Modal from '../components/Modal';

function PythonFileManager() {
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
    const [modalOpen, setModalOpen] = useState(false);
    const [parameters, setParameters] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

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
        if (!file) {
            const filename = "newfile_" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + ".py";
            setFilename(filename);
            setSelectedFile('');
            setCode([{ type: 'code', children: [{ text: '' }] }]);
            return;
        }

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
    const handleSave = async () => {
        if (!filename || code.length === 0 || !code[0]?.children[0]?.text) {
            setMessage('Filename and code are required!');
            return;
        }

        try {
            const strcode = code.map((block) => block.children.map((line) => line.text).join('\n')).join('\n');
            const response = await axios.post('/api/save-python', {
                filename,
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

    // Pythonコードを実行
    const handleExecute = async () => {
        if (!code || code.length === 0 || !code[0]?.children[0]?.text) {
            setError('Python code is required!');
            return;
        }

        try {
            const strcode = code.map((block) => block.children.map((line) => line.text).join('\n')).join('\n');

            const response = await axios.post('/api/execute-python-code', {
                code: strcode,
                parameters: parameters.split(' ').filter((param) => param !== ''),
            });

            setOutput(response.data.output);
            setError('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'An error occurred.');
            } else {
                setError('An error occurred: ' + err.message);
            }
            setOutput('');
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
                    <CodeEditor code={code} onChange={setCode} />
                </label>
            </div>
            <button onClick={handleSave}>Save Python File</button>
            {message && <p>{message}</p>}

            {/* 実行用ボタン */}
            <button onClick={() => setModalOpen(true)}>Execute Python File</button>

            {/* 実行用モーダル */}
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <h2>Execute Python File</h2>
                    <label>
                        Parameters:
                        <input
                            type="text"
                            value={parameters}
                            onChange={(e) => setParameters(e.target.value)}
                            placeholder="Enter parameters separated by spaces"
                        />
                    </label>
                    <button onClick={handleExecute}>Run</button>
                    {output && (
                        <div>
                            <h3>Output:</h3>
                            <pre>{output}</pre>
                        </div>
                    )}
                    {error && (
                        <div>
                            <h3>Error:</h3>
                            <pre>{error}</pre>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}

export default PythonFileManager;
