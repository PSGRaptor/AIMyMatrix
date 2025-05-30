import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';      // ← now points at src/renderer/index.css

const container = document.getElementById('root')!;
createRoot(container).render(<App />);