## What to build

Remove the custom `ThreekitContextProvider` and the seven micro-hooks that forward single calls (`useSetAttribute`, `useAttribute`, `useAttributes`, `usePlayerStatus`, `useUndoRedo`, `useGetTranslation`, `useGetRotation`). Replace them with three semantic hooks backed directly by the vanilla Zustand store and the adapter:

- `useConfigurator` — attributes, setters, undo/redo
- `usePlayer` — ready status and player handle
- `useScene` — transform and scene-query helpers

Treble's own `ThreekitProvider` stays mounted; only the app's custom context layer is deleted. All feature code is migrated to the new hooks in the same slice.

## Acceptance criteria

- [ ] `ThreekitContextProvider` and its directory are deleted.
- [ ] The seven micro-hooks are deleted.
- [ ] `useConfigurator`, `usePlayer`, `useScene` exist and are the only hooks exposed for Threekit state.
- [ ] Every feature component that previously used a micro-hook is migrated to the new API.
- [ ] The store is a vanilla (non-React-bound) Zustand store consumable outside a React tree.
- [ ] Treble's `ThreekitProvider` is still mounted at the root.
- [ ] Configurator behavior is unchanged (manual parity check).

## Blocked by

- Blocked by #01-introduce-threekit-adapter
