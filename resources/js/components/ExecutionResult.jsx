import React from 'react';

function ExecutionResult({ output, error }) {
    return (
        <div>
            {output && (
                <div>
                    <h2>Output:</h2>
                    <pre>{output}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h2 style={{ color: 'red' }}>Error:</h2>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default ExecutionResult;
