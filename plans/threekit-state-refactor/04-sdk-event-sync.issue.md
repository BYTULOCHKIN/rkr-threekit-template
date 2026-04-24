## What to build

Wire SDK-originated changes back into the store so external mutations (deeplinks, in-scene handles, rule-driven updates) are reflected in the UI without manual reconciliation. A new `ConfiguratorSync` module subscribes to the adapter's `subscribe('change', …)` channel and writes translated domain DTOs into the store. It also enforces one-way data flow: UI intents go out through the adapter, and the store is only updated from SDK echoes.

**This slice is HITL.** Before coding, verify the Treble SDK's event surface on the installed version. If a native change-event channel exists, the adapter uses it directly. If not, the adapter falls back to a debounced `getDisplayAttributes()` poll — this fallback is explicitly flagged as a short-term workaround in the adapter module and raised with the user for approval before landing.

## Acceptance criteria

- [ ] The Treble SDK event surface has been investigated and the chosen sync mechanism (native events vs. debounced poll) is documented inline in the adapter.
- [ ] If the poll fallback is used, this decision was surfaced to the user and approved before implementation.
- [ ] `ConfiguratorSync` module exists and is wired at the composition root.
- [ ] An SDK-originated mutation (simulated via direct `window.threekit.configurator.setConfiguration` in devtools) causes the UI to reflect the new attribute values without any UI-side action.
- [ ] UI writes still flow through the adapter; the store is never mutated directly from a component.
- [ ] On SDK rejection of a write, the store is not mutated and the failure is surfaced (via Query error or the `meta` namespace).
- [ ] Attribute editing, undo/redo, and saved-configuration load behave identically (manual parity check).

## Blocked by

- Blocked by #01-introduce-threekit-adapter
- Blocked by #02-domain-dtos-in-store
