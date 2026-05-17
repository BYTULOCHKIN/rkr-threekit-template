// src/services/threekit/nested.ts

import type {
    IConfigurationAttribute,
    IThreekitConfigurator,
    IThreekitDisplayAttribute,
} from '@threekit-tools/treble/dist/types';
import type { NestedPath } from '@/context/ThreekitContext/nested-types';

/**
 * Отримує nested configurator за path одним викликом.
 * Офіційний API: getNestedConfigurator(string | Array<string | number>)
 * Повертає undefined якщо path недоступний.
 */
const resolveNestedConf = (path: NestedPath): IThreekitConfigurator | undefined => {
    const root = window.threekit.configurator;
    return root.getNestedConfigurator([...path]);
};

/**
 * Читає display attributes вкладеного конфігуратора за path.
 * Повертає масив (getDisplayAttributes повертає Array, не Record).
 */
export const readNestedDisplayAttributes = (path: NestedPath): IThreekitDisplayAttribute[] => {
    try {
        const conf = resolveNestedConf(path);
        if (!conf) {
            // eslint-disable-next-line no-console
            console.warn(`[Threekit] Nested conf not found at path: ${path.join(' -> ')}`);
            return [];
        }
        return conf.getDisplayAttributes();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[Threekit] Could not read attributes at path: ${path.join(' -> ')}`, e);
        return [];
    }
};

/**
 * Перевіряє наявність nested configurator за path.
 */
export const hasNestedConf = (path: NestedPath): boolean => {
    try {
        return resolveNestedConf(path) !== undefined;
    } catch {
        return false;
    }
};

/**
 * Встановлює значення одного атрибуту у вкладеному конфігураторі.
 * НЕ викликає evaluate — це відповідальність контексту.
 */
export const setNestedConfiguration = async (
    path: NestedPath,
    name: string,
    value: IConfigurationAttribute
): Promise<void> => {
    const conf = resolveNestedConf(path);
    if (!conf) {
        throw new Error(`[Threekit] Nested conf not found at path: ${path.join(' -> ')}`);
    }
    await conf.setConfiguration({ [name]: value });
};

/**
 * Повертає поточну конфігурацію nested configurator.
 */
export const getNestedConfigurationRecord = (path: NestedPath): Record<string, unknown> | undefined => {
    const conf = resolveNestedConf(path);
    if (!conf) return undefined;
    return conf.getFullConfiguration() as Record<string, unknown>;
};
