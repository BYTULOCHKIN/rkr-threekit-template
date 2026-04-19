import { useConfiguratorStore } from '@/store/store';
import { PRIVATE_APIS } from '@threekit-tools/treble/dist/types';
import { getSavedConfiguration } from '@/services/threekit/api';

export const useThreekitInit = () => {
    const { setLoaded, setAttributes, setProcessing } = useConfiguratorStore();

    const init = async () => {
        const shortId = new URLSearchParams(window.location.search).get('shortId');

        if (shortId) {
            setProcessing(true);
            try {
                const savedConfig = await getSavedConfiguration(shortId);
                await window.threekit.configurator.setConfiguration(savedConfig.variant);
                const privatePlayer = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
                await privatePlayer.api.evaluate();
                const attributes = window.threekit.configurator.getDisplayAttributes();
                setAttributes(attributes);
            } finally {
                setProcessing(false);
            }
        } else {
            const attributes = window.threekit.configurator.getDisplayAttributes();
            setAttributes(attributes);
        }

        setLoaded(true);
    };

    return { init };
};
