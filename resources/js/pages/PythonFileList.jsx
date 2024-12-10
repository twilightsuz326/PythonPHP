import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PythonFileExecutionModal from '../components/PythonFileExecutionModal';
import { FaPlay } from 'react-icons/fa';

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
            <input type="text" placeholder="Search" className='search-bar' />
            <Link to='/file/new' className='btn new-project-btn'>+ New Python File</Link>
            {files.map((file, index) => (
                <div class="project-card">
                    <div class="project-info">
                        <Link to={`/file/${file}`}><h3>{file}</h3></Link>
                        <p>This is a project description</p>
                    </div>
                    <button onClick={() => ExecuteModalOpen(file)} className='btn execute-btn'>
                        <FaPlay />
                    </button>
                </div>
            ))}

            <PythonFileExecutionModal
                isOpen={modalOpen}
                onClose={ExecuteModalClode}
                selectedFile={selectedFile}
            />
        </div>
    );
}

export default FileList;
