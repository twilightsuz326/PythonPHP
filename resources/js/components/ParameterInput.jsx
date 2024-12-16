import React from 'react';
import { TextField } from '@mui/material';

const ParameterInput = ({ value, onChange }) => {
    return (
        <TextField
            label="Parameters"
            value={value}
            onChange={onChange}
            placeholder="param1 param2"
            fullWidth
        />
    );
};

export default ParameterInput;
