import { usePlayer } from '@/hooks/usePlayer';
import { LoaderFull } from '@/components/ui/LoaderFull';
import { Form } from './Form';
import { Player } from './Player';
import { PlayerWidgets } from './Player/PlayerWidgets';
import s from './styles.module.css';

export const Configurator = () => {
    const { isLoaded } = usePlayer();

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
