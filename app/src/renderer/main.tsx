import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';    // ← now this will actually load Tailwind

const container = document.getElementById('root')!;
createRoot(container).render(<App />);