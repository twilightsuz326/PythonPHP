import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import PythonCodeExecutionModal from '../components/PythonCodeExecutionModal';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FaPlay, FaSave } from 'react-icons/fa';

function FileDetail() {
    const { fileName } = useParams();
    const [code, setCode] = useState([
        {
            type: 'code',
            children: [{ text: '' }],
        },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newFilename, setNewFilename] = useState('');
    const [message, setMessage] = useState('');

    // ファイル内容を取得
    const fetchFileDetails = async () => {
        try {
            const response = await axios.get(`/api/python-files/${fileName}`);
            setNewFilename(fileName.replace('.py', ''));
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

    // ファイルを保存
    const handleSave = async () => {
        if (!newFilename || code.length === 0 || !code[0]?.children[0]?.text) {
            setMessage('Filename and code are required!');
            return;
        }

        try {
            const strCode = code
                .map((block) => block.children.map((line) => line.text).join('\n'))
                .join('\n');
            const response = await axios.post('/api/save-python', {
                filename: newFilename,
                code: strCode,
            });

            if (response.status === 200) {
                setMessage('Python file saved successfully!');
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

    useEffect(() => {
        if (fileName === 'new') {
            return;
        } else {
            fetchFileDetails();
        }
    }, [fileName]);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Editing File: {newFilename}.py
            </Typography>

            {/* コードエディタ */}
            <Box sx={{ my: 2 }}>
                <CodeEditor code={code} onChange={setCode} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                    label="Filename (without .py)"
                    variant="outlined"
                    value={newFilename}
                    onChange={(e) => setNewFilename(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaPlay />}
                    onClick={() => setModalOpen(true)}
                >
                    Execute
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FaSave />}
                    onClick={handleSave}
                >
                    Save Python File
                </Button>
            </Box>

            {message && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}

            <PythonCodeExecutionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                code={code}
            />
        </Box>
    );
}

export default FileDetail;
