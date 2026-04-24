import { useConfiguratorStore } from '@/store/store';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useThreekitInitStatus } from '@threekit-tools/treble';
import { setAttributeMutationKey, threekitQueryKeys } from '@/services/threekit/queries';

export const usePlayer = () => {
    const trebleReady = useThreekitInitStatus();
    const attributesPopulated = useConfiguratorStore((state) => {
        return Object.keys(state.attributes).length > 0;
    });
    const fetching = useIsFetching({ queryKey: threekitQueryKeys.all });
    const mutating = useIsMutating({ mutationKey: setAttributeMutationKey });

    const isLoaded = trebleReady && attributesPopulated && fetching === 0;
    const isProcessing = mutating > 0;

    return { isLoaded, isProcessing };
};
