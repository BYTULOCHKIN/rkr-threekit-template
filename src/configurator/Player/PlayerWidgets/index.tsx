import React from 'react';
import { usePlayer } from '@/hooks/usePlayer';

// import BottomCenterWidgets from './BottomCenterWidgets/BottomCenterWidgets';
// import { BottomLeftWidgets } from './BottomLeftWidgets/BottomLeftWidgets';
// import { BottomRightWidgets } from './BottomRightWidgets/BottomRightWidgets';
// import { TopLeftWidget } from './TopLeftWidget/TopLeftWidget';

export const PlayerWidgets: React.FC = () => {
    const { isLoaded } = usePlayer();

    if (!isLoaded) return null;
    // return (
    //     <>
    //         <TopLeftWidget />
    //         <BottomLeftWidgets />
    //         <BottomCenterWidgets />
    //         <BottomRightWidgets />
    //     </>
    // );
};
