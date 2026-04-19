import type { ReactNode } from 'react';
import type { ThreekitContextValue } from './types';
import { createContext, useContext } from 'react';
import { useConfiguratorStore } from '@/store/store';
import {
    ICoordinates,
    ISetConfiguration,
    PLUG_TYPES,
    PRIVATE_APIS,
    TRANSFORM_PROPERTY_TYPES,
} from '@threekit-tools/treble/dist/types';

const ThreekitContext = createContext<ThreekitContextValue | null>(null);

export const ThreekitContextProvider = ({ children }: { children: ReactNode }) => {
    const { isLoaded, isProcessing, setProcessing, setAttribute } = useConfiguratorStore();
    const { undo, redo } = useConfiguratorStore.temporal.getState();

    const handleSetAttribute = async (name: string, value: ISetConfiguration[string]) => {
        setAttribute(name, value);
        setProcessing(true);
        try {
            await window.threekit.configurator.setConfiguration({ [name]: value } as ISetConfiguration);
            const privatePlayer = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
            await privatePlayer.api.evaluate();
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

    return (
        <ThreekitContext.Provider
            value={{
                isLoaded,
                isProcessing,
                setAttribute: handleSetAttribute,
                getTranslation,
                getRotation,
                undo,
                redo,
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
