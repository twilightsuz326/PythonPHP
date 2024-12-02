import React from 'react';

function ParameterInput({ parameters, setParameters }) {
    return (
        <div>
            <label>
                Parameters (space-separated):
                <input
                    type="text"
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    placeholder="e.g., param1 param2"
                />
            </label>
        </div>
    );
}

export default ParameterInput;
