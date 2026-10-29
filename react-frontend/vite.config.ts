/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

export default defineConfig({
    plugins: [react(), vike()],
    server: {
        open: true,
        port: Number(process.env.PORT) || 3000,
    },
    build: {
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                chunkFileNames: (chunk) =>
                    chunk.moduleIds.some((id) => /[\\/]RichContent[\\/]CodeBlock\.tsx$/.test(id))
                        ? 'assets/chunks/code-highlighter-[hash].js'
                        : 'assets/chunks/chunk-[hash].js',
                manualChunks(id) {
                    if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
                        return 'react-vendor';
                    }
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});
