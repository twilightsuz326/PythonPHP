import React, { useState } from 'react';
import Modal from './Modal'; // モーダルコンポーネントをインポート
import axios from 'axios';

const PythonExecutionModal = ({ isOpen, onClose, code }) => {
    const [parameters, setParameters] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

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

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
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
    );
};

export default PythonExecutionModal;
