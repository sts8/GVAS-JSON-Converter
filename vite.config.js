import {defineConfig} from 'vite';
import {execSync} from 'child_process';

const commitHash = execSync('git describe --always --dirty').toString().trim();
const buildTime = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'medium',
    timeStyle: 'medium'
});

export default defineConfig({
    root: 'src/website',
    base: './',
    build: {
        outDir: '../../dist',
        emptyOutDir: true
    },
    server: {
        port: 8080,
        open: true
    },
    define: {
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __BUILD_TIME__: JSON.stringify(buildTime),
    }
});
