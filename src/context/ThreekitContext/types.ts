import { IConfigurationAttribute, ICoordinates, ISetConfiguration } from '@threekit-tools/treble/dist/types';
import { NestedPath } from './nested-types';

export interface ThreekitContextValue {
    isLoaded: boolean;
    isProcessing: boolean;
    setAttribute: (name: string, value: ISetConfiguration[string]) => Promise<void>;
    getTranslation: (nodeId: string) => Promise<ICoordinates | undefined>;
    getRotation: (nodeId: string) => Promise<ICoordinates | undefined>;
    saveConfiguration: (metadata?: Record<string, unknown>) => Promise<string>;
    undo: () => void;
    redo: () => void;
    /**
     * Встановлює значення атрибуту у вкладеному конфігураторі за шляхом.
     * Після set: evaluate → sync store → компоненти ре-рендеряться.
     *
     * @example
     * setNestedAttribute(['Template'], 'Area Type 2', { assetId: '...' })
     * setNestedAttribute(['Template', 'Area Type 2'], 'Text Line On Area 2', updatedLines)
     */
    setNestedAttribute: (path: NestedPath, name: string, value: IConfigurationAttribute) => Promise<void>;
}
