import { useEffect, useRef } from 'react';
import { usePlayerPortal, useThreekitInitStatus } from '@threekit-tools/treble';
import { useThreekitInit } from '@/hooks/useThreekitInit';
import s from './styles.module.css';

const PLAYER_DIV_ID = 'tk-player-component';

export const Player = (props: { children?: React.ReactNode }) => {
    const [portalPlayerTo, portalBack] = usePlayerPortal();
    const hasLoaded = useThreekitInitStatus();
    const hasMoved = useRef<boolean>(false);

    useThreekitInit();

    useEffect(() => {
        if (portalPlayerTo && !hasMoved.current && hasLoaded) {
            portalPlayerTo(PLAYER_DIV_ID);
            hasMoved.current = true;
        }

        return () => {
            if (portalBack) {
                portalBack();
                hasMoved.current = false;
            }
        };
    }, [portalPlayerTo, hasLoaded, portalBack]);

    return (
        <div className={s.playerWrapper}>
            <div id={PLAYER_DIV_ID} className={s.player} />
            {props.children}
        </div>
    );
};
