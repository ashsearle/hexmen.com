#!/usr/bin/env node

/*
We grabbed old WordPress blog content using curl, loaded in jsdom, extracted
article HTML from the .entry-content element and converted to markdown using
the turndown library.

Unfortunately, we lost a bunch of paragraph breaks while doing this.

Fortunately, they left a sign in the markdown: double-trailing-space at the end of a line
*/
const fsPromises = require("fs").promises;

// Usage from shell prompt:
// ./scripts/restore-newlines.js $(find src/blog -name index.md -print)
const files = Array.from(process.argv).slice(2);
files.reduce(
  (chain, file) =>
    chain.then(() =>
      fsPromises.readFile(file, "utf8").then((raw) => {
        const restored = raw.replace(/  $/gm, "\n");
        if (raw !== restored) {
          console.log(`Restoring paragraph breaks in ${file}`);
          return fsPromises.writeFile(file, restored, "utf8");
        }
        return Promise.resolve();
      })
    ),
  Promise.resolve()
);
