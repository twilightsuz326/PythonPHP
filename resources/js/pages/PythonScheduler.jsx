import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { MdDelete, MdAdd } from 'react-icons/md';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import PythonFileSelector from '../components/PythonFileSelector';
import ParameterInput from '../components/ParameterInput';

function PythonScheduler() {
    const [files, setFiles] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [form, setForm] = useState({
        filename: '',
        parameters: '',
        cron_expression: '',
    });

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/python-files');
            setFiles(response.data.files);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        }
    };

    const fetchSchedules = async () => {
        const response = await axios.get('/api/python-schedules');
        setSchedules(response.data);
    };

    useEffect(() => {
        fetchFiles();
        fetchSchedules();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/python-schedules', {
                ...form,
                parameters: form.parameters.split(' ').map((param) => param.trim()),
            });
            setForm({ filename: '', parameters: '', cron_expression: '' });
            fetchSchedules();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/python-schedules/${id}`);
            fetchSchedules();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box p={3} sx={{ maxWidth: '600px', margin: '0 auto' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '16px', mb: 4 }}>
                <PythonFileSelector
                    files={files}
                    value={form.filename}
                    onChange={(e, value) => setForm({ ...form, filename: value })}
                />
                <ParameterInput
                    value={form.parameters}
                    onChange={(e) => setForm({ ...form, parameters: e.target.value })}
                />
                <TextField
                    label="Cron Expression"
                    value={form.cron_expression}
                    onChange={(e) => setForm({ ...form, cron_expression: e.target.value })}
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<MdAdd />}
                >
                    Add Schedule
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom>Scheduled Tasks</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {schedules.map((schedule) => (
                    <Box
                        key={schedule.id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <Box>
                            <Typography variant="h6">{schedule.filename}</Typography>
                            <Typography variant="body2">
                                <strong>Parameters:</strong> {schedule.parameters.join(', ')}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Cron:</strong> {schedule.cron_expression}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => handleDelete(schedule.id)}
                            color="error"
                        >
                            <MdDelete />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default PythonScheduler;
