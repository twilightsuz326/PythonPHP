import React from 'react';
import { TextField } from '@mui/material';

const ParameterInput = ({ parameters, setParameters }) => {
    return (
        <TextField
            label="Parameters"
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            placeholder="param1 param2"
            fullWidth
        />
    );
};

export default ParameterInput;
