import { useConfiguratorStore } from '@/store/store';

export const useGetAttribute = (name: string) => {
    return useConfiguratorStore((state) => {
        return state.attributes.find((attr) => {
            return attr.name === name;
        });
    });
};
