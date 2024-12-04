import React from 'react';

function PythonFileSelector({ files, selectedFile, setSelectedFile }) {

    return (
        <div>
            <label>
                Select Python File:
                <select
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value)}
                    required
                >
                    <option value="">-- Select a File --</option>
                    {files.map((file) => (
                        <option key={file} value={file}>
                            {file}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default PythonFileSelector;
