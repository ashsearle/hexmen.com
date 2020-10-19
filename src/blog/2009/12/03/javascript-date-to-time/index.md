---
title: "JavaScript Date to Time"
date: "2009-12-03T11:29:14.000Z"
modified: "2013-04-13T16:38:27.000Z"
folder: "2009/12/03/javascript-date-to-time"
---

Subtle differences sometimes indicate the proficiency of a programmer.

Here are three ways to get the current time in JavaScript:

    var t1 = (new Date()).getTime(); // 1
    var t2 = new Date().getTime(); // 2
    var t3 = (new Date).getTime(); // 3

The bracket placement is as much about language awareness as personal taste. In JavaScript, the brackets are optional for a zero-argument constructor: `new Date` creates a new `Date` instance without requiring brackets. But due to JavaScript operator precedence, you can't write `new Date.getTime()` because the interpreter sees that as trying to call the constructor for a `Date.getTime` class (cf. `MyPackage.MyClass`) - in this case the brackets are required for the statement to parse as intended.

Reflecting on the three versions above: Version 1 doesn't do anything to show a deep understanding of JavaScript. Version 2 and 3 are sort of interchangeable, but version 3 just edges ahead because the coder's displayed knowledge to drop the optional brackets.

Of course, if you want the most compact code possible, you'd write:

    var t4 = +new Date; // 4

This little gem creates a new Date, then coerces it into a number using a unary `+` operator - and coercing a Date to a number is defined in the language spec to go via `valueOf` and `getTime`.

Checking the character-count: `(new Date).getTime()` is 20 characters, while `+new Date` is 9.

That 11 character saving might come in handy on, say, the new Google home-page, where they currently use `(new Date).getTime()` _seven times_.
