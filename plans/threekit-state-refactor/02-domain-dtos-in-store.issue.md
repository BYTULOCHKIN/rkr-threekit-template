## What to build

Replace the SDK types currently stored in the configurator store with app-owned domain DTOs. A new domain types module defines `AttributeValue`, `AttributeDescriptor`, `Transform`, and any other shapes UI code needs. The adapter becomes responsible for translating between SDK types (`IThreekitDisplayAttribute` et al.) and domain DTOs in both directions. UI code stops referencing `@threekit-tools/treble` types entirely.

The store shape also becomes generic and namespaced: `attributes` is a `Record<string, AttributeValue>`, and new `ui`, `scene`, and `meta` namespaces accept arbitrary dynamic data without requiring type changes.

## Acceptance criteria

- [ ] A domain types module defines the app's own attribute, transform, and metadata shapes.
- [ ] The store no longer references any type imported from `@threekit-tools/treble`.
- [ ] Store attribute state is keyed as `Record<string, AttributeValue>` rather than an ordered array of SDK objects.
- [ ] `ui`, `scene`, and `meta` namespaces exist on the store and accept arbitrary values without type changes.
- [ ] The adapter translates SDK → domain DTOs on reads and domain → SDK on writes.
- [ ] All UI consumers compile against domain types only.
- [ ] Configurator behavior is unchanged (manual parity check).

## Blocked by

- Blocked by #01-introduce-threekit-adapter
