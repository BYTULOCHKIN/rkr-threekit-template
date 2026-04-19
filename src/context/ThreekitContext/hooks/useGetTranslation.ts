import { useThreekit } from '@/context/ThreekitContext';

export const useGetTranslation = () => {
    return useThreekit().getTranslation;
};
