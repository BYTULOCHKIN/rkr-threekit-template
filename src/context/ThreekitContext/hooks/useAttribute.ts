import { useConfiguratorStore } from '@/store/store';

export const useAttribute = (name: string) => {
    return useConfiguratorStore((state) => state.attributes.find((attr) => attr.name === name));
};
