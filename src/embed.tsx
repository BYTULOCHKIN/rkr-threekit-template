import { Configurator } from '@/configurator';
import { queryClient } from '@/lib/@queryClient';
import { ThreekitContextProvider } from '@/context/ThreekitContext';

import '@/styles/index.css';
import '@fontsource/geologica/300.css';
import '@fontsource/geologica/400.css';
import '@fontsource/geologica/500.css';
import '@fontsource/geologica/600.css';
import '@fontsource/geologica/700.css';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import ThreekitProvider from '@threekit-tools/treble/dist/components/ThreekitProvider';
import { DISPLAY_OPTIONS } from '@threekit-tools/treble/dist/types';

const env = import.meta.env.VITE_TK_ENV ?? 'preview';

const el = document.getElementById('threekit-player');

if (!el) {
    throw new Error('[Threekit] Mount element #threekit-player not found');
}

ReactDOM.createRoot(el).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThreekitProvider
                threekitEnv={env}
                assetId={import.meta.env.VITE_TK_ASSET_ID}
                serverUrl={`https://${env}.threekit.com`}
                project={{
                    credentials: {
                        [env]: {
                            publicToken: import.meta.env.VITE_TK_PUBLIC_TOKEN,
                            orgId: import.meta.env.VITE_TK_ORG_ID,
                        },
                    },

                    products: {
                        default: {
                            [env]: import.meta.env.VITE_TK_ASSET_ID,
                        },
                    },
                }}
                playerConfig={{
                    publishStage: 'published',
                    display: DISPLAY_OPTIONS.WEBGL,
                }}
            >
                <ThreekitContextProvider>
                    <Configurator />
                </ThreekitContextProvider>
            </ThreekitProvider>
        </QueryClientProvider>
    </StrictMode>
);
