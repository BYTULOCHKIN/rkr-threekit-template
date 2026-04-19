import { useThreekit } from '@/context/ThreekitContext';

export const usePlayerStatus = () => {
    const { isLoaded, isProcessing } = useThreekit();
    return { isLoaded, isProcessing };
};
