import type { ICoordinates, ISetConfiguration, IThreekitDisplayAttribute } from '@threekit-tools/treble/dist/types';
import type {
    AttributeDescriptor,
    AttributeMap,
    AttributeValue,
    ConfigurationPatch,
    Transform,
} from '@/domain/configurator';
import { PLUG_TYPES, PRIVATE_APIS, TRANSFORM_PROPERTY_TYPES } from '@threekit-tools/treble/dist/types';

// evaluate() lives on the private player API — the adapter is the only place
// aware of this dependency so future Treble upgrades touch one file.
const runEvaluate = async () => {
    const privatePlayer = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
    await privatePlayer.api.evaluate();
};

const toDescriptor = (attr: IThreekitDisplayAttribute): AttributeDescriptor => {
    const raw = attr as unknown as Record<string, unknown>;
    const base: AttributeDescriptor = {
        name: attr.name,
        label: attr.label,
        type: attr.type,
        value: attr.value as AttributeValue,
        visible: raw.visible as boolean | undefined,
        metadata: raw.metadata as Record<string, unknown> | undefined,
    };

    const rawValues = raw.values;
    if (Array.isArray(rawValues)) {
        base.values = rawValues.map((option) => {
            if (typeof option === 'object' && option !== null && 'label' in option) {
                const opt = option as { label: string; value?: AttributeValue };
                return { label: opt.label, value: opt.value ?? (option as AttributeValue) };
            }
            return { label: String(option), value: option as AttributeValue };
        });
    }

    if (typeof raw.min === 'number') base.min = raw.min;
    if (typeof raw.max === 'number') base.max = raw.max;
    if (typeof raw.step === 'number') base.step = raw.step;

    return base;
};

const toTransform = (result: unknown): Transform | undefined => {
    if (!result || typeof result !== 'object') return undefined;
    const coords = result as Partial<ICoordinates>;
    if (typeof coords.x !== 'number' || typeof coords.y !== 'number' || typeof coords.z !== 'number') {
        return undefined;
    }
    return { x: coords.x, y: coords.y, z: coords.z };
};

type ChangeListener = () => void;
const changeListeners = new Set<ChangeListener>();
let sdkListenerAttached = false;

// Native Treble event: player.on('setConfiguration', cb) fires after every
// applied configuration change (Treble's own store uses the same channel).
const ensureSdkListener = () => {
    if (sdkListenerAttached) return;
    sdkListenerAttached = true;
    window.threekit.player.on('setConfiguration', () => {
        for (const listener of changeListeners) listener();
    });
};

export const threekitAdapter = {
    getAttributes(): AttributeMap {
        const attributes = window.threekit.configurator.getDisplayAttributes();
        const result: AttributeMap = {};
        for (const attr of attributes) {
            result[attr.name] = toDescriptor(attr);
        }
        return result;
    },

    async setAttribute(name: string, value: AttributeValue): Promise<void> {
        await window.threekit.configurator.setConfiguration({
            [name]: value,
        } as unknown as ISetConfiguration);
        await runEvaluate();
    },

    async applyConfiguration(patch: ConfigurationPatch): Promise<void> {
        await window.threekit.configurator.setConfiguration(patch as unknown as ISetConfiguration);
        await runEvaluate();
    },

    async getTranslation(nodeId: string): Promise<Transform | undefined> {
        const result = await window.threekit.player.scene.get({
            id: nodeId,
            plug: 'Transform' as unknown as PLUG_TYPES.TRANSFORM,
            property: TRANSFORM_PROPERTY_TYPES.TRANSLATION as unknown as TRANSFORM_PROPERTY_TYPES.TRANSLATION,
        });
        return toTransform(result);
    },

    async getRotation(nodeId: string): Promise<Transform | undefined> {
        const result = await window.threekit.player.scene.get({
            id: nodeId,
            plug: 'Transform' as unknown as PLUG_TYPES.TRANSFORM,
            property: TRANSFORM_PROPERTY_TYPES.ROTATION as unknown as TRANSFORM_PROPERTY_TYPES.ROTATION,
        });
        return toTransform(result);
    },

    // Typed subscribe channel for SDK-originated changes. The native listener
    // is attached lazily on first subscribe — callers must wait until the
    // player is ready before subscribing.
    subscribe(event: 'change', listener: ChangeListener): () => void {
        if (event !== 'change') return () => {};
        ensureSdkListener();
        changeListeners.add(listener);
        return () => {
            changeListeners.delete(listener);
        };
    },
};

export type ThreekitAdapter = typeof threekitAdapter;
