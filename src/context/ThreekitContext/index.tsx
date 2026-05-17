import type { ReactNode } from 'react';
import type { ThreekitContextValue } from './types';
import { createContext, useContext } from 'react';
import { useConfiguratorStore } from '@/store/store';
import {
    IConfigurationAttribute,
    ICoordinates,
    ISetConfiguration,
    PLUG_TYPES,
    PRIVATE_APIS,
    TRANSFORM_PROPERTY_TYPES,
} from '@threekit-tools/treble/dist/types';
import { NestedPath } from './nested-types';
import { readNestedDisplayAttributes, setNestedConfiguration } from './nestedConfigurator.ts/nestedConfigurator';

const ThreekitContext = createContext<ThreekitContextValue | null>(null);

export const ThreekitContextProvider = ({ children }: { children: ReactNode }) => {
    const { isLoaded, isProcessing, setProcessing, setAttribute, setNestedAttributes } = useConfiguratorStore();
    const { undo, redo } = useConfiguratorStore.temporal.getState();

    const handleSetAttribute = async (name: string, value: ISetConfiguration[string]) => {
        setAttribute(name, value);
        setProcessing(true);
        try {
            await window.threekit.configurator.setConfiguration({ [name]: value } as ISetConfiguration);
            const privatePlayer = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
            await privatePlayer.api.evaluate();

            syncAttributes();
        } finally {
            setProcessing(false);
        }
    };

    const getTranslation = async (nodeId: string): Promise<ICoordinates | undefined> => {
        const result = await window.threekit.player.scene.get({
            id: nodeId,
            plug: 'Transform' as unknown as PLUG_TYPES.TRANSFORM,
            property: 'translation' as unknown as TRANSFORM_PROPERTY_TYPES.TRANSLATION,
        });
        return result as unknown as ICoordinates;
    };

    const getRotation = async (nodeId: string): Promise<ICoordinates | undefined> => {
        const result = await window.threekit.player.scene.get({
            id: nodeId,
            plug: 'Transform' as unknown as PLUG_TYPES.TRANSFORM,
            property: 'rotation' as unknown as TRANSFORM_PROPERTY_TYPES.ROTATION,
        });
        return result as unknown as ICoordinates;
    };

    const handleSaveConfiguration = async (metadata?: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const res = await window.threekit.player.saveConfiguration({ metadata });

        return `${window.location.origin}?tkConfigId=${res.shortId}`;
    };

    const handleSetNestedAttribute = async (
        path: NestedPath,
        name: string,
        value: IConfigurationAttribute
    ): Promise<void> => {
        setProcessing(true);
        try {
            await setNestedConfiguration(path, name, value); // ← сервіс

            const privatePlayer = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
            await privatePlayer.api.evaluate();

            // Синхронізуємо store для цього path
            const pathKey = path.join('.');
            const attrs = readNestedDisplayAttributes(path);
            setNestedAttributes(pathKey, attrs);
        } finally {
            setProcessing(false);
        }
    };

    const syncAttributes = () => {
        const updatedAttrs = window.threekit.configurator.getDisplayAttributes();
        const { pause, resume } = useConfiguratorStore.temporal.getState();
        pause();
        useConfiguratorStore.getState().setAttributes(updatedAttrs);
        resume();
    };

    return (
        <ThreekitContext.Provider
            value={{
                isLoaded,
                isProcessing,
                getTranslation,
                getRotation,
                undo,
                redo,
                saveConfiguration: handleSaveConfiguration,
                setAttribute: handleSetAttribute,
                setNestedAttribute: handleSetNestedAttribute,
            }}
        >
            {children}
        </ThreekitContext.Provider>
    );
};

export const useThreekit = () => {
    const context = useContext(ThreekitContext);
    if (!context) {
        throw new Error('useThreekit must be used within ThreekitContextProvider');
    }
    return context;
};
