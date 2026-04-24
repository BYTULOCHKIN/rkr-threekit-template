import { useConfiguratorStore } from '@/store/store';
import { threekitAdapter } from '@/services/threekit/adapter';

let started = false;
let unsubscribe: (() => void) | null = null;

// Subscribes to SDK-originated configuration changes and mirrors the latest
// attribute snapshot into the store. Idempotent: safe to call on every mount.
export const startSync = (): void => {
    if (started) return;
    started = true;

    unsubscribe = threekitAdapter.subscribe('change', () => {
        const { setAttributes } = useConfiguratorStore.getState();
        setAttributes(threekitAdapter.getAttributes());
    });
};

export const stopSync = (): void => {
    unsubscribe?.();
    unsubscribe = null;
    started = false;
};
