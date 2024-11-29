import React, { useState } from 'react';
import axios from 'axios';

function PythonFileUploader() {
    const [filename, setFilename] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
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
            } else {
                setMessage('Failed to save Python file.');
            }
        } catch (error) {
            if (error.response) {
                // サーバーからのエラーレスポンスを表示
                setMessage('Error: ' + error.response.data.message);
            } else {
                setMessage('An error occurred: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h1>Python File Uploader</h1>
            <form onSubmit={handleSubmit}>
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
