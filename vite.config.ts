/// <reference types="vitest" />
import fs from 'node:fs';
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
            formats: ['es', 'cjs'],
            fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
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
            outDir: 'dist',
            afterBuild() {
                // NOTE: required to prevent error related to CommonJS module
                // Duplicate index.d.ts to index.d.cts
                const indexDTs = path.resolve('dist', 'index.d.ts');
                const commonDTs = path.resolve('dist', 'index.d.cts');

                fs.copyFileSync(indexDTs, commonDTs);
            },
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
            exclude: ['**/*.test.ts{,x}', '**/*.types.ts{,x}', 'src/tests', 'src/index.ts', 'src/types.ts'],
            include: ['src'],
            provider: 'v8',
        },
    },
});
