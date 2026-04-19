import type { IConfiguration } from '@threekit-tools/treble/dist/types';
import { http } from '@/lib/@http';

export interface SavedConfiguration {
    variant: IConfiguration;
    metadata: Record<string, unknown>;
}

export const getSavedConfiguration = (shortId: string): Promise<SavedConfiguration> => {
    const token = import.meta.env.VITE_TK_PUBLIC_TOKEN;
    const env = import.meta.env.VITE_TK_ENV ?? 'preview';

    return http
        .get(`https://${env}.threekit.com/api/configurations/${shortId}`, {
            searchParams: { bearer_token: token },
        })
        .json<SavedConfiguration>();
};
