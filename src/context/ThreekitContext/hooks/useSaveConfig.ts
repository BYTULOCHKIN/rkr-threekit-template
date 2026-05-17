import { useThreekit } from '@/context/ThreekitContext';

export const useSaveConfig = () => {
    return useThreekit().saveConfiguration;
};
