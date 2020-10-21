---
title: "Array push and pop: a complete embarrassment for JavaScript"
date: "2006-12-06T13:00:49.000Z"
modified: "2011-01-03T17:21:36.000Z"
blurb: "An exploration of some edge cases manipulating arrays in JavaScript"
---

Most JavaScript libraries include trivial implementations of Array's `push` and `pop` methods to provide support for older browsers. However, literally _every_ library's implementation is flawed. While this is bad enough, I've also found that _every browser's implementation of push and pop contains bugs_. These vary from browser to browser: Internet Explorer's methods can't be reused; Safari has type-conversion issues; and Firefox & Opera don't truncate Arrays properly.

It's been seven years since the publication of the [official ECMAScript Language Specification](http://www.ecma-international.org/publications/standards/Ecma-262.htm), and I think we should expect a little more from our browsers. In this article, I've documented the current problems, and I show how to write library implementations conforming precisely to the language spec'.

### JavaScript Implementation

Here are my functions (the `>>>` operator is explained later in the article):

```js
Array.prototype.push = function () {
  var n = this.length >>> 0;
  for (var i = 0; i < arguments.length; i++) {
    this[n] = arguments[i];
    n = (n + 1) >>> 0;
  }
  this.length = n;
  return n;
};
Array.prototype.pop = function () {
  var n = this.length >>> 0,
    value;
  if (n) {
    value = this[--n];
    delete this[n];
  }
  this.length = n;
  return value;
};
```

Download: [push-pop.js](https://hexmen.com/code/push-pop.js)

### Testing

Always up for a challenge, I've tried to produce a bug-free implementation that conforms to the specification. You can see how it fares on my [push and pop test page](https://hexmen.com/tests/pushpop.html). The test page allows you to compare several library implementations to the browser's built-in implementation, and mine. There are about thirty tests in all, and you should find that even the browser's implementations fail a couple of tests (some fail substantially more.)

So, why the high failure rate? Simple: most browsers haven't implemented arrays correctly; their understanding of an _array index_ and `length` is wrong. From the specification (section 15.4):

> A property name _P_ (in the form of a string value) is an _array index_ if and only if ToString(ToUint32(P)) is equal to P and ToUint32(_P_) is not equal to 2<sup>32</sup>−1. Every Array object has a `length` property whose value is always a non-negative integer less than 2<sup>32</sup>. The value of the `length` property is numerically greater than the name of every property whose name is an array index; whenever a property of an Array object is created or changed, other properties are adjusted as necessary to maintain this invariant. Specifically, whenever a property is added whose name is an array index, the `length` property is changed, if necessary, to be one more than the numeric value of that array index; and whenever the `length` property is changed, every property whose name is an array index whose value is not smaller than the new length is automatically deleted. This constraint applies only to properties of the Array object itself and is unaffected by `length` or array index properties that may be inherited from its prototype.

In simplified terms: array indexes are integers in the range \[0, 2<sup>32</sup>\-2\], and the array `length` can take any integer value in the range \[0, 2<sup>32</sup>\-1\] (both ranges start at 0, but end at different values.) The `length` of an array is greater than any set _array index_; if the `length` is set explicitly, all array indexes ≥ `length` are deleted.

### Bugs

- setting an array `length` to a non-integer value, a negative value, or an integer ≥ 2<sup>32</sup> should cause an error to be thrown. Firefox is the only browser to get this right - Safari, Opera and Internet Explorer all fail this test (I called this test, unimaginatively, `testArrayLength`)
- truncating an array doesn't always cause the right array values to be deleted in Firefox (`testArrayTruncation`)
- `length` is updated incorrectly in certain circumstances in Firefox, Safari and Opera (`testArrayLengthMagic`)

Now we've established that every browser has at least one problem with arrays, let's look at the specification of push:

> **15.4.4.7 Array.prototype.push ( \[ item1 \[ , item2 \[ , … \] \] \] )** The arguments are appended to the end of the array, in the order in which they appear. The new length of the array is returned as the result of the call.
>
> When the **push** method is called with zero or more arguments _item1, item2_, etc., the following steps are taken:
>
> 1.  Call the \[\[Get\]\] method of this object with argument `"length"`.
> 2.  Let _n_ be the result of calling ToUint32(Result(1)).
> 3.  Get the next argument in the argument list; if there are no more arguments, go to step 7.
> 4.  Call the \[\[Put\]\] method of this object with arguments ToString(_n_) and Result(3).
> 5.  Increase _n_ by 1.
> 6.  Go to step 3.
> 7.  Call the \[\[Put\]\] method of this object with arguments **"length"** and _n_.
> 8.  Return _n_.
>
> The length property of the push method is 1.
>
> _NOTE_ _The `push` function is intentionally generic; it does not require that its **this** value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method. Whether the `push` function can be applied successfully to a host object is implementation-dependent._

And the specification for `pop`:

> **15.4.4.6 Array.prototype.pop ( )** The last element of the array is removed from the array and returned.
>
> 1.  Call the \[\[Get\]\] method of this object with argument `"length"`.
> 2.  Call ToUint32(Result(1)).
> 3.  If Result(2) is not zero, go to step 6.
> 4.  Call the \[\[Put\]\] method of this object with arguments `"length"` and Result(2).
> 5.  Return `**undefined**`.
> 6.  Call ToString(Result(2)-1).
> 7.  Call the \[\[Get\]\] method of this object with argument Result(6).
> 8.  Call the \[\[Delete\]\] method of this object with argument Result(6).
> 9.  Call the \[\[Put\]\] method of this object with arguments `"length"` and (Result(2)-1).
> 10. Return Result(7).
>
> _NOTE_ _The `pop` function is intentionally generic; it does not require that its **this** value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method. Whether the `pop` function can be applied successfully to a host object is implementation-dependent._

The notes in both specifications are very important - they mean that each method must be portable, able to work in isolation - no dependence on other Array methods or properties. Implementation should not rely on side-effects of manipulating a `length` property, nor should they use other array methods like `splice`.

It's this requirement for independence that causes Internet Explorer to fail a whole slew of tests, and puts it at the back of the pack in terms of standards compliance.

### The `>>>` operator

Working through the `push` and `pop` specifications, both methods need to use type-conversion to convert arbitrary (possibly undefined) objects to unsigned 32-bit integers. This can be done using the unsigned right-shift operator (`>>>`), and this reveals another - trivial - bug: IE5 and Safari fail to ignore particular white-space characters when converting strings to unsigned 32-bit integers. It's a minor bug, and I hope Safari can be easily fixed by the [WebKit](https://webkit.org/) guys - Microsoft fixed this particular Internet Explorer bug when they released IE5.5. (`testToUint32`)

Steps 3 - 6 of `push` are a little ambiguous, and the specification probably should have stated that repeated increments to `n` must be done using 32-bit unsigned integer arithmetic - it's kind-of implicit as `n` is assigned the result of the internal ToUint32 operator. Using 32-bit arithmetic leads to some strange edge-cases: when `n` overflows from 2<sup>32</sup>\-1 to 0, `push` will have set a property called `4294967295`. This is strange, as `429496795` is _not_ an _array index_ (as discussed above), but at least it means the property-value will still be available after the inevitable array-truncation (when `length` is set to some small value in step 8.)

Although the specification leaves room for the occasional bit of ambiguity, and prescribes some strange behaviour as a consequence, I think it's well put together. On-screen, it's not so easy to work with, but Mozilla have produced an [improved PDF](https://www-archive.mozilla.org/js/language/E262-3.pdf "Mozilla's improved ECMAScript Language Specification PDF") which includes lots of bookmarks to help navigate through the document.
