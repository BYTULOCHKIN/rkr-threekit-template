# Threekit State Architecture Refactor

## Problem Statement

As a developer working on the Threekit configurator, I find the current state architecture hard to reason about and fragile to extend:

- There are two sources of truth (the Zustand store and `window.threekit.configurator`) but sync is one-way, so any SDK-originated change (deeplink, drag handle, rule-driven mutation) silently desyncs the UI.
- SDK types (`IThreekitDisplayAttribute` and friends from `@threekit-tools/treble`) leak directly into the store and selectors, so a Treble version bump ripples into UI code across the repo.
- Imperative `window.threekit.*` calls — `setConfiguration`, private `evaluate()`, `player.scene.get()` with `as unknown as` casts — are scattered across context, hooks, and feature code with no rollback on async failure.
- Undo/redo is cosmetic: zundo snapshots only the `attributes` array, so an undo updates the React tree but leaves the 3D player in the old state until a manual `setConfiguration` is re-pushed.
- A custom React context wraps the Zustand store and exposes seven micro-hooks that each forward a single call — adding surface area without adding abstraction.
- Async flows (e.g. loading a saved configuration by shortId) have no cancellation and use ad-hoc `isProcessing` booleans instead of standard data-fetching primitives.

The net effect: the app feels fine today with a single asset and a small attribute list, but every new feature (external mutations, dynamic attribute sets, saved states, optimistic updates) costs disproportionately more than it should.

## Solution

Treat the Threekit SDK as an I/O boundary rather than first-class state. Introduce an adapter that owns every `window.threekit.*` call and translates between SDK types and app-owned domain DTOs. Behind that adapter, keep Zustand (dropping the Context wrapper and collapsing the micro-hooks) and store a generic, namespaced payload so any dynamic data can be added at runtime without a schema migration. Drive undo/redo from an intent log instead of state snapshots so the store and the player stay in lockstep. Move async SDK-adjacent operations to TanStack Query, which is already a dependency.

The result is one-way data flow with the SDK as authoritative source, a store that is consumable outside React, a single file (the adapter) that needs to change on Treble upgrades, and real undo/redo semantics.

## User Stories

1. As a developer, I want every `window.threekit.*` call to live in one module, so that upgrading the Treble SDK is a localized change.
2. As a developer, I want to import domain types (not SDK types) in UI code, so that component files are decoupled from `@threekit-tools/treble`.
3. As a developer, I want the store to hold a generic, namespaced record of values, so that I can add dynamic attributes and metadata at runtime without changing the store's type signature.
4. As a developer, I want the SDK to emit changes into the store through a subscription, so that external mutations (deeplinks, in-scene handles, rule-driven updates) are reflected in the UI without manual reconciliation.
5. As a developer, I want UI writes to flow through an intent that the adapter executes against the SDK, so that the store only updates once the SDK confirms the change (or rolls back on failure).
6. As a developer, I want a single `useConfigurator` hook exposing attributes and setters, so that I don't have to learn seven micro-hooks to read or write state.
7. As a developer, I want a single `usePlayer` hook exposing readiness and player handle, so that player lifecycle is clear at the call site.
8. As a developer, I want a single `useScene` hook exposing transform/query helpers, so that scene reads don't require `as unknown as` casts in feature code.
9. As a developer, I want the custom `ThreekitContextProvider` removed, so that there is no redundant indirection between components and the store.
10. As a user, I want undo and redo to move both the form controls and the 3D player together, so that undo means what I expect it to mean.
11. As a developer, I want undo/redo implemented as a command/inverse-command log, so that history replays through the adapter and cannot desync from the SDK.
12. As a developer, I want saved-configuration loading to run through TanStack Query with AbortSignal support, so that unmounting mid-load does not leak requests.
13. As a developer, I want saving a configuration to be a TanStack Query mutation, so that retries, error states, and pending states are handled by a standard primitive.
14. As a developer, I want to drop the `isProcessing` boolean from the store, so that async state is not duplicated between the store and the query cache.
15. As a developer, I want the store to be a vanilla Zustand store (not React-bound), so that I can consume it in tests, workers, or embed scripts without a React tree.
16. As a developer, I want SDK error paths (failed `evaluate`, rejected `setConfiguration`) to roll the store back to the last confirmed state, so that the UI never shows a value the player did not accept.
17. As a developer, I want the adapter to expose a typed `subscribe` channel, so that sync glue is explicit and testable by eye without reading SDK source.
18. As a developer, I want dynamic attribute values to flow through the store without type changes, so that adding a new configurator category does not require touching store typings.
19. As a developer, I want the scene/transform queries to return typed domain DTOs, so that consumers of `getTransform` / `getRotation` do not need to cast.
20. As a developer, I want the adapter, store, intent log, and sync glue to be four separate modules, so that each has a small surface that can be reasoned about independently.
21. As a developer refactoring incrementally, I want the adapter to land behind the existing hooks first, so that no behavior changes in the first step and I can verify parity before removing the Context wrapper.
22. As a developer, I want the intent log to record semantic operations (not raw state diffs), so that history entries are meaningful for debugging.
23. As a product owner, I want the refactor to preserve current functionality (attribute editing, undo/redo, saved config load), so that users see no regression during migration.

## Implementation Decisions

**Modules**

- **`ThreekitAdapter`** — the single boundary to `window.threekit.*`. Owns `setAttribute`, `getAttributes`, `applyConfiguration`, `getTransform`, `getRotation`, and a typed `subscribe(event, cb)` channel for SDK-originated changes. Maps SDK types to domain DTOs in both directions. Performs `setConfiguration` + `evaluate` as one atomic command with rollback on rejection. The only module in the repo allowed to import from `@threekit-tools/treble` (other than the bootstrap that mounts Treble's provider).
- **`ConfiguratorStore`** — vanilla Zustand store (kept as current dependency). Holds a generic, namespaced payload: `attributes` as `Record<string, AttributeValue>`, plus freely-extensible `ui`, `scene`, and `meta` namespaces for dynamic data. No SDK types. No `isProcessing` / `isLoaded` flags — async status is owned by TanStack Query. Exposed via plain hooks (`useStore(selector)`), not via a React Context.
- **`IntentLog`** — command/inverse-command history that powers undo/redo. Replaces the current zundo snapshot approach. Each entry is a pair `{ apply, invert }` of adapter commands. Undo/redo replays through the adapter so the store and SDK stay in lockstep. Pure logic module.
- **`ConfiguratorSync`** — glue that wires adapter events into store writes and store intents into adapter commands. Enforces one-way data flow (SDK is authoritative, store is a cache). Lives at the composition root; not exposed to feature code.

**React surface**

- Custom `ThreekitContextProvider` and its seven micro-hooks are removed.
- Three hooks replace them: `useConfigurator` (attributes + setters + undo/redo), `usePlayer` (ready status + player handle), `useScene` (transform/query helpers). Each is a thin wrapper around the vanilla store and adapter.
- Treble's own `ThreekitProvider` stays — it mounts the player and sets `window.threekit`; our refactor sits downstream of it.

**Async**

- `getSavedConfiguration` and save/export flows move to TanStack Query (already a dependency). AbortSignal is threaded from the query into adapter calls where applicable. The `isProcessing` flag is deleted.

**Data flow contract**

- UI never writes to the SDK directly. UI dispatches an intent on the store → `ConfiguratorSync` forwards it to `ThreekitAdapter` → adapter commits to SDK → SDK change event echoes back through the adapter's subscribe channel → store updates → UI re-renders.
- On SDK rejection, the intent is discarded and the store is not mutated; an error surface is exposed via the store's `meta` namespace or a Query error, depending on the operation.

**Type boundary**

- A new domain types module defines `AttributeValue`, `AttributeDescriptor`, `Transform`, etc. These are the only types visible to UI code. Adapter is responsible for translation in both directions; `as unknown as` casts are removed.

**Incremental migration order**

1. Introduce `ThreekitAdapter` behind the current hooks (no behavior change).
2. Replace SDK types in the store with domain DTOs; adapter does translation.
3. Delete the custom Context wrapper; replace seven micro-hooks with the three new ones.
4. Wire SDK change events through the adapter into the store (fixes external-mutation desync).
5. Move async ops to TanStack Query; delete `isProcessing`.
6. Replace zundo snapshot history with `IntentLog`-driven undo/redo.

Each step is independently shippable.

## Testing Decisions

Per product decision, **no additional tests** (unit or otherwise) are in scope for this refactor. Correctness will be verified by manual parity checks at each incremental step: attribute edits reflect in the player, undo/redo moves both the form and the player, saved-configuration load still populates attributes, and unmount-during-load does not throw.

If tests are added later, the natural seams are the adapter (mock `window.threekit`), the intent log (pure logic), and the sync glue (round-trip intent → SDK echo → store).

## Out of Scope

- Replacing Zustand with TanStack Store or any other store library.
- Rewriting Treble's own `ThreekitProvider` or the player mount path.
- Changes to credentials, env-var handling, or deployment configuration.
- New configurator features (new attribute types, new UI widgets, new save/share flows).
- Persisting the intent log across sessions.
- Server-side rendering concerns.
- Adding test infrastructure or test suites.
- Performance optimizations beyond what falls out of removing redundant renders caused by the Context wrapper.

## Further Notes

- Treble's `ThreekitProvider` must remain mounted because it owns player instantiation and the global `window.threekit` handle. The refactor sits entirely downstream of it.
- The SDK's event surface for change notifications needs to be verified against the installed Treble version before step 4. If a native event channel is not exposed, the adapter can fall back to polling `getDisplayAttributes()` on a debounced tick, but this should be treated as a short-term workaround and flagged in the adapter module.
- The `evaluate()` call currently used in `ThreekitContext` is a private API on `window.threekit.configurator`. The adapter should document this dependency explicitly so it is visible during future Treble upgrades.
- Dropping the `isProcessing` flag depends on TanStack Query being threaded through every async path that previously set it. Any call site that sets `isProcessing` outside of a query needs to be migrated in step 5, not earlier.
- The intent log replaces zundo; zundo can be removed from `package.json` at the end of step 6.
