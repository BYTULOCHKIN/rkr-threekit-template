import { IConfigurationAttribute } from '@threekit-tools/treble/dist/types';
import { useGetAttribute } from './useGetAttribute';
import { useSetAttribute } from './useSetAttribute';

export const useAttribute = (name: string) => {
    const attribute = useGetAttribute(name);
    const setAttribute = useSetAttribute();

    const setValue = (value: IConfigurationAttribute) => {
        return setAttribute(name, value);
    };

    return { attribute, setValue } as const;
};
