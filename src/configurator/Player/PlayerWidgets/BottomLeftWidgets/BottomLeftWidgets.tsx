import { useEffect } from 'react';
import { Player } from '@threekit-tools/treble/dist';
import clsx from 'clsx';
import { useUndoRedo } from '@/context/ThreekitContext/hooks/useUndoRedo';
import { Button } from '@/components/ui/Button/Button';
import s from './BottomLeftWidgets.module.css';

export const BottomLeftWidgets = () => {
    const { undo, redo } = useUndoRedo();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            if (ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            if (ctrlKey && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    return (
        <Player.BottomLeftWidgets>
            <div className={s.container_widgets}>
                <Button className={s.button} onClick={undo}>
                    Undo
                </Button>
                <Button className={clsx(s.button)} onClick={redo}>
                    Redo
                </Button>
            </div>
        </Player.BottomLeftWidgets>
    );
};
