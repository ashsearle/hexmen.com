---
title: "The importance of being !important"
date: "2007-01-18T20:00:43.000Z"
modified: "2011-01-03T17:21:36.000Z"
blurb: "This article describes a way to think about and rank !important properties as part of standard CSS specficity"
---

There are plenty of good articles describing how CSS specificity is calculated for normal rule-sets, but the `!important` modifier is often ignored or overlooked. However, with a little manipulation, `!important` can simply be treated as one more factor in the specificity calculation.

To see how this works, consider this rule-set:

```css
p.error {
  height: 23px;
  color: red !important;
  background: black !important;
  border: 1px solid red;
  white-space: pre;
}
```

Separating the `!important` properties from the rest gives:

```css
p.error {
  color: red !important;
  background: black !important;
}
p.error {
  height: 23px;
  border: 1px solid red;
  white-space: pre;
}
```

Both rule-sets have the same selector, and therefore the same specificity; but I think it helps to consider the `!important` rule-set as having a higher specificity. We can do this by treating `!important` as part of the selector.

### Faux Selectors

Let's move the `!important` modifier outside the brackets:

```css
p.error !important {
  color: red;
  background: black;
}
p.error {
  height: 23px;
  border: 1px solid red;
  white-space: pre;
}
```

_Note: although "`p.error !important`" isn't a valid selector, I hope the intent is clear._

Using the CSS 2.1 [definition of specificity](https://www.w3.org/TR/CSS21/cascade.html#specificity), an inline-style would have the highest specificity (`1,0,0,0`), while `p.error` has a specificity of `0,0,1,1` (in order: `0` for not being inline, `0` IDs, 1 class, 1 element name.) But, `!important` rules override inline-styles, and `!important` inline-styles override everything; so wouldn't it make sense to give `!important` rulesets a higher specificity?

Here's the instruction used to calculate the first number in the specificity of a selector:

> count 1 if the declaration is from is a 'style' attribute rather than a rule with a selector, 0 otherwise (= a) (In HTML, values of an element's "style" attribute are style sheet rules. These rules have no selectors, so a=1, b=0, c=0, and d=0.)

I suggest modifying that to: _count 1 if the declaration is from a 'style' attribute, 0 otherwise. Add 2 if it's `!important` (= a)_.

Effectively, all we do for `!important` rulesets is to add `2,0,0,0` to the normal specificity.

### Summary

By considering `!important` properties as belonging to a ruleset of their own, we can list four levels of specificity. In decreasing order of importance, these are:

1.  `!important` inline-styles (`3,0,0,0`)
2.  `!important` rulesets (`2,b,c,d`)
3.  standard inline-styles (`1,0,0,0`)
4.  standard rulesets (`0,b,c,d`)

As you can see, `!important` rulesets still compete over the b, c and d of specificity, and that's where the difficulties usually lie.
