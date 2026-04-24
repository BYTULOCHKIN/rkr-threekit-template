import type { ConfigurationPatch } from '@/domain/configurator';
import { queryOptions } from '@tanstack/react-query';
import { http } from '@/lib/@http';

export interface SavedConfiguration {
    variant: ConfigurationPatch;
    metadata: Record<string, unknown>;
}

export const threekitQueryKeys = {
    all: ['threekit'] as const,
    savedConfiguration: (shortId: string | null) => {
        return ['threekit', 'savedConfiguration', shortId ?? 'none'] as const;
    },
};

export const setAttributeMutationKey = ['threekit', 'setAttribute'] as const;

export const savedConfigurationQueryOptions = (shortId: string | null) => {
    return queryOptions({
        queryKey: threekitQueryKeys.savedConfiguration(shortId),
        queryFn: ({ signal }): Promise<SavedConfiguration> => {
            const token = import.meta.env.VITE_TK_PUBLIC_TOKEN;
            const env = import.meta.env.VITE_TK_ENV ?? 'preview';
            return http
                .get(`https://${env}.threekit.com/api/configurations/${shortId}`, {
                    searchParams: { bearer_token: token },
                    signal,
                })
                .json<SavedConfiguration>();
        },
        enabled: !!shortId,
        staleTime: Infinity,
    });
};
