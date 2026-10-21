import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({define:{'process.env.NODE_ENV':JSON.stringify('production')},plugins:[react()],publicDir:false,build:{outDir:'../public',emptyOutDir:false,lib:{entry:'src/site-entry.tsx',formats:['es'],fileName:()=> 'research-interactive.js'},rollupOptions:{output:{codeSplitting:false}}}});
