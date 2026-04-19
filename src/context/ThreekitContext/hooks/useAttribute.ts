import { useConfiguratorStore } from '@/store/store';

export const useAttribute = (name: string) => {
    return useConfiguratorStore((state) => {
        return state.attributes.find((attr) => {
            return attr.name === name;
        });
    });
};
