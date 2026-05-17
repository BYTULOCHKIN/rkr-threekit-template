import { useCallback } from 'react';
import { useConfiguratorStore } from '@/store/store';

export const useThreekitInit = () => {
    const init = useCallback(() => {
        const { setLoaded, setAttributes } = useConfiguratorStore.getState();
        const attributes = window.threekit.configurator.getDisplayAttributes();

        setAttributes(attributes);
        setLoaded(true);
    }, []); // порожній deps — функція створюється один раз

    return { init };
};
