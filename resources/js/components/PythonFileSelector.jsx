import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const PythonFileSelector = ({ files, selectedFile, setSelectedFile }) => {
    return (
        <Autocomplete
            options={files}
            getOptionLabel={(option) => option || ''}
            value={selectedFile}
            onChange={(e, newValue) => setSelectedFile(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Python File" required />}
        />
    );
};

export default PythonFileSelector;
