## What to build

Introduce a `ThreekitAdapter` module that becomes the single boundary to `window.threekit.*`. All existing call sites (context, hooks, services) are rewired to go through the adapter, but the adapter is a straight passthrough for now — no behavior changes, no type changes, no store changes. The configurator still works exactly as it does today; the only difference is that there is now one file in the repo that owns every SDK call.

The adapter exposes `setAttribute`, `getAttributes`, `applyConfiguration`, `getTransform`, `getRotation`, and a typed `subscribe(event, cb)` channel. Internally it performs `setConfiguration` + `evaluate()` as one atomic command. Other modules stop importing from `@threekit-tools/treble` directly (except the bootstrap that mounts Treble's provider).

## Acceptance criteria

- [ ] A `ThreekitAdapter` module exists and owns every `window.threekit.*` call in the repo.
- [ ] No file outside the adapter and the Treble provider bootstrap imports from `@threekit-tools/treble`.
- [ ] `setConfiguration` + `evaluate()` are invoked from exactly one place (the adapter's write command).
- [ ] `as unknown as` casts around scene queries are removed at the adapter boundary.
- [ ] Adapter exposes a typed `subscribe` channel (no subscribers wired yet — delivered in slice #4).
- [ ] Attribute editing, undo/redo, and saved-configuration load behave identically to before the change (manual parity check).

## Blocked by

None — can start immediately.
