import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';  // ← This import now runs your Tailwind gradient CSS

const container = document.getElementById('root')!;
createRoot(container).render(<App />);