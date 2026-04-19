import { usePlayerStatus } from '@/context/ThreekitContext/hooks/usePlayerStatus';
import { LoaderFull } from '@/components/ui/LoaderFull';
import { Form } from './Form';
import { Player } from './Player';
import { PlayerWidgets } from './Player/PlayerWidgets';
import s from './styles.module.css';

export const Configurator = () => {
    const { isLoaded } = usePlayerStatus();

    return (
        <div className={s.configurator}>
            <LoaderFull isLoading={!isLoaded} />
            <Form />
            <Player>
                <PlayerWidgets />
            </Player>
        </div>
    );
};
