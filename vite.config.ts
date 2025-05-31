import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { Plugin } from 'vite';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function suppressSassWarnings(): Plugin {
    return {
        name: 'suppress-sass-warnings',
        apply: 'serve',
        configResolved() {
            const originalWarn = console.warn;
            console.warn = (...args: any[]) => {
                const message = args.join(' ');
                if (
                    message.includes('[global-builtin]') ||
                    message.includes('[slash-div]')
                ) {
                    return;
                }
                originalWarn(...args);
            };
        },
    };
}

export default defineConfig({
    plugins: [vue(), suppressSassWarnings()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
