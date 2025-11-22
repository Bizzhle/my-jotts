# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

## Showing all errors (lint + build) in the terminal

To surface both TypeScript (build/type) errors and ESLint errors in your terminal, this project includes two helper scripts in `package.json`:

- `npm run typecheck` — runs `tsc --noEmit` and prints TypeScript/type errors (these are the "build" errors).
- `npm run lint:ci` — runs ESLint in strict/CI mode and fails on warnings.
- `npm run check` — runs `typecheck` first, then `lint:ci` (so build/type errors appear first).

Examples (zsh):

```bash
# show type errors only
npm run typecheck

# show lint errors only
npm run lint:ci

# run both (typecheck then lint)
npm run check

# start dev after checks
npm run dev:checked
```

Notes:

- Enabling the type-aware ESLint rules (parserOptions.project) makes ESLint slower because it loads your TS project.
- If you want both checks to run in parallel and see outputs interleaved, install `concurrently` and use it in a custom script. Example:

```bash
# install
npm install --save-dev concurrently

# package.json script example
"check:parallel": "concurrently \"npm run typecheck\" \"npm run lint:ci\""
```

If you want CI to fail on either lint or typecheck, keep using `npm run check` which exits non-zero when either step fails.

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
