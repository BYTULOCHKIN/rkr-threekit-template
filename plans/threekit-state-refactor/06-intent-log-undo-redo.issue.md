## What to build

Replace the zundo snapshot-based history with a command/inverse-command `IntentLog` that powers undo/redo. Each history entry is a pair `{ apply, invert }` of adapter commands — a semantic operation, not a state diff. Undo and redo replay through the adapter so the store and the SDK stay in lockstep; the 3D player moves together with the form controls. The zundo dependency is removed at the end of this slice.

`useConfigurator` continues to expose `undo` / `redo`, but the implementation is now driven by the intent log rather than a middleware-captured state history.

## Acceptance criteria

- [ ] An `IntentLog` module exists and records `{ apply, invert }` pairs of adapter commands.
- [ ] Undo and redo replay through the adapter, updating both the store and the SDK.
- [ ] Pressing undo after an attribute edit moves the 3D player back to the prior state (not just the form).
- [ ] The intent log ignores SDK-echoed changes originating from undo/redo itself (no double-recording).
- [ ] `useConfigurator().undo` / `.redo` continue to work at call sites without API changes.
- [ ] `zundo` is removed from `package.json` and no longer imported anywhere.
- [ ] Attribute editing and saved-configuration load still behave identically (manual parity check).

## Blocked by

- Blocked by #01-introduce-threekit-adapter
- Blocked by #04-sdk-event-sync
