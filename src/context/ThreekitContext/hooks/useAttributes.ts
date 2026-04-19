import { useConfiguratorStore } from '@/store/store';

export const useAttributes = () => {
    return useConfiguratorStore((state) => {
        return state.attributes;
    });
};
