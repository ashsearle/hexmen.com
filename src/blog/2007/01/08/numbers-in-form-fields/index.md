---
title: "Numbers in form-fields"
date: "2007-01-08T13:39:58.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2007/01/08/numbers-in-form-fields"
---

JavaScript is often used for client-side form validation to save unnecessary round-trips to the server. Unfortunately, lots of client-side validation relies on lenient JavaScript methods such as `parseInt`, allowing numbers to be input in ways totally unacceptable to your server-side code. Let's have a look at the problems and some solutions.

### Server-side validation

It's a golden-rule of web-development that you _never depend on client-side validation_. Users can turn JavaScript off, and hackers can send any data they like at your servers. So, the first thing you have to decide is what data is acceptable to your **server**. For numbers on the server, are you planning on storing them in a database or performing calculations with them? In either case, what format do the numbers need to be in: integers? decimals? Are you going to manually trim white-space from the number, are you going to allow negative numbers?

_(it's tempting to make the server-side validation anally-retentive, not accepting anything except a strict sequence of decimal numbers. I'd suggest that you at least accept (and remove) white-space around submitted numeric values. This will avoid frustrating JavaScript-disabled users in the case where a form-field has some trailing white-space in it - impossible to see, and annoying to find and remove after receiving an "invalid input" error.)_

### Client-side validation

Once you've decided on and coded-up your server-side validation, it's time to think about client-side validation. Remember, the point of client-side validation is to avoid unnecessary round-trips to the server. If you can determine that user-input on the client isn't going to be acceptable to the server, don't even bother sending it; instead, display informative and instructive messages to the user indicating which input you don't like, why, and what type of input you want from them.

We need an example to work with. I'm feeling unimaginative, so I'm going to use the stock order-form example. Let's suppose we have a quantity field that (for arbitrary business reasons) we will only accept with an integer from 0 - 100. One naïve approach to validation may be:

```js
var quantity = document.orderForm.quantity.value;
if (quantity < 0 || quantity > 100) {
  // inform user of invalid input
}
```

Remember, form-field values are always strings, so the code above is relying on automatic type-conversion from strings to numbers using the `<` and `>` operators. Unfortunately, if the user doesn't input anything (`quantity === ""`), this would be treated exactly the same as if they'd entered `0`; and the quantity would pass our input validation.

I just mentioned that the validation would pass for an empty-string; in fact, validation would pass for any input consisting solely of white-space. That's due to the JavaScript behaviour: `"\s*" < 0` is `false` and `"\s*" == 0` is `true` (where I've used `\s*` to mean 'optional white-space'.)

### Considering parseInt

So, we don't want white-space to be treated as `0`. Fortunately (for now), `parseInt` (and `parseFloat`) will return `NaN` for white-space input. We could try to improve our code like this:

```js
var quantity = parseInt(document.orderForm.quantity.value);
if (isNaN(quantity) || quantity < 0 || quantity > 100) {
  // inform user of invalid input
} else {
  // assume everything's hunky-dory?
}
```

But, oh dear lord, what a can-of-worms we've just opened: `parseInt` accepts numbers in octal and hexadecimal as well as base-10, and it's unlikely that we want to send octal or hexadecimal numbers to our server. The sensible thing to do would seem to be to specify that we want to parse base-10 numbers using `parseInt(quantity, 10)`.

This just makes things worse. Where we would have had `parseInt("0xFF")` returning `255` (and failing validation), we now have `parseInt("0xFF", 10)` returning 0 which passes our validation. In other words, our client-side code has passed and we're going to send the server "0xFF" as the quantity. Hopefully your server-side code would validate this and return an error, but it feels like a waste of a round-trip.

There are also problems with floating-point numbers and scientific notation. i.e. parseInt("2.34", 10) returns `2` as does parseInt("2e04", 10), but either of these inputs could cause problems on the server ("2e04" is scientific notation for `20000`, but `parseInt(x, 10)` stops parsing as soon as it reads a non-digit character.)

And then there's the just-plain-strange input: `parseInt("3 bikinis", 10)` returns `3`. What are you going to do with `"3 bikinis"` on the server? It's crazy-talk.

Clearly, `parseInt` is not enough on it's own.

### Regular Expressions

We're talking about a `quantity` field, where we want a non-negative integer. A simple-regular expression to check for a sequence of decimal digits is: `/\d+/`. That still doesn't help us avoid any trailing characters, so we need to pin it down using the `^` and `$` markers. Remembering that the user can't see white-space, we'll show some tolerance by allowing leading and trailing white-space round the character (usually, you'd _trim_ the field before validating, but I'm just adding some optional white-space to the regular-expression for now.)

```js
var quantity = document.orderForm.quantity.value;
if (!/^\\s*\\d+\\s*$/.test(quantity) || quantity < 0 || quantity > 100) {
  // inform user of invalid input
} else {
  // do something with quantity?
}
```

We're pretty happy that quantity has been entered in the right format, and we've used some implicit JavaScript type-conversion to check it's in the right range (0 - 100.) But surely if we want to do some calculations on it, then we're going to have to use `parseInt` or some other method of converting strings to numbers?

### Unary `+` for type-conversion

Forget `parseInt`. If you know that a variable only contains digits (optionally wrapped in white-space) you can convert it to a number using a single `+`. Let's assume we have a couple of hidden fields: unitPrice and shipping. We can assume these hidden fields contain numbers, and we know that the multiplication operator '`*`' will do automatic string-to-number conversion for us. But the binary '`+`' operator doesn't (i.e. `4 + "5"` equals `"45"` not `9`.) Here's unary `+` in action:

```js
var form = document.orderForm;
var quantity = form.quantity.value;
/* ...validation omitted... */
var subtotal = form.unitPrice.value * quantity;
var total = subtotal + +form.shipping.value;
```

I need to be explicit about octal numbers. Although `parseInt` will (by default) parse octal, hexadecimal and base-10; when it comes to operators, octal is ignored. In other words, `"0xff" == 255` is `true`, but `"010" == 8` is `false`. Similarly `+"0xff"` is `255` but `+"010"` is `10`.

Unary `+` has a lot going for it, and if you're using [prototype](http://prototype.conio.net/ "Prototype JavaScript Framework") this should appeal:

```js
var total = $F("unitPrice") * $F("quantity") + +$F("shipping");
```

_(though I'll never understand why they chose to use `$F` instead of `$V`. 'F' for field, 'V' for value, surely? But I digress)_

### Summary

I set-out to briefly demonstrate how nice and compact unary `+` is, but managed to get side-tracked once again. The original summary would have been "`+` rocks! `parseInt` sucks", but instead, we've got:

- Beware of white-space
- Know your number formats
- Unary `+`
- Use regular-expressions to check user-input matches a required format
- Show _some_ lenience

### Coming Soon...

The next two articles are very likely to touch on `getComputedStyle` and CSS's `!important` modifier. The first should be quite short (but I tend to waffle, so it'll probably end up long), and I need to work on some examples or illustrations for the second one. After that, I'm not sure. I've got some ridiculous code for creating PNGs in JavaScript, so I'll probably give that an outing at some point.

Thanks for reading.
