# Threekit Configurator Template

> by rkr (Ruslan Krasiuk)

A Vite-based React + TypeScript template for building Threekit product configurators as embeddable widgets.

---

Table of contents:

- [Threekit Configurator Template](#threekit-configurator-template)
    - [📦 Stack](#-stack)
    - [🚀 Quick start](#-quick-start)
    - [🤖 Commands](#-commands)
    - [🧶 Structure](#-structure)
        - [Core application structure](#core-application-structure)
        - [Configurator](#configurator)
        - [Threekit Context](#threekit-context)
        - [Services & API layer](#services--api-layer)
        - [Application configuration & utilities](#application-configuration--utilities)
        - [Global application files](#global-application-files)
            - [Build and output directories](#build-and-output-directories)
            - [Configuration files](#configuration-files)
            - [Linting and formatting configuration](#linting-and-formatting-configuration)
            - [Git and development configuration](#git-and-development-configuration)
            - [Editor and environment configurations](#editor-and-environment-configurations)
        - [Icons](#icons)
        - [Contexts](#contexts)
        - [Hooks](#hooks)
            - [Threekit hooks](#threekit-hooks)
            - [Query hooks](#query-hooks)
                - [Query Keys](#query-keys)
            - [Mutation hooks](#mutation-hooks)
        - [Utility functions](#utility-functions)
        - [Constants](#constants)
            - [Schemas](#schemas)
        - [Styles](#styles)
    - [✳️ Icons Usage](#️-icons-usage)
    - [🎮 Threekit Integration](#-threekit-integration)
        - [How it works](#how-it-works)
        - [Initialization flow](#initialization-flow)
        - [Saved configuration](#saved-configuration)
        - [Reading attributes reactively](#reading-attributes-reactively)
        - [Setting attributes](#setting-attributes)
        - [Undo / Redo](#undo--redo)
    - [🔨 Embed build](#-embed-build)
        - [Embedding in a client page](#embedding-in-a-client-page)
    - [Getting Started](#getting-started)

---

## 📦 Stack

- **[Vite](https://vitejs.dev)** - Lightning-fast build tool with HMR;
- **[React](https://react.dev)** - Core framework with compiler optimizations;
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development with strict mode;
- **[TanStack Query](https://tanstack.com/query/latest)** - Powerful async state management for REST API calls;
- **[TanStack Form](https://tanstack.com/form/latest)** - Type-safe form state management;
- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management for configurator attributes;
- **[Zundo](https://github.com/charkour/zundo)** - Undo/redo middleware for Zustand;
- **[`@threekit-tools/treble`](https://www.npmjs.com/package/@threekit-tools/treble)** - React provider and hooks for Threekit player initialization;
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first styling;
- **[Ky](https://github.com/sindresorhus/ky)** - Modern HTTP client;
- **[Zod](https://zod.dev)** - TypeScript-first schema validation;
- **[ESLint](https://eslint.org)**, **[Prettier](https://prettier.io)**, **[StyleLint](https://stylelint.io)**, **[Husky](https://typicode.github.io/husky)** - Code quality and formatting;

## 🚀 Quick start

1. Install [Node.js](https://nodejs.org);
    > Requires [Node.js](https://nodejs.org) version >=22
2. Install the NPM dependencies by running `npm ci`;
3. Create `.env.local` and add your Threekit credentials. Use `.env.local.example` as a reference;

## 🤖 Commands

- Runs the local dev server:
    ```
    npm run dev:vite
    ```
- Runs `tsc` CLI in watch mode:
    ```
    npm run dev:tsc
    ```
- Runs the local dev server and `tsc` together:
    ```
    npm run dev
    ```
- Runs the local dev server in scan mode and `tsc` together:
    ```
    npm run dev:scan
    ```
- Builds the SPA to `./dist/`:
    ```
    npm run build
    ```
- Builds the embed bundle to `./dist-embed/`:
    ```
    npm run build:embed
    ```
- Previews your build locally:
    ```
    npm run preview
    ```
- Runs `tsc` CLI:
    ```
    npm run tsc
    ```
- Checks your JavaScript/TypeScript for errors and warnings:
    ```
    npm run lint:eslint
    ```
- Checks your CSS for errors and warnings:
    ```
    npm run lint:stylelint
    ```
- Checks your code formatting:
    ```
    npm run lint:prettier
    ```
- Checks your code all together:
    ```
    npm run lint
    ```
- Fixes your code formatting:
    ```
    npm run fix:prettier
    ```
- Installs husky:
    ```
    npm run prepare
    ```

## 🧶 Structure

### Core application structure

- `src/components` - contains shared components with business logic. These are reusable components that may include some business logic. Each component should consist of:
    - `index.tsx` - the component file itself;
    - `styles.module.css` - styles of component file. This file is optional, since we use TailwindCSS;
    - `types.ts` - types of component file (optional);
    - `hooks` - contains component hooks dir (optional). Should consist of:
        - `<hookName>.ts` - the hook file itself;
    - `constants.ts` - constants of component file (optional);
    - `utils` - utils dir of component file (optional). Should consist of:
        - `<utilName>.ts` - the util file itself;
    - `schemas.ts` - schemas of component file (optional);
    - `regexps.ts` - regexps of component file (optional);
    - `context` - the context dir of component file (optional). Should consist of:
        - `<ContextName>.tsx` - the context file itself;
    - `components` - the components dir of components (optional). Should consist of like `src/components`;

- `src/components/ui` - contains basic UI components without business logic like button, input etc.

### Configurator

- `src/configurator` - the root of the Threekit configurator UI. Contains the top-level layout and all configurator-specific components:
    - `index.tsx` - root configurator component, composes `<Player />` and `<Form />`;
    - `Player/` - wraps the Threekit player div and handles portal mounting via `usePlayerPortal`;
    - `Form/` - the attribute form UI. Reads attributes reactively from Zustand store and dispatches changes via `useSetAttribute`;

### Threekit Context

- `src/context/ThreekitContext/` - global context that provides Threekit API methods to the entire app:
    - `index.tsx` - `ThreekitContextProvider` and `useThreekit` hook;
    - `types.ts` - `ThreekitContextValue` interface;
    - `hooks/` - granular hooks built on top of `useThreekit` and Zustand store:
        - `useAttribute.ts` - reactively reads a single attribute by name from the store;
        - `useAttributes.ts` - reactively reads all attributes from the store;
        - `useSetAttribute.ts` - returns the `setAttribute` method;
        - `useGetTranslation.ts` - returns the `getTranslation` method;
        - `useGetRotation.ts` - returns the `getRotation` method;
        - `usePlayerStatus.ts` - returns `{ isLoaded, isProcessing }`;
        - `useUndoRedo.ts` - returns `{ undo, redo }`;

### Services & API layer

- `src/services` - contains service layer for API calls and external integrations:
    - `threekit/` - Threekit-specific service layer:
        - `api.ts` - REST API calls to Threekit (e.g. `getSavedConfiguration`);
        - `store.ts` - Zustand store with zundo undo/redo for configurator attributes;
        - `queries.ts` - TanStack Query hooks for Threekit REST API;
        - `queryKeys.ts` - query key factories;
        - `types.ts` - Threekit attribute and configuration types;

### Application configuration & utilities

- `src/lib` - contains core application utilities and configurations:
    - `@http.ts` - Ky HTTP client instance;
    - `@queryClient.ts` - TanStack Query client configuration;
    - `constants.ts` - global application constants;
    - `types.ts` - global TypeScript type definitions;

### Global application files

- `src/hooks` - contains global hooks directory:
    - `useThreekitInit.ts` - handles post-load initialization: reads initial attributes or restores a saved configuration via `shortId` URL param;
- `src/context` - global React context providers:
    - `ThreekitContext/` - see [Threekit Context](#threekit-context);
- `src/styles` - contains global style files:
    - `index.css` - the main CSS file;
- `src/threekit.d.ts` - global type declarations for `window.threekitPlayer` and `window.threekit`;
- `src/vite-env.d.ts` - Vite environment type definitions. Update this file every time you add new environment variables;
- `src/embed.tsx` - single entry point for the embed bundle;
- `public/` - static files such as images, fonts, favicons, etc.;

#### Build and output directories

- `dist/` - SPA build output (generated after `npm run build`);
- `dist-embed/` - embed bundle output (generated after `npm run build:embed`). Contains a single `threekit-embed.js` file ready for embedding;

#### Configuration files

- `index.html` - HTML template for local dev. Includes the `#threekit-player` mount div;
- `vite.config.ts` - Vite configuration with dual build modes (SPA and embed IIFE);
- `tsconfig.json` - main TypeScript configuration;
- `tsconfig.app.json` - TypeScript configuration for application code;
- `tsconfig.node.json` - TypeScript configuration for Node.js (Vite config);
- `package.json` - project dependencies, scripts, and metadata;

#### Linting and formatting configuration

- `eslint.config.js` - ESLint configuration;
- `prettier.config.js` - Prettier configuration;
- `.prettierignore` - files ignored by Prettier;
- `.stylelintrc` - Stylelint configuration for CSS;

#### Git and development configuration

- `.gitignore` - Git ignore rules;
- `.gitattributes` - Git attributes for line endings;
- `.husky/` - Git hooks for pre-commit and commit-msg validation;
- `commitlint.config.cjs` - commit message linting configuration;

#### Editor and environment configurations

- `.editorconfig` - consistent coding style across editors;
- `.npmrc` - NPM configuration;
- `.env.local.example` - example environment variables file;
- `.env.local` - local environment variables (create manually, never commit);

### Icons

Icons should be located at `src/icons` folder.

Every icon should:

- Have lowercase name with kebab case formatting (example: `profile.svg` or `arrow-left.svg`)

Prerequisites:

- Compress exported SVG with [SVGOMG](https://jakearchibald.github.io/svgomg/) tool

### Contexts

Contexts are optional for the root of the project and components.

No matter where the contexts appear, they should:

- Have a separate `contexts` folder inside the folder where they will be used
    - Global contexts should be located at `src/context/` folder
    - If a context is used inside a single component exclusively, create a `contexts` folder inside the component folder

Each context should:

- Have a pascal case name ending with `Context` (example: `ThreekitContext`)
- The context file name should match the context name inside the file

### Hooks

Hooks are optional for the root of the project and components.

No matter where the hooks appear, they should:

- Have a separate `hooks` folder inside the folder where they will be used
    - Global hooks should be located at `src/hooks/` folder
    - Component-level hooks stay inside the component folder and must not be used outside it

Each hook should:

- Have a camel case name, starting with `use` (example: `useThreekitInit.ts`)
- The hook file name should match the hook name inside the file

#### Threekit hooks

The following hooks are available globally from `src/context/ThreekitContext/hooks/`:

| Hook                  | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `useAttribute(name)`  | Reactively reads a single attribute value from the store                |
| `useAttributes()`     | Reactively reads all attribute values from the store                    |
| `useSetAttribute()`   | Returns `setAttribute(name, value)` — optimistic update + Threekit sync |
| `useGetTranslation()` | Returns `getTranslation(nodeId)` — reads node translation from scene    |
| `useGetRotation()`    | Returns `getRotation(nodeId)` — reads node rotation from scene          |
| `usePlayerStatus()`   | Returns `{ isLoaded, isProcessing }`                                    |
| `useUndoRedo()`       | Returns `{ undo, redo }`                                                |

Or use `useThreekit()` to access all of the above at once:

```ts
const { isLoaded, isProcessing, setAttribute, getTranslation, undo, redo } = useThreekit();
```

#### Query hooks

Query hooks can receive parameters like pagination or search. Pass arguments as a list, not as an object.

```ts
export const useGetSavedConfiguration = (shortId: string) => {
    return useQuery({
        queryKey: THREEKIT_QUERY_KEYS.savedConfiguration(shortId),
        queryFn: () => getSavedConfiguration(shortId),
        enabled: !!shortId,
    });
};
```

##### Query Keys

```ts
// src/services/threekit/queryKeys.ts

export const THREEKIT_QUERY_KEYS = {
    all: ['threekit'] as const,
    savedConfiguration(shortId: string) {
        return [...THREEKIT_QUERY_KEYS.all, 'configuration', shortId] as const;
    },
};
```

#### Mutation hooks

```ts
// src/services/threekit/api.ts
export const saveConfiguration = (config: Record<string, unknown>) => {...}

// src/services/threekit/queries.ts
export const saveConfigurationMutationOptions = () => {
    return mutationOptions({
        mutationFn: saveConfiguration,
    });
};

// somewhere in a component
const { mutate: save } = useMutation(saveConfigurationMutationOptions());
save(currentConfig);
```

### Utility functions

Utility functions are optional for the root of the project and components.

No matter where the utils appear, they should:

- Have a separate `utils` folder inside the folder where they will be used
    - Global utils should be located at `src/utils/` folder
    - Component-level utils must not be used outside their component folder

### Constants

There are 2 types of constants:

- Regular constants (`constants.ts`)
- Schema constants (`schemas/` folder — Zod schemas used across the project)

### Styles

The global styles are located inside `src/styles`:

- `index.css` - root styles (imports other global style files)
- `reset.css` - browser style reset
- `variables.css` - global CSS custom properties (optional)
- `fonts.css` - `@font-face` declarations (optional)

---

## ✳️ Icons Usage

> **Note:** We use `vite-plugin-svgr` to handle icons. This ensures that SVGs are transformed into React components and bundled directly into the JavaScript file, which is essential for **cross-origin** compatibility in embed builds.

1. Place icons in `src/icons/` with kebab-case naming:

```
src/
└── icons/
    ├── arrow-left.svg
    ├── search.svg
    └── arrow-right-circle.svg
```

2. To use an icon, import it with the ?react suffix. This tells Vite to treat the SVG as a React component:

```ts
import ArrowLeftIcon from '@/icons/arrow-left.svg?react';
```

3. Use as JSX:

```tsx
<ArrowLeftIcon className={s.icon} />
```

---

## 🎮 Threekit Integration

### How it works

The template uses `@threekit-tools/treble` (`ThreekitProvider`) to initialize the Threekit player and load the `threekit-player.js` script from the Threekit CDN. On top of that, a custom `ThreekitContextProvider` exposes all API methods via React context and keeps attribute state in a Zustand store.

Provider hierarchy in `embed.tsx`:

```
QueryClientProvider
  └── ThreekitProvider          ← initializes window.threekit via Treble
        └── ThreekitContextProvider   ← exposes useThreekit() and Zustand store
              └── Configurator
                    ├── Player  ← mounts the Threekit player div
                    └── Form    ← reads/writes attributes
```

### Initialization flow

After the Threekit player loads (`useThreekitInitStatus` returns `true`), `useThreekitInit` runs automatically inside `<Player />`:

1. Checks for `?shortId=` in the URL;
2. If found — fetches the saved configuration and applies it to the player;
3. If not found — reads initial attributes directly from `window.threekit.configurator`;
4. Populates the Zustand store with the attributes;
5. Sets `isLoaded = true` so the form renders.

### Saved configuration

To open a saved configuration, append `?shortId=<id>` to the page URL:

```
https://your-client-site.com/product-page?shortId=EXIPiBA56
```

The template will automatically detect this, fetch the configuration from Threekit, apply it to the player, and populate the store.

### Reading attributes reactively

```tsx
import { useAttribute } from '@/context/ThreekitContext/hooks/useAttribute';

const ColorPicker = ({ attributeName }: { attributeName: string }) => {
    const attribute = useAttribute(attributeName);

    return (
        <div>
            {(attribute as any)?.values?.map((color: any) => (
                <button
                    key={color.assetId}
                    className={color.assetId === (attribute as any)?.value?.assetId ? 'active' : ''}
                />
            ))}
        </div>
    );
};
```

### Setting attributes

```tsx
import { useSetAttribute } from '@/context/ThreekitContext/hooks/useSetAttribute';

const ColorPicker = ({ attributeName }: { attributeName: string }) => {
    const setAttribute = useSetAttribute();

    const handleChange = (assetId: string) => {
        // Optimistically updates store, then syncs with Threekit
        setAttribute(attributeName, { assetId });
    };

    return <button onClick={() => handleChange('some-asset-id')} />;
};
```

### Undo / Redo

```tsx
import { useUndoRedo } from '@/context/ThreekitContext/hooks/useUndoRedo';

const Controls = () => {
    const { undo, redo } = useUndoRedo();

    return (
        <>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
        </>
    );
};
```

---

## 🔨 Embed build

The template supports two build modes controlled by the `BUILD_MODE` environment variable:

| Command               | Output                         | Format             | Use case                       |
| --------------------- | ------------------------------ | ------------------ | ------------------------------ |
| `npm run build`       | `dist/`                        | SPA                | Local dev / standalone hosting |
| `npm run build:embed` | `dist-embed/threekit-embed.js` | IIFE (single file) | Embedding in client pages      |

The embed build inlines all assets (images, fonts, SVGs) into a single JS file — no external requests needed from the host page.

### Embedding in a client page

Add a mount div and load the embed script on the client's page:

```html
<!-- Mount container -->
<div id="threekit-player" style="width: 100%; height: 600px;"></div>

<!-- Embed script (host it on your CDN or Threekit Launchpad) -->
<script src="https://your-cdn.com/threekit-embed.js"></script>
```

To open a saved configuration, append `?shortId=<id>` to the page URL.

---

## Getting Started

This is a [GitHub Template Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

### Via GitHub UI

Click **"Use this template"** → **"Create a new repository"** on the repository page.

### Via GitHub CLI

```bash
gh repo create <my-new-project> --template ruslan-krasiuk/threekit-rkr-template --clone
cd <my-new-project>
```

### Next steps

```bash
npm install
cp .env.local.example .env.local
# Add your Threekit credentials to .env.local
npm run dev
```

### Environment variables

| Variable                         | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| `VITE_TK_ENV`                    | Threekit environment: `preview` or `admin-fts` |
| `VITE_TK_PUBLIC_TOKEN`           | Public token for `preview` environment         |
| `VITE_TK_ASSET_ID`               | Asset ID for `preview` environment             |
| `VITE_TK_ORG_ID`                 | Org ID for `preview` environment               |
| `VITE_TK_ADMIN_FTS_PUBLIC_TOKEN` | Public token for `admin-fts` environment       |
| `VITE_TK_ADMIN_FTS_ASSET_ID`     | Asset ID for `admin-fts` environment           |
| `VITE_TK_ADMIN_FTS_ORG_ID`       | Org ID for `admin-fts` environment             |
