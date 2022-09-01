---
title: "Running .tsx from the command-line"
blurb: "A few setup steps to help write and run .tsx from the command-line"
date: "2020-11-30T15:24:33.495Z"
modified: "2020-11-30T18:39:57.962Z"
---

I know how to [run a `.jsx` file using `babel-node`](../run-jsx-from-command-line/), but now want to add TypeScript to the mix.

Here's a starter `index.tsx` file I'm going to use to generate HTML from the command-line.

```js
// Use import statements:
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Use JSX (with a TypeScript annotation)
const App: React.FunctionComponent = () => <div>The app</div>;

// Use an API only available in node (and some more JSX):
process.stdout.write(renderToStaticMarkup(<App />));
```

First I install the dependencies used in `import` statements (and note that `yarn` will generate a `package.json` as a side-effect if it doesn't already exist):

```bash
yarn add react react-dom
```

If I try using `node index.tsx` to run the script, I'll get an error (because of the `import`):

    (node:73369) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
    (Use `node --trace-warnings ...` to show where the warning was created)
    /.../index.tsx:1
    import * as React from 'react';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

After renaming the file to `index.mjs` and running `node index.mjs` we can get a different error (because of the TypeScript annotation):

    file:///.../index.mjs:6
    const App: React.FunctionComponent = () => <div>The app</div>;
          ^^^

          SyntaxError: Missing initializer in const declaration

Reverting the file name to `index.tsx`, adding `"type": "module"` to `package.json` and re-running with `node index.tsx` gives a different error:

    internal/process/esm_loader.js:74
        internalBinding('errors').triggerUncaughtException(
                                  ^

    TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".tsx" for /.../index.tsx

This isn't getting me anywhere, so it's time to look for at alternative approaches:

1. Use [`ts-node`](https://github.com/TypeStrong/ts-node)
2. Use `babel-node`

## Setup ts-node

```bash
# Install all libs needed to run ts-node on a file containing TypeScript + TSX:
yarn add -D ts-node typescript
```

Create a TypeScript config file (`tsconfig.json`) to tell TypeScript how to treat the `import` statements and JSX:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "jsx": "react",
    "esModuleInterop": true
  }
}
```

Run with `npx ts-node index.tsx` and we get an error:

    ⨯ Unable to compile TypeScript:
    index.tsx:6:1 - error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.

We're using `yarn`, so do `yarn add -D @types/node` to install the type definitions required for TypeScript to validate how we use the `process` global. After installing, we re-run with `npx ts-node index.tsx` again and see:

```html
<div>The app</div>
```

It's working. Great.

## Setup babel-node

After noticing babel has a TypeScript preset, I thought I'd give that a go too.

Create `babel.config.json`:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
}
```

Install everything we need to run `babel-node` with that config:

```bash
yarn add -D @babel/core @babel/node @babel/preset-env @babel/preset-react @babel/preset-typescript
```

Run our script with `npx babel-node index.jsx`, and ... there's an error:

    (node:75993) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
    (Use `node --trace-warnings ...` to show where the warning was created)
    /.../index.tsx:2
    import * as React from "react";
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

It might not be crystal clear from the error message, but the problem here is babel's not transpiling my `.tsx` file at all. I need to rerun with additional command-line options: `npx babel-node -x '.tsx' index.tsx` - which results in:

```html
<div>The app</div>
```

Great: that's a second option: transipling and running a `.tsx` file using `babel-node`, without having to create `tsconfig.json`, rename our files as `.mjs` or update `package.json` to add `"type": "module"`.

## esbuild

I'm happy to use `ts-node` and `babel-node` to run random `.tsx` files and avoid the overhead of configuring a bundler. However, [`esbuild`](https://esbuild.github.io/) is a slightly different beast: it's blazing fast, and I don't think I'll have to configure anything to make it run TypeScript files.

Install with `yarn`:

```bash
yarn add -D esbuild
```

Iterate our way towards bundling transpiled code appropriate to pipe into `node`:

```bash
esbuild index.tsx | node -
```

This transpiles the JSX, but leaves the `import` statements in, presenting a problem when piped into `node`:

    [stdin]:1
    import * as React from "react";
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

To flatten the imports, we'll bundle the code

```bash
esbuild index.tsx --bundle | node -
```

     > node_modules/react/index.js: warning: Define "process.env.NODE_ENV" when bundling for the browser
         3 │ if (process.env.NODE_ENV === 'production') {
           ╵     ~~~~~~~~~~~~~~~~~~~~

That's a good error message; we should bundle for node:

```bash
npx esbuild index.tsx --bundle --platform=node | node -
```

Output:

```html
<div>The app</div>
```

Excellent. That was an easy fix.

I'm aware I may want to run the development React build (with warnings) during development, and production builds for speed or if I want to ignore warnings for some reason. For completeness I want to note two ways to do this:

```bash
# 1. Use `esbuild --define`
npx esbuild index.tsx --bundle --define:process.env.NODE_ENV=\"production\" | node -
# 2. Set NODE_ENV environment variable for node:
npx esbuild index.tsx --bundle --platform=node | NODE_ENV=production node -
```

## TypeScript is ignored

I had to make several attempts before stumbling on the right combination of options in `tsconfig.json` to make `ts-node` work, and wonder if there's a reason it's so much easier to setup `babel-node` and `esbuild`.

It turns out there is: `@babel/preset-typescript` and `esbuild` don't do any type-checking; they simply ignore the TypeScript annotations.

Here's a proof of the problem: `invalid-typings.ts`:

```js
const myVariable: invalidType = 3;
console.log({ myVariable });
```

When run with `ts-node`, `babel-node` and `esbuild`, only `ts-node` shows the appropriate error:

    invalid-typings.ts:1:19 - error TS2304: Cannot find name 'invalidType'.

    1 const myVariable: invalidType = 3;
                        ~~~~~~~~~~~

This is a signifcant difference, and important not to overlook when deciding which method to adopt to run TypeScript.

## Using swc transpiler with ts-node

Attempting to run without installing react packages first doesn't work:
```bash
npx --package=react --package=react-dom --package=@swc/core --package=ts-node -c 'ts-node --swc --compilerOptions {\"jsx\":\"react\"} index.tsx'
```

But assuming we have `index.tsx` and install react packages as usual, we can run use ts-node without installing typescript to run the script using the swc transpiler:
```bash
yarn init -y
yarn add react react-dom
npx --package=@swc/core --package=ts-node -c 'ts-node --swc --compilerOptions {\"jsx\":\"react\"} index.tsx'
# Alternative syntax:
npx --package=@swc/core --package=ts-node ts-node --swc --compilerOptions '{"jsx":"react"}' index.tsx
```
```bash
cd $(mktemp -d)
yarn init -y
yarn add react react-dom ts-node @swc/core
# Theoretically we shouldn't have to install typescript, but we still do:
yarn --silent ts-node --swc index.tsx
# → Error: Cannot find module 'typescript'
yarn add typescript
yarn --silent ts-node --swc index.tsx
```
