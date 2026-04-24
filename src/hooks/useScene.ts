import { useMemo } from 'react';
import { threekitAdapter } from '@/services/threekit/adapter';

export const useScene = () => {
    return useMemo(() => {
        return {
            getTranslation: threekitAdapter.getTranslation.bind(threekitAdapter),
            getRotation: threekitAdapter.getRotation.bind(threekitAdapter),
        };
    }, []);
};
