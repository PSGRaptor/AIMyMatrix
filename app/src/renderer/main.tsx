// app/src/renderer/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';  // your Tailwind or global styles

const container = document.getElementById('root')!;
createRoot(container).render(<App />);