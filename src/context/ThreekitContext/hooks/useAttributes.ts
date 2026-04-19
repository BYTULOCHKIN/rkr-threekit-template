import { useConfiguratorStore } from '@/store/store';

export const useAttributes = () => {
    return useConfiguratorStore((state) => state.attributes);
};
