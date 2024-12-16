import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // モーダルコンポーネントをインポート
import ParameterInput from './ParameterInput'; // ParameterInputコンポーネントをインポート
import axios from 'axios';
import CodeEditor from './CodeEditor';
import { Box, Button, Typography, Alert, TextField } from '@mui/material';

const PythonFileExecutionModal = ({ isOpen, onClose, selectedFile }) => {
    const [form, setForm] = useState({
        parameters: '',
    });
    const [error, setError] = useState('');
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);
    const [output, setOutput] = useState([
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

            setOutput(
                response.data.output.split('\n').map((line) => ({
                    type: 'code',
                    children: [{ text: line }],
                }))
            )
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
            <Box>
                <Typography variant="h6" gutterBottom>
                    File: {selectedFile}
                </Typography>
                <Box mb={2}>
                    <CodeEditor code={code} readOnly={true} />
                </Box>
                <ParameterInput
                    value={form.parameters}
                    onChange={(e) => setForm({ parameters: e.target.value })}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExecute}
                    sx={{ mt: 2 }}
                >
                    Run
                </Button>
                {output && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Output:</Typography>
                        <CodeEditor code={output} readOnly={true} placeholder={'Output will be displayed here...'} />
                    </Box>
                )}
                {error && (
                    <Box mt={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default PythonFileExecutionModal;
