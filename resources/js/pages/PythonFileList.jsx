import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PythonFileExecutionModal from '../components/PythonFileExecutionModal';

function FileList() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/python-files');
            setFiles(response.data.files);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        }
    };

    const ExecuteModalOpen = (file) => {
        setModalOpen(true);
        setSelectedFile(file);
    }

    const ExecuteModalClode = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <ul>
                <li>
                    <Link to="/file/new">
                        + Add New File
                    </Link>
                </li>
                {files.map((file, index) => (
                    <li key={index}>
                        {/* ファイルリンク */}
                        <Link to={`/file/${file}`}>{file}</Link>

                        {/* 実行ボタン */}
                        <button onClick={() => ExecuteModalOpen(file)}>Execute</button>
                    </li>
                ))}
            </ul>
            
            <PythonFileExecutionModal 
                isOpen={modalOpen}
                onClose={ExecuteModalClode}
                selectedFile={selectedFile}
            />
        </div>
    );
}

export default FileList;
