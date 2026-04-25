import {defineConfig} from 'vite';

export default defineConfig({
    root: 'src/website',
    build: {
        outDir: '../../dist',
        emptyOutDir: true
    },
    server: {
        port: 8080,
        open: true
    }
});
