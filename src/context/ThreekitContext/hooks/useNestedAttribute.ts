import { IThreekitDisplayAttribute, NestedPath } from '../nested-types';
import { useNestedAttributes } from './useNestedAttributes';

export const useNestedAttribute = (path: NestedPath, name: string): IThreekitDisplayAttribute | undefined => {
    return useNestedAttributes(path).find((attr) => {
        return attr.name === name;
    });
};
