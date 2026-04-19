import { useThreekit } from '@/context/ThreekitContext';

export const useGetRotation = () => {
    return useThreekit().getRotation;
};
