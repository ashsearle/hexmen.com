---
title: "Iterating over sparse arrays"
date: "2006-12-06T17:59:54.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2006/12/06/iterating-over-sparse-arrays"
---

This is a quick tip for iterating over arrays and other objects with a `length` property. It's particularly suitable for sparse arrays, without having to worry whether any methods have been added to the prototype chain.

Dean Edwards recently described a pretty cool technique for [enumerating javascript objects](http://dean.edwards.name/weblog/2006/07/enum/), but (currently) it's not appropriate for sparse arrays. In case you're unfamiliar with sparse arrays (or I'm using the wrong term), in the language of the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas#Examples), a sparse array is one that's not "dense". For example:

```js
// create a three-element array
var array = ["hope", "empire", "jedi"];
// add a fourth
array[987654321] = "menace";

// because array length is now 987654322
// this is a really inefficient way of iterating:
for (var i = 0; i < array.length; i++) {
  // ... do something ...
}
```

Iterating over this array using the `for` loop shown above would mean the loop is executed hundreds of millions of times. That's terribly inefficient for an array containing so few elements. A more efficient way is to use `for (property in object)`, with an `if` condition to filter out irrelevant properties:

```js
for (var property in object) {
  if (String(property >>> 0) == property && property >>> 0 != 0xffffffff) {
    // ... do something ...
  }
}
```

The `if` condition checks whether the property is an _array index_ as defined by the language specification:

> A property name P (in the form of a string value) is an array index if and only if ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal to 232−1

That's it.
