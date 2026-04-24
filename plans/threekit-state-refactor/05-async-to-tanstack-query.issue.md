## What to build

Move all async SDK-adjacent flows to TanStack Query (already a dependency). `getSavedConfiguration` becomes a query with AbortSignal threaded through the adapter; save/export flows become mutations with standard retry, error, and pending states. The ad-hoc `isProcessing` / `isLoaded` booleans are deleted from the store — async status is owned by Query.

AbortSignal is propagated into adapter calls where the SDK supports cancellation; where it does not, the signal at least prevents state writes after unmount.

## Acceptance criteria

- [ ] `getSavedConfiguration` is a TanStack Query with AbortSignal support.
- [ ] Save/export operations are TanStack Query mutations.
- [ ] The `isProcessing` and `isLoaded` fields are removed from the store.
- [ ] Every former call site that set `isProcessing` now derives pending state from a Query.
- [ ] Unmounting a component mid-load does not result in a state write or a console warning.
- [ ] Attribute editing, undo/redo, and saved-configuration load behave identically (manual parity check).

## Blocked by

- Blocked by #01-introduce-threekit-adapter
