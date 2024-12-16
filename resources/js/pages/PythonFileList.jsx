import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PythonFileExecutionModal from '../components/PythonFileExecutionModal';
import { FaPlay } from 'react-icons/fa';
import { Button, Card, CardContent, Typography, IconButton, Box, TextField } from '@mui/material';

function PythonFileList() {
    const [files, setFiles] = useState([]); // 全ファイルリスト
    const [searchQuery, setSearchQuery] = useState(''); // 検索クエリ
    const [modalOpen, setModalOpen] = useState(false); // モーダルの開閉状態
    const [selectedFile, setSelectedFile] = useState(''); // 選択されたファイル

    // APIからファイルリストを取得
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/python-files');
                setFiles(response.data.files || []);
            } catch (err) {
                console.error('Failed to fetch files:', err);
            }
        };
        fetchFiles();
    }, []);

    // 検索クエリに基づきファイルをフィルタリング
    const filteredFiles = files.filter((file) =>
        file.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // モーダルの開閉制御
    const handleModalOpen = (file) => {
        setSelectedFile(file);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <Box p={3} sx={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* 検索と新規作成ボタン */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <TextField
                    label="Search Files"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search files..."
                />
                <Button
                    component={Link}
                    to="/file/new"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    + New Python File
                </Button>
            </Box>

            {/* ファイルリスト */}
            <Box>
                {filteredFiles.map((file) => (
                    <Card key={file} sx={{ marginBottom: '10px' }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <Typography variant="h6">
                                    <Link
                                        to={`/file/${file}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {file}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    This is a project description
                                </Typography>
                            </div>
                            <IconButton
                                onClick={() => handleModalOpen(file)}
                                color="primary"
                                size="small"
                                sx={{ padding: '5px' }}
                            >
                                <FaPlay />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* 実行モーダル */}
            <PythonFileExecutionModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                selectedFile={selectedFile}
            />
        </Box>
    );
}

export default PythonFileList;
