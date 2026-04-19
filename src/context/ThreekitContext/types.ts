import { ICoordinates, ISetConfiguration } from '@threekit-tools/treble/dist/types';

export interface ThreekitContextValue {
    isLoaded: boolean;
    isProcessing: boolean;
    setAttribute: (name: string, value: ISetConfiguration[string]) => Promise<void>;
    getTranslation: (nodeId: string) => Promise<ICoordinates | undefined>;
    getRotation: (nodeId: string) => Promise<ICoordinates | undefined>;
    undo: () => void;
    redo: () => void;
}
