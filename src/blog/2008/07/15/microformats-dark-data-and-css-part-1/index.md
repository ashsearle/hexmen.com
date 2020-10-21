---
title: "Microformats, dark data and CSS - part 1"
date: "2008-07-15T12:53:22.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "A quick recap of microformats and the HTML attributes originally abused to implement them"
---

There was a bit of kerfuffle when the [BBC dropped support for microformats](https://www.bbc.co.uk/blogs/radiolabs/2008/06/removing_microformats_from_bbc.shtml) in their program listings.

You can't argue with their reasons: data for [microformats](http://microformats.org/) was being read aloud by screen-readers, popping up as tool-tips, and confusing the hell out of their users.

The microformats community rallied to solve the issue, but [Auntie Beeb rejected all their proposals](https://www.bbc.co.uk/blogs/bbcinternet/2008/07/why_the_bbc_removed_microforma.html); and due to lack of community support, also back-tracked on their own proposal (inserting `data-` prefixed values into the `class` attribute.)

You can't blame them for rejecting the microformats community's proposals. This proposal feels particularly torturous:

```html
<p>
  To be held on
  <span class="dtstart dtend">
    <abbr class="value" title="1998-03-12">12 March 1998</abbr>
  </span>
  from
  <span class="dtstart">
    <abbr class="value" title="08:30">8:30am</abbr>
    <abbr class="value" title="-0500">EST</abbr>
  </span>
  until
  <span class="dtend">
    <abbr class="value" title="09:30">9:30am</abbr>
    <abbr class="value" title="-0500">EST</abbr>
  </span>
</p>
```

That suggestion seems to be the result of a [30 minute brain-fart by microformat's spiritual leader](http://rbach.priv.at/Microformats/IRC/2008-06-24#T161218) and, like the BBC, I find it "complicated" (I doubt that was the first word that sprang to mind though.)

Let's go back to the specs and see what HTML gives us to work with. Considering over one hundred [attributes in HTML 4](https://www.w3.org/TR/REC-html40/index/attributes.html), only a handful apply to the elements we'd want to tag (not just `<abbr>`, but also `<span>`, `<a>`, `<li>` amongst several others.)

The only attributes available to insert microformat data and still pass validation are: `class`, `dir`, `id`, `lang`, `style` and `title`.

We've dismissed all event-handling attributes (`on_whatever_`) as they're supposed to contain script, and we can quickly dismiss a few more attributes now:

`dir` can only contain two values (`ltr` and `rtl`.)

`id` must be unique per page; that's a restriction we can't work with for microformats.

`style` attributes are supposed to hold CSS properties. It _could_ be subverted using a [vendor prefix](https://www.w3.org/TR/CSS21/syndata.html#vendor-keywords) e.g. `style="-mf-dtstart: ..."`. However, you'd buy yourself a place in hell, and you'd never get support from the microformats community.

That leaves us with `lang`, `title` and `class`.

## Why `lang`?

Good question.

The `lang` attribute indicates what language the _content_ of an element is held in. Language codes were defined in [RFC 1766](https://tools.ietf.org/html/rfc1766), since replaced by [RFC 3066](https://tools.ietf.org/html/rfc3066), which has itself been replaced by a pair of RFCs: [4646](https://tools.ietf.org/html/rfc4646) and [4647](https://tools.ietf.org/html/rfc4647).

Amongst the long lists of language codes, you can find a few options that _should_ let you embed machine-data without it being read-aloud. e.g. the language-code `zxx` indicates there's "no linguistic content", so you might think a screen-reader would simply skip the content:

```html
<p>
  To be held on 12 March 1998
  <span class="dtstart dtend" lang="zxx">1998-03-12</span>
  from 8:30am EST
  <span class="dtstart" lang="zxx">08:30-0500</span>
  until 9:30am EST
  <span class="dtend" lang="zxx">09:30-0500</span>
</p>
```

Sadly, a quick trial using accessibility features on a mac reveals the content it still read aloud. I suspect the other possible language codes - `art` for "artificial languages", and the `x-` prefix for "private use" - would suffer the same fate.

Also, the content would need hiding from sighted users using a simple CSS rule: `[lang|=zxx] { display: none }` - but this would fail under various viewing conditions (e.g. syndicating data via RSS without styles.)

Finally, the whole idea of marking machine-data using the `lang` attribute may be frowned upon. RFC 4646 includes this:

> Language tags are used to help identify languages, whether spoken, written, signed, or otherwise signaled, for the purpose of communication. This includes constructed and artificial languages, but excludes languages not intended primarily for human communication, such as programming languages.

Looks like the `lang` attribute's a bit of a no-no then. That leaves us with `class` and `title`.

## `title` vs. `class`

We've already mentioned the accessibility issues with `title`. The BBC have done the research and user-testing other people only think about. Their results show _it's not just screen-readers_ that get confused by machine-data in `title` attributes - sighted users are baffled too.

Fragmenting one machine-readable value into three doesn't solve the problem - it exacerbates it. The number of elements with mystical tool-tips increases; while human-friendliness increases for some (dates), it decreases for others (timezones).

The `title` attribute is meant for humans, no matter how you spin it.

## All hail the mighty `class`

I must apologize: did I just have a "`title` vs. `class`" debate without mentioning `class`?

I guess I did. `title` got disqualified, leaving `class` to win by default.

_(small side-note: out of all the attributes on the short-list, `class` is the **only one** defined to contain `CDATA` - i.e. general-purpose Character DATA. Just thought that might be worth a mention.)_

Having whittled down our options to one winner, we now need to decide how we're going to organize our data, and cram it into the `class` attribute. We need to take into account the definition of `class`, and that the attribute-value is treated as an _unordered_ list of _white-space separated_ tokens.

That's for part 2, where I also propose tweaking a CSS3 selector to change it from a single niche application to become a general purpose tool in a web-designers arsenal.

**Update:** This post predated HTML support for two features which cover the use-cases microformats tried to address: [microdata](https://html.spec.whatwg.org/multipage/microdata.html#microdata) and [custom data attributes](https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes).
