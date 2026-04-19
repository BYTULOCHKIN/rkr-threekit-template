import { IThreekitDisplayAttribute } from '@threekit-tools/treble/dist/types';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ConfiguratorState {
    attributes: Array<IThreekitDisplayAttribute>;
    isProcessing: boolean;
    isLoaded: boolean;
    setAttribute: (name: string, value: unknown) => void;
    setAttributes: (attributes: Array<IThreekitDisplayAttribute>) => void;
    setProcessing: (value: boolean) => void;
    setLoaded: (value: boolean) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
    devtools(
        temporal(
            (set) => ({
                attributes: [],
                isProcessing: false,
                isLoaded: false,

                setAttribute: (name, value) =>
                    set((state) => ({
                        attributes: state.attributes.map((attr) =>
                            attr.name === name ? { ...attr, value: value as never } : attr
                        ),
                    })),

                setAttributes: (attributes) => set({ attributes }),
                setProcessing: (value) => set({ isProcessing: value }),
                setLoaded: (value) => set({ isLoaded: value }),
            }),
            {
                limit: 50,
                partialize: (state) => ({ attributes: state.attributes }),
            }
        ),
        { name: 'ConfiguratorStore' } // 4. Название стора для Redux DevTools
    )
);
