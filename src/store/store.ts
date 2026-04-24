import type { AttributeMap, AttributeValue } from '@/domain/configurator';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ConfiguratorState {
    attributes: AttributeMap;
    ui: Record<string, unknown>;
    scene: Record<string, unknown>;
    meta: Record<string, unknown>;
    setAttribute: (name: string, value: AttributeValue) => void;
    setAttributes: (attributes: AttributeMap) => void;
    setUi: (key: string, value: unknown) => void;
    setScene: (key: string, value: unknown) => void;
    setMeta: (key: string, value: unknown) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
    devtools(
        (set) => {
            return {
                attributes: {},
                ui: {},
                scene: {},
                meta: {},

                setAttribute: (name, value) => {
                    return set((state) => {
                        const existing = state.attributes[name];
                        if (!existing) return state;
                        return {
                            attributes: {
                                ...state.attributes,
                                [name]: { ...existing, value },
                            },
                        };
                    });
                },

                setAttributes: (attributes) => {
                    return set({ attributes });
                },
                setUi: (key, value) => {
                    return set((state) => {
                        return { ui: { ...state.ui, [key]: value } };
                    });
                },
                setScene: (key, value) => {
                    return set((state) => {
                        return { scene: { ...state.scene, [key]: value } };
                    });
                },
                setMeta: (key, value) => {
                    return set((state) => {
                        return { meta: { ...state.meta, [key]: value } };
                    });
                },
            };
        },
        { name: 'ConfiguratorStore' }
    )
);
