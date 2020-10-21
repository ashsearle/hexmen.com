---
title: "PHP grievance number 1"
date: "2008-07-10T18:44:19.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "Most languages have an interpreter / compiler allowing you to make immediate use of function return values; but not PHP"
---

There's a lot to hate about PHP.

Maybe that's harsh: nothing's perfect, every language has it's strength and weaknesses, and noone ever suggested using PHP for _everything_.

Bearing that in mind, I'm using PHP _daily_, and you get used to a lot of quirks and foibles, and it's easy to forget how truly shit it is.

Take arrays for example. Please; please take 'em.

Skipping the "needle, haystack" parameter ordering farce, there are two things I dislike.

1.  array access warnings
2.  array access

First, the warnings.

The language designers must have made a choice between checked vs. unchecked array access: should this throw a warning, or shouldn't it:

```php
$titles = array("Philosopher's Stone", "Chamber of Secrets");
// accessing an element that doesn't exist:
$title = $titles[2];
```

They decided it should - it's just a "Notice"; easily hidden with appropriate `php.ini` settings. I can live with that; it's been a while, but doesn't Java throws a wobbly when you fall off the end of an array too?

My grievance is here, when you make a typo:

```php
$titles = array("Philosopher's Stone", "Chamber of Secrets");
$tiltes[2] = "Prisoner of Azkaban";
```

No errors, no warnings, no notices. Idiot-fingers just created a new array `$tiltes`, assigning a vitally important piece of information to a variable that shouldn't exist!

That's a bit stupid, isn't it? Bit of a design-decision inconsistency?

Onto array access: it would be nice - and when I say nice, I mean _obvious, natural and expected_ - to write:

```php
$head = $dom->get_elements_by_tagname('head')[0];
```

PHP's `getElementsByTagName` returns an `array`; we're expecting a single `<head>` element, so try to skip the bullshit and access it straight-off. But we can't, because PHP's compiler can't handle array-access on function return-values.

Object access? Sure, no problem. Calling a method of an object in an array inside another array is no problem:

```php
$book['chapter']['title']->display('html');
```

But if you want to access an array element returned from a function, choose a different language.
