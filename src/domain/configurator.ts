export type AttributeValue = unknown;

export interface AttributeOption {
    label: string;
    value: AttributeValue;
}

export interface AttributeDescriptor {
    name: string;
    label?: string;
    type: string;
    value: AttributeValue;
    values?: Array<AttributeOption>;
    visible?: boolean;
    metadata?: Record<string, unknown>;
    min?: number;
    max?: number;
    step?: number;
}

export type AttributeMap = Record<string, AttributeDescriptor>;

export type ConfigurationPatch = Record<string, AttributeValue>;

export interface Transform {
    x: number;
    y: number;
    z: number;
}
