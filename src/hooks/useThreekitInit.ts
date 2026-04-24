import { useEffect } from 'react';
import { useConfiguratorStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { useThreekitInitStatus } from '@threekit-tools/treble';
import { threekitAdapter } from '@/services/threekit/adapter';
import { savedConfigurationQueryOptions } from '@/services/threekit/queries';
import { startSync } from '@/services/threekit/sync';

const getShortId = () => {
    return new URLSearchParams(window.location.search).get('shortId');
};

export const useThreekitInit = () => {
    const trebleReady = useThreekitInitStatus();
    const shortId = getShortId();
    const setAttributes = useConfiguratorStore((state) => {
        return state.setAttributes;
    });

    const { data: savedConfig, isSuccess: savedConfigLoaded } = useQuery({
        ...savedConfigurationQueryOptions(shortId),
        enabled: !!shortId && trebleReady,
    });

    useEffect(() => {
        if (!trebleReady) return;
        startSync();

        if (shortId) {
            if (!savedConfigLoaded || !savedConfig) return;
            let cancelled = false;
            void threekitAdapter.applyConfiguration(savedConfig.variant).then(() => {
                if (!cancelled) setAttributes(threekitAdapter.getAttributes());
            });
            return () => {
                cancelled = true;
            };
        }

        setAttributes(threekitAdapter.getAttributes());
    }, [trebleReady, shortId, savedConfig, savedConfigLoaded, setAttributes]);
};
