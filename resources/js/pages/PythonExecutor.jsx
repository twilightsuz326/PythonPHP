import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PythonExecutor() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [parameters, setParameters] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    // Pythonファイル一覧を取得
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/python-files');
                setFiles(response.data.files);
            } catch (err) {
                console.error('Failed to fetch files:', err);
            }
        };

        fetchFiles();
    }, []);

    const handleExecute = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a Python file.');
            return;
        }

        try {
            const response = await axios.post('/api/execute-python', {
                filename: selectedFile,
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
            <h1>Python File Executor</h1>
            <form onSubmit={handleExecute}>
                <div>
                    <label>
                        Select Python File:
                        <select
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            required
                        >
                            <option value="">-- Select a File --</option>
                            {files.map((file) => (
                                <option key={file} value={file}>
                                    {file}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Parameters (space-separated):
                        <input
                            type="text"
                            value={parameters}
                            onChange={(e) => setParameters(e.target.value)}
                            placeholder="e.g., param1 param2"
                        />
                    </label>
                </div>
                <button type="submit">Execute</button>
            </form>
            {output && (
                <div>
                    <h2>Output:</h2>
                    <pre>{output}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h2 style={{ color: 'red' }}>Error:</h2>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default PythonExecutor;
