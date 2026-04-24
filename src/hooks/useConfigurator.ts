import type { AttributeValue } from '@/domain/configurator';
import { useCallback } from 'react';
import { useConfiguratorStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { threekitAdapter } from '@/services/threekit/adapter';
import { intentLog } from '@/services/threekit/intentLog';
import { setAttributeMutationKey } from '@/services/threekit/queries';

interface SetAttributeArgs {
    name: string;
    value: AttributeValue;
}

interface SetAttributeContext {
    prior: AttributeValue;
}

export const useConfigurator = () => {
    const attributes = useConfiguratorStore((state) => {
        return state.attributes;
    });
    const setMeta = useConfiguratorStore((state) => {
        return state.setMeta;
    });

    const { mutateAsync } = useMutation<void, Error, SetAttributeArgs, SetAttributeContext>({
        mutationKey: setAttributeMutationKey,
        mutationFn: ({ name, value }) => {
            return threekitAdapter.setAttribute(name, value);
        },
        onMutate: ({ name }) => {
            const prior = useConfiguratorStore.getState().attributes[name]?.value;
            return { prior };
        },
        onSuccess: (_data, { name, value }, context) => {
            const prior = context?.prior;
            intentLog.record({
                apply: () => {
                    return threekitAdapter.setAttribute(name, value);
                },
                invert: () => {
                    return threekitAdapter.setAttribute(name, prior);
                },
                label: `setAttribute(${name})`,
            });
        },
        onError: (error) => {
            setMeta('lastError', error);
        },
    });

    const setAttribute = useCallback(
        (name: string, value: AttributeValue) => {
            return mutateAsync({ name, value });
        },
        [mutateAsync]
    );

    const undo = useCallback((): void => {
        void intentLog.undo();
    }, []);
    const redo = useCallback((): void => {
        void intentLog.redo();
    }, []);

    return { attributes, setAttribute, undo, redo };
};

export const useAttribute = (name: string) => {
    return useConfiguratorStore((state) => {
        return state.attributes[name];
    });
};
