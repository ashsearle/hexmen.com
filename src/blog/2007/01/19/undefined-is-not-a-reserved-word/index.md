---
title: "undefined is not a reserved word"
date: "2007-01-19T21:31:33.000Z"
modified: "2020-10-21T16:48:35+0100"
blurb: "Accidents happen; if you can choose whether to compare against null or undefined, choose null"
---

With the new release of Prototype (1.5.0) comes a new website for the [Prototype JavaScript Library](http://prototypejs.org/). The home-page of the new website features a snippet of JavaScript:

```js
cells: function (row) {
  if (row == undefined) return this.something;
  return $(row).getElementsBySelector(/* something */);
},
```

Let's get this straight: `undefined` is not a reserved word. It's safer and more logical to make the comparison to `null`:

```js
cells: function (row) {
  if (row == null) return this.something;
  return $(row).getElementsBySelector(/* something */);
},
```

As `null` **is** a reserved word (and it's quicker to type) I'd expect the Prototype community to favour it.

_Note: assuming `undefined` hasn't been redefined, the two code fragments are functionally identical. i.e. the equals operator (`==`) treats `null` and the primitive value `undefined` exactly the same._

**Update:** JavaScript has changed since this post was written: you cannot overwrite the `undefined` value in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), nor in [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (as modules run in strict mode by default.)
