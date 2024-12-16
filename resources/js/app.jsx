import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './MainApp';

const container = document.getElementById("app");
const root = createRoot(container);

// オレンジテーマの作成
const theme = createTheme({
    palette: {
        primary: {
            main: '#FF6600', // オレンジ
            contrastText: '#fff', // ボタンやテキスト用
        },
        secondary: {
            main: '#F57C00', // 濃いオレンジ
            contrastText: '#fff', //
        },
        background: {
            default: '#fff', // 背景色
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <App />
        </Router>
    </ThemeProvider>
);
