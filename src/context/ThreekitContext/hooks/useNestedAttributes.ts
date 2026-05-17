import { ConfiguratorState, useConfiguratorStore } from '@/store/store';
import { createSelector } from 'reselect';
import { IThreekitDisplayAttribute, NestedPath } from '../nested-types';

const selectNestedAttributes = createSelector(
    (state: ConfiguratorState) => {
        return state.nestedAttributes;
    },
    (_state: ConfiguratorState, key: string) => {
        return key;
    },
    (nestedAttributes, key): IThreekitDisplayAttribute[] => {
        return nestedAttributes[key] ?? [];
    }
);

export const useNestedAttributes = (path: NestedPath): IThreekitDisplayAttribute[] => {
    const key = path.join('.');
    return useConfiguratorStore((state) => {
        return selectNestedAttributes(state, key);
    });
};
