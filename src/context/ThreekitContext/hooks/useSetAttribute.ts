import { useThreekit } from '@/context/ThreekitContext';

export const useSetAttribute = () => {
    return useThreekit().setAttribute;
};
