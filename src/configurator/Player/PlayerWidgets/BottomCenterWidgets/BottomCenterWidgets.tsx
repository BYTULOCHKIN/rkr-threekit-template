import { FC } from 'react';
import { Player } from '@threekit-tools/treble/dist';
import { BottomCenterWidgetsPropsT } from './type';

const BottomCenterWidgets: FC<BottomCenterWidgetsPropsT> = () => {
    return (
        <Player.BottomCenterWidgets>
            <span>bottom center widgets</span>
        </Player.BottomCenterWidgets>
    );
};

export default BottomCenterWidgets;
