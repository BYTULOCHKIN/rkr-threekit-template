import { useThreekit } from '@/context/ThreekitContext';

export const useUndoRedo = () => {
    const { undo, redo } = useThreekit();
    return { undo, redo };
};
