import React, { useState } from 'react';
import Modal from './Modal'; // モーダルコンポーネントをインポート
import ParameterInput from './ParameterInput'; // ParameterInputコンポーネントをインポート
import axios from 'axios';
import CodeEditor from './CodeEditor';
import { Box, Button, Typography, Alert, TextField } from '@mui/material';

const PythonExecutionModal = ({ isOpen, onClose, code }) => {
    const [form, setForm] = useState({
        parameters: '',
    });
    const [output, setOutput] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);
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
                parameters: form.parameters.split(' ').filter((param) => param !== ''),
            });

            setOutput(
                response.data.output.split('\n').map((line) => ({
                    type: 'code',
                    children: [{ text: line }],
                }))
            );
            setError('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'An error occurred.');
            } else {
                setError('An error occurred: ' + err.message);
            }
            setOutput(''); // エラー時は出力をクリア
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Execute Python File
                </Typography>
                <ParameterInput
                    value={form.parameters}
                    onChange={(e) => setForm({ ...form, parameters: e.target.value })}
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

export default PythonExecutionModal;
