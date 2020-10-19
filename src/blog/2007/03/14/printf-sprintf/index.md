---
title: "sprintf for JavaScript"
date: "2007-03-14T15:59:09.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2007/03/14/printf-sprintf"
---

Avoid writing formatting functions in JavaScript by grabbing yourself a decent sprintf implementation - handling padding, truncation, floating-point numbers, left/right alignment and _re-ordered arguments_.

You can [download sprintf for JavaScript](http://hexmen.com/js/sprintf.js), available under the [Create Commons Attribution License](http://creativecommons.org/licenses/by/2.5/). Now license free (use it where/when/how you like.)

The version I've written is based strongly on [Perl's sprintf implementation](http://perldoc.perl.org/functions/sprintf.html), allowing argument reordering to help with internationalisation (i18n). Some overly simplistic examples follow, leaving room for obvious improvements like:

1.  letting the user specify their locale as a preference
2.  set default locale based on visitor demographics
3.  use locale-specific message-bundles with a fall-back to the default locale

On with the examples:

    var locale = 'es';
    var messages = {
        'en': 'I am %d years and %d months old.',
        'es': 'Tengo %2$d meses y %1$d años.'
    };
    var message = sprintf(messages[locale], 31, 7);

You could also use it for

    var date = new Date;
    var dateFormats = [
        /* ISO-8601: */ '%04d-%02d-%02d %02d:%02d:%02d',
        /* British:  */ '%3$02d/%2$02d/%1$02d',
        /* U.S.:     */ '%2$02d/%3$02d/%1$02d'
    ];
    // for example only: choose random date format
    var dateFormat = dateFormats[3 * Math.random() >>> 0];
    var formatted = sprintf(dateFormat,
        date.getFullYear(), date.getMonth() + 1, date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds());
    alert(formatted);

The Perl documentation has more examples in the "[order of arguments section](http://perldoc.perl.org/functions/sprintf.html#order-of-arguments)". Note: this implementation allows the precision of a number to be set from a specific argument (using e.g. "%.\*3\$f"), which the perldocs (`perldoc -f sprintf`) say hasn't been implemented yet.

I haven't (re)written any documentation for it, but you should be able to use Firebug (or the `javascript:` protocol) to try out `sprintf` on this page, and you can also check out the [test page for sprintf](/tests/sprintf.html) for more input/output samples.

As usual, writing test-cases uncovered a couple of browser-dependent issues. Safari has some bizarre behaviour with [`Maths.abs(0).toFixed(6)`](<javascript:alert(Math.abs(0).toFixed(6))>) resulting in `"0.0000-0"` instead of `"0.000000"`. Another issue I came across is that [`0.5` rounds to `0` or `1` depending on browser](<javascript:alert((0.5).toFixed())>) (worded differently: numbers are rounded off inconsistently across browsers.)

### Dependencies

On modern browsers, there are no dependencies. But to run `sprintf` on older browsers you'll need to patch the `Number` and `String` objects. `Number` needs `toFixed`, `toExponential` and `toPrecision` methods, while `String` needs a `replace` method capable of using functions in the replacement parameter.
