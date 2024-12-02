import React, { useState, useEffect } from 'react';
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
        <div>
            <h1>Python Scheduler</h1>
            <form onSubmit={handleSubmit}>
                <PythonFileSelector
                    files={files}
                    selectedFile={form.filename}
                    setSelectedFile={(filename) => setForm({ ...form, filename })}
                />
                <ParameterInput
                    parameters={form.parameters}
                    setParameters={(parameters) => setForm({ ...form, parameters })}
                />
                <div>
                    <label>
                        Cron Expression:
                        <input
                            type="text"
                            value={form.cron_expression}
                            onChange={(e) => setForm({ ...form, cron_expression: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Schedule</button>
            </form>

            <h2>Scheduled Tasks</h2>
            <ul>
                {schedules.map((schedule) => (
                    <li key={schedule.id}>
                        <p>
                            <strong>File:</strong> {schedule.filename}
                        </p>
                        <p>
                            <strong>Parameters:</strong> {schedule.parameters.join(', ')}
                        </p>
                        <p>
                            <strong>Cron:</strong> {schedule.cron_expression}
                        </p>
                        <button onClick={() => handleDelete(schedule.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PythonScheduler;
