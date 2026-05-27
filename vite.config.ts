/// <reference types="vite-plugin-svgr/client" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

type TrebleEnv = {
    THREEKIT_ENV: string;
    TREBLE_DEBUG: boolean;
    TREBLE_SCRIPTS: boolean;
};

type TrebleEnvKey = keyof TrebleEnv;

type ClientEnv = Record<string, string | undefined>;

const getEnvValue = (env: ClientEnv, key: string): string | undefined => {
    return process.env[key] ?? env[key];
};

const getTrebleEnvValue = (env: ClientEnv, key: TrebleEnvKey): string | undefined => {
    return getEnvValue(env, key) ?? getEnvValue(env, `VITE_${key}`);
};

const parseBooleanEnv = (value: string | undefined, fallback = false): boolean => {
    if (value === undefined) return fallback;

    const normalizedValue = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalizedValue)) return true;
    if (['false', '0', 'no', 'off'].includes(normalizedValue)) return false;

    return fallback;
};

const getTrebleEnv = (env: ClientEnv): TrebleEnv => {
    return {
        THREEKIT_ENV: getTrebleEnvValue(env, 'THREEKIT_ENV') ?? getEnvValue(env, 'VITE_TK_ENV') ?? 'preview',
        TREBLE_DEBUG: parseBooleanEnv(getTrebleEnvValue(env, 'TREBLE_DEBUG')),
        TREBLE_SCRIPTS: parseBooleanEnv(getTrebleEnvValue(env, 'TREBLE_SCRIPTS')),
    };
};

const defineTrebleEnv = (env: TrebleEnv) => {
    return Object.fromEntries(
        Object.entries(env).map(([key, value]) => {
            return [`process.env.${key}`, JSON.stringify(value)];
        })
    ) as Record<`process.env.${TrebleEnvKey}`, string>;
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isEmbedBuild = process.env.BUILD_MODE === 'embed';
    const trebleEnv = getTrebleEnv(env);
    return {
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
                      fileName: () => {
                          return 'threekit-embed.js';
                      },
                      formats: ['iife'],
                  },
                  outDir: 'dist-embed',
                  target: ['es2022', 'edge100', 'firefox100', 'chrome100', 'safari15.4', 'opera90'],
                  assetsInlineLimit: () => {
                      return true;
                  },
              }
            : {
                  outDir: 'dist',
                  commonjsOptions: {
                      include: [/threekit-tools/, /node_modules/],
                  },
              },

        define: defineTrebleEnv(trebleEnv),

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
            port: 3000,
        },
    };
});
