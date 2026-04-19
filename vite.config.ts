/// <reference types="vite-plugin-svgr/client" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const isEmbedBuild = process.env.BUILD_MODE === 'embed';

export default defineConfig({
    optimizeDeps: {
        include: [
            '@threekit-tools/treble',
            '@threekit-tools/treble/dist/types',
            '@threekit-tools/treble/dist/store/treble',
            '@threekit-tools/treble/dist/store/index',
        ],
    },
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        svgr({
            include: '**/*.svg?react',
            svgrOptions: {
                plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: { overrides: { removeViewBox: false } },
                        },
                        'convertColors',
                        'prefixIds',
                    ],
                },
            },
        }),
    ],

    build: isEmbedBuild
        ? {
              lib: {
                  entry: fileURLToPath(new URL('./src/embed.tsx', import.meta.url)),
                  name: 'ThreekitConfigurator',
                  fileName: () => 'threekit-embed.js',
                  formats: ['iife'],
              },
              outDir: 'dist-embed',
              target: ['es2022', 'edge100', 'firefox100', 'chrome100', 'safari15.4', 'opera90'],
              assetsInlineLimit: () => true,
          }
        : {
              outDir: 'dist',
              commonjsOptions: {
                  include: [/threekit-tools/, /node_modules/],
              },
          },

    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
        'process.env.TREBLE_DEBUG': JSON.stringify('false'),
        'process.env.TREBLE_SCRIPTS': JSON.stringify('false'),
        'process.env.THREEKIT_ENV': JSON.stringify(process.env.VITE_TK_ENV ?? 'preview'),
        ...(isEmbedBuild && { 'process.env.NODE_ENV': '"production"' }),
    },

    resolve: {
        alias: [
            {
                find: '@threekit/rest-api',
                replacement: fileURLToPath(new URL('./src/lib/threekit-stubs/rest-api.ts', import.meta.url)),
            },
            {
                find: '@threekit/analytics',
                replacement: fileURLToPath(new URL('./src/lib/threekit-stubs/analytics.ts', import.meta.url)),
            },
            {
                find: '@/icons',
                replacement: fileURLToPath(new URL('./src/icons', import.meta.url)),
            },
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url)),
            },
        ],
    },

    server: {
        port: 9777,
    },

    preview: {
        port: 9111,
    },
});
