import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // モーダルコンポーネントをインポート
import ParameterInput from './ParameterInput'; // ParameterInputコンポーネントをインポート
import axios from 'axios';
import CodeEditor from './CodeEditor';

const PythonFileExecutionModal = ({ isOpen, onClose, selectedFile }) => {
    const [form, setForm] = useState({
        parameters: '',
    });
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);

    useEffect(() => {
        setForm({ parameters: '' });
        setOutput('');
        setError('');
        if (selectedFile) {
            fetchFileDetails();
        }
    }, [isOpen]);

    // ファイル内容を取得
    const fetchFileDetails = async () => {
        try {
            const response = await axios.get(`/api/python-files/${selectedFile}`);
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

    const handleExecute = async () => {
        if (!selectedFile) {
            setError('No file selected!');
            return;
        }

        try {
            const response = await axios.post('/api/execute-python', {
                filename: selectedFile,
                parameters: form.parameters.split(' ').filter((param) => param !== ''),
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

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <h3>File: {selectedFile}</h3>
            <CodeEditor code={code} readOnly={true} />
            <ParameterInput
                value={form.parameters}
                onChange={(e) => setForm({ ...form, parameters: e.target.value })}
                placeholder="Enter parameters separated by spaces"
            />
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
    );
};

export default PythonFileExecutionModal;
