/// <reference types="vitest" />
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve('src', 'index.ts'),
            name: pkg.name,
            formats: ['es'],
            fileName: (_, name) => `${name}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-hook-form'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
        //Generates sourcemaps for the built files,
        //aiding in debugging.
        sourcemap: true,
        //Clears the output directory before building.
        emptyOutDir: true,
    },

    //dts() generates TypeScript declaration files (*.d.ts)
    plugins: [
        react(),
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
        }),
    ],
    server: {
        port: 3003,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
        coverage: {
            exclude: ['**/index.ts', 'tests'],
        },
    },
});
