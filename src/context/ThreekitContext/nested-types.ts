// src/context/ThreekitContext/nested-types.ts

import type { IConfiguration, IConfigurationColor, IThreekitDisplayAttribute } from '@threekit-tools/treble/dist/types';

export type { IThreekitDisplayAttribute };

/**
 * path для getNestedConfigurator — відповідає офіційному типу treble:
 * string | Array<string | number>
 * Мінімум один елемент.
 */
export type NestedPath = readonly [string | number, ...(string | number)[]];

// ─── TextLine types ──────────────────────────────────────────────────────────

export interface TextLineAssetRef {
    assetId: string;
    type: 'item';
    configuration: Record<string, unknown>;
}

export interface TextLineConfiguration {
    'Enter text': string;
    Font: TextLineAssetRef;
    Scale: number;
    Rotation: number;
    'Left/Right': number;
    'Up/Down': number;
    'Text Color': IConfigurationColor;
}

/**
 * Елемент Array-атрибуту "Text Line On Area N".
 * configuration — string | IConfiguration (офіційний тип IConfigurationAsset).
 * Якщо string — серіалізований TextLineConfiguration.
 * Якщо IConfiguration — вже розпарсований об'єкт (Threekit може повернути обидва варіанти).
 */
export interface TextLineItem {
    assetId: string;
    type: 'texture';
    configuration: string | IConfiguration;
}

/**
 * Безпечний парсер configuration рядка.
 * Обробляє обидва варіанти: string і вже розпарсований об'єкт.
 */
export const parseTextLineConfiguration = (
    configuration: string | IConfiguration | undefined
): TextLineConfiguration | null => {
    if (!configuration) return null;

    // Threekit вже повернув об'єкт — не парсимо
    if (typeof configuration === 'object') {
        return configuration as unknown as TextLineConfiguration;
    }

    try {
        return JSON.parse(configuration) as TextLineConfiguration;
    } catch {
        console.warn('[Threekit] Failed to parse TextLine configuration:', configuration);
        return null;
    }
};
