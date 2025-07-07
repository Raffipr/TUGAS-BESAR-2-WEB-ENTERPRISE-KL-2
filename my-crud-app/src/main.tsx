// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Mengimpor komponen App
import './styles.css'; // Mengimpor file CSS untuk styling

// Render aplikasi ke dalam elemen dengan ID 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
