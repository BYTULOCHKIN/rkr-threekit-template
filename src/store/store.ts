import { IThreekitDisplayAttribute } from '@threekit-tools/treble/dist/types';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NestedPath } from '@/context/ThreekitContext/nested-types';

export interface ConfiguratorState {
    attributes: Array<IThreekitDisplayAttribute>;
    isProcessing: boolean;
    isLoaded: boolean;
    nestedPath: NestedPath;
    nestedAttributes: Record<string, IThreekitDisplayAttribute[]>;

    setAttribute: (name: string, value: unknown) => void;
    setAttributes: (attributes: Array<IThreekitDisplayAttribute>) => void;
    setProcessing: (value: boolean) => void;
    setLoaded: (value: boolean) => void;
    setNestedPath: (value: NestedPath) => void;
    setNestedAttributes: (pathKey: string, attrs: IThreekitDisplayAttribute[]) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
    devtools(
        temporal(
            (set) => {
                return {
                    attributes: [],
                    nestedAttributes: {},
                    isProcessing: false,
                    isLoaded: false,
                    nestedPath: ['SOME_NESTED_ATTR_NAME'], //JUST EXAMPLE. REMOVE OR UPDATE TO REAL NAME

                    setAttribute: (name, value) => {
                        return set((state) => {
                            return {
                                attributes: state.attributes.map((attr) => {
                                    return attr.name === name ? { ...attr, value: value as never } : attr;
                                }),
                            };
                        });
                    },

                    setAttributes: (attributes) => {
                        return set({ attributes });
                    },
                    setProcessing: (value) => {
                        return set({ isProcessing: value });
                    },
                    setLoaded: (value) => {
                        return set({ isLoaded: value });
                    },
                    setNestedPath(value) {
                        return set({ nestedPath: value });
                    },
                    setNestedAttributes: (pathKey, attrs) => {
                        return set((state) => {
                            return {
                                nestedAttributes: { ...state.nestedAttributes, [pathKey]: attrs },
                            };
                        });
                    },
                };
            },
            {
                limit: 50,
                partialize: (state) => {
                    return { attributes: state.attributes };
                },
            }
        ),
        { name: 'ConfiguratorStore' } // 4. Название стора для Redux DevTools
    )
);
