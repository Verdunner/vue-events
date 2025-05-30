import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { Plugin } from 'vite';

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
});
