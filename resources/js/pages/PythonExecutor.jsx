import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PythonFileSelector from '../components/PythonFileSelector';
import ParameterInput from '../components/ParameterInput';
import ExecutionResult from '../components/ExecutionResult';

function PythonExecutor() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [parameters, setParameters] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/python-files');
            setFiles(response.data.files);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        }
    };

    // Pythonファイル一覧を取得
    useEffect(() => {
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
                <PythonFileSelector
                    files={files}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
                <ParameterInput
                    parameters={parameters}
                    setParameters={setParameters}
                />
                <button type="submit">Execute</button>
            </form>
            <ExecutionResult output={output} error={error} />
        </div>
    );
}

export default PythonExecutor;
