---
title: "Function.prototype.apply revisited"
date: "2006-12-26T18:50:46.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2006/12/26/revisiting-functionprototypeapply-for-ie5"
---

You can learn a lot about JavaScript by implementing your own version of `apply`. In this post I present my own implementation with explanatory notes to highlight hidden complexity:

```js
Function.prototype.apply = function (thisArg, argArray) {
  if (typeof this != "function") {
    throw new Error("apply called on incompatible " + "object (not a function)");
  }
  if (argArray != null && !(argArray instanceof Array) && typeof argArray.callee != "function") {
    throw new Error("The 2nd argument to apply must " + "be an array or arguments object");
  }
  thisArg = thisArg == null ? window : Object(thisArg);
  thisArg.__applyTemp__ = this;
  // youngpup's hack
  var parameters = [],
    length = (argArray || "").length >>> 0;
  for (var i = 0; i < length; i++) {
    parameters[i] = "argArray[" + i + "]";
  }
  var functionCall = "thisArg.__applyTemp__(" + parameters + ")";
  try {
    return eval(functionCall);
  } finally {
    try {
      delete thisArg.__applyTemp__;
    } catch (e) {
      /* ignore */
    }
  }
};
Function.prototype.call = function (thisArg) {
  return this.apply(thisArg, Array.prototype.slice.apply(arguments, [1]));
};
```

Download: [apply-call.js](/code/apply-call.js)

### Validating `apply`'s context and parameters

The ECMAScript specification says that `apply` may only be called on objects with a \[\[Call\]\] property (i.e. functions), and a `TypeError` should be thrown if an attempt is made to call it on non-function objects. The `typeof` operator allows us to identify functions easily: `typeof object` evaluates to `"function"` if and only if the object has a \[\[Call\]\] property.

The second parameter to `apply` is optional, but _if it's supplied_ it must be either an array or an arguments object - if not, a TypeError should be thrown. The expression `argArray != null` is deceptively simple, but exploits an interesting JavaScript fact: `object == null` evaluates to `true` if-and-only-if object is `null` _or `undefined`_ (so `object != null` evaluates to `true` for any value **except** `null` or `undefined`.)

Checking whether an object is an instance of an array is simply a matter of using the `instanceof` operator with the Array constructor `Array` (i.e. `object instanceof Array`.) To check whether something is an `arguments` object is a little more complicated as the ECMAScript specification does not define an `Arguments` class or function. We resort to a capability test: we check whether the object has a `callee` property that's a function (`typeof object.callee == "function"`.) I think this is a better test than checking for a numeric `length` property, as both `String` and `NodeList` have `length` properties defined, but neither of them are should be accepted when passed as the second argument to `apply`.

### Getting an appropriate object to use as `this`

If `thisArg` is `null` or `undefined`, the global-scope must be used as `this`. Since I'm writing this version of `apply` for use in a browser: the global-scope is the `window` object.

JavaScript's `typeof` operator allows you to differentiate several types of primitive value (booleans, numbers and strings) To turn primitive values into objects (as required by the specification of `apply`) we pass them through the `Object` function. From this point on, you should use `instanceof` instead of `typeof` to differentiate different types of object.

### Using functions as methods

The purpose of `apply` is to be able to assign a specific object as `this` for the duration of a function call. Without native browser-support, the only way to achieve this is to assign the function as a property of the object (thereby making the function a 'method' of the object.) Ideally we would generate and check for a non-existent property-name - but this cannot be achieved with 100% reliability on our main target browser (Internet Explorer 5) as there is no way of checking for the existence of a property (the specification defines `Object.prototype.hasOwnProperty` for this purpose; IE5 doesn't support it, and it cannot be implemented reliably.) Accepting the futility of the situation, we go with a 'good enough' implementation and hope that `__applyTemp__` isn't being used for any other purpose.

### Establishing how many parameters to pass

We've established that `argArray` is either `null`, `undefined`, an array or an arguments object, we now need to establish how many parameters need passing to the function call. The rather obtuse expression `(argArray || "").length >>> 0)` is dense code to meet the specification: no arguments (`0`) are passed if `argArray` is `null` or `undefined`, otherwise the `length` property is cast to an unsigned 32-bit integer, and the result is the number of parameters that will be passed (it's extremely unlikely that the result will be any different to using the `length` property as-is; but since it's trivial to do things properly, we do so.) A more simplistic and readable version of the code would read: `(argArray == null) ? 0 : argArray.length`

### Calling a function with an arbitrary number of parameters

If you google for implementations of `apply` you'll inevitably come across code derived from [youngpup's version](http://boring.youngpup.net/2002/oldblog123). I don't know if he created the hack, but it's the inspiration for my version, so credit where credit's due. The purpose of the hack is to pass a variable number of parameters to a function, without having to consider 1, 2, 3, 4 arguments (etc.) separately. The hack works by building a function-call as a string, then passing the string to `eval`. For example, to pass two parameters, this would be passed to `eval`: `"thisArg.__applyTemp__(argArray[0], argArray[1])"`

### Error handling and cleaning-up

Earlier on, we attached the function as a method of the object. To ensure this is a _temporary_ attachment, we have to remove the method once the function call has completed (using `delete`). We have to be careful though, as the function call may cause an error to be thrown, and we don't want to swallow or ignore this error. Fortunately, we can use the `try`/`finally` construct to run some clean-up code after the function call, regardless of whether the function-call ends in an exception or not.

Ideally, cleaning-up would simply be a matter of writing `delete object.property`; but in the world of Internet Explorer nothing is that simple. Errors can be thrown when you try to `delete` properties on host objects (a host object is an object supplied by the browser and accessible through JavaScript, but not defined in the ECMAScript specification. e.g. `ActiveXObject`.) As we don't imagine anyone will be interested in errors generated during clean-up, we wrap a simple `try`/`catch` around the clean-up code to swallow any errors generated here.

### Function.prototype.call

It's trivial to implement `call` in terms of `apply`. The first parameter to `call` becomes the first parameter to `apply`. The rest of the parameters are passed by applying `Array`'s `slice` method to the `arguments` object. This demonstrates our first useful application of `apply`: converting `arguments` objects to standard arrays.

### Conclusion

To implement `apply` we've had to understand `typeof`, functions, methods, `this`, `null`, the loose equality operator, global-scope, object properties, `try`/`catch`/`finally`, the `arguments` object, `eval`, primitive values and errors. This is a lot of ground to cover for such a short function, and I can't think of any other function that teaches you so much while writing it.
