---
title: "Running .jsx from the command-line"
blurb: "A few setup steps to help write and run .jsx from the command-line"
date: "2020-11-30T10:28:48.004Z"
---

Here's a simplified root `.jsx` file I'd like to run to generate some HTML from the command-line.

index.jsx:

```js
// Use import statements:
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Use JSX
const App = () => <div>The app</div>;

// Use an API only available in node (and some more JSX):
process.stdout.write(renderToStaticMarkup(<App />));
```

I'll use `yarn` to install those imported libs, which has the side-effect of creating a `package.json` file:

```bash
yarn add react react-dom
```

I want to run `index.jsx` directly, without having to transpile then execute as two separate steps. The script doesn't look particularly special, but does use `import` and JSX, two features that cause problems as I'm not using a bundler.

Executing `node index.jsx` gives this error (caused by the `import` statements):

    (node:58928) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

I try creating a `package.json` and setting `"type": "module"`, and re-run `node index.jsx` to get a different error (caused by file extension):

    TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".jsx" for /...

Renaming `index.jsx` to `index.js` and executing with `node index.js` gives a different error:

    const App = () => <div>The app</div>;
                      ^
    SyntaxError: Unexpected token '<'

(I get the same error if I try changing the file extension to `.mjs` and running `node index.mjs`)

At this point it feels like I've hit a brick wall with `node`, so need to look at alternative solutions.

Before going any further I need to revert my changes: restoring the original filename of `index.jsx`, and removing the `"type": "module"` property from `package.json`.

## Setup babel-node

I want to transpile-and-run in one step, which is exactly what [`babel-node`](https://babeljs.io/docs/en/babel-node) is designed for.

```bash
# Install all libs needed to run babel-node on a file containing JSX:
yarn add -D @babel/core @babel/node @babel/preset-env @babel/preset-react
```

Create a `babel.config.json` file:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Use `npx babel-node index.jsx` to run, and we can see the output:

```html
<div>The app</div>
```

That's it; it's working! We can now iterate and experiment to our heart's content.
