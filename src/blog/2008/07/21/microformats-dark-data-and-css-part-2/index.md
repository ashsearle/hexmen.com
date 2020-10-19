---
title: "Microformats, dark data and CSS - part 2"
date: "2008-07-21T14:52:01.000Z"
modified: "2011-01-03T17:20:14.000Z"
folder: "2008/07/21/microformats-dark-data-and-css-part-2"
---

The [first part of this article](https://hexmen.com/blog/2008/07/microformats-dark-data-and-css-part-1/) considered over 100 HTML 4 attributes and came to the conclusion `class` was the only one suitable for storing _machine data_ (i.e. data specifically inserted and intended for machine parsing.)

In this second part, I'll review several ways to store data in the class attribute, determine the 'best' method, and suggest a CSS implementation change that is (IMO) both trivial and immensely beneficial.

We start by considering the definition of the class attribute, how it's value is interpreted, and what restrictions this this places on us for storing data.

### Isn't `class` object-oriented?

Some people say `class` has an object-oriented use as though (X)HTML and CSS are object-oriented languages, with inheritance based on `class` values. But that's not how things work: inheritance is based on parent/child relationships, with everything else determined by "[the cascade](http://www.w3.org/TR/REC-CSS2/cascade.html)".

Let me illustrate with a contact directory example I hope isn't too contrived.

Contact phone numbers are styled using common fonts and padding, but with different background-images based on the type of phone number (home, work, fax etc.) Using a top-level concept class of `tel`, we _"subclass"_ using `home`, `work` and `fax`.

Phone numbers can be output and formatted using multiple classes working together:

    <span class="tel home">+1 212 123 1234<span>

Because `home` is such a generic term, we'd write CSS using a 2-class selector like this:

    .tel { font: ...; padding-left: 16px; background: transparent no-repeat middle left; }
    .tel.home { background-image: url(icons/tel-home.gif); }
    .tel.work { background-image: url(icons/tel-work.gif); }
    .tel.fax { background-image: url(icons/tel-fax.gif); }

Dropping `tel` from the mark-up would cause all styling to be lost - the value `home` on its own does not encapsulate enough information to determine its position in a class hierarchy. Later on, I'll come back to this and suggest hyphenation as an option that may embody a class relationship more explicitly.

### Unordered `class` data

By definition, class is an unordered set of white-space separated values. The values "tel home" and "home tel" should be treated the same, with the CSS selector ".tel.home" applying with equal specificity to both numbers below.

    <span class="tel home">+1 212 12341 12112<span>
    <span class="home tel">+1 212 12341 12112<span>

We must bear this ordering-independence in mind when storing data in `class`. Trying to store multiple bits of data in sequential order cannot work - e.g. a conference schedule:

    ...
    <li><span class="dtstart 9:00 dtend 9:15" title="9am">09:00</span> - Registration</li>
    <li><span class="dtstart 9:15 dtend 10:30" title="9:15am">09:15</span> - Keynote</li>
    <li><span class="dtstart 10:30 dtend 10:45" title="10:30am">10:30</span> - Coffee</li>
    <li><span class="dtstart 10:45 dtend 12:00" title="10:45am">10:45</span> - Session 1</li>
    <li><span class="dtstart 13:00 dtend 14:00" title="1pm">13:00</span> - Session 1</li>
    ...

_Note: in this example, humans are supposed to infer end-times by looking at the start-time of the following event. We include machine-data for end-times because "inference" is not easy for programmers to implement._

Although the order is clear and correct in the mark-up, browsers, parsers and libraries have no obligation to maintain the order when accessed. e.g. a "classes" method could return an arbitrarily ordered array of classes:

// fetch the classes for the first item in the schedule:
var classes = \$('.dtstart:nth(0)').classes();
// may output: \["9:00", "9:15", "dtend", "dtstart"\]

Without further labouring, the take-home point is: data in class-values cannot rely on ordering.

### The necessity of prefixes

You may not be 100% certain how your content will be processed or transformed, or what corruption it may suffer; but you can at least _attempt_ to mitigate disaster.

For example: times embedded in machine-data can be arbitrarily precise, from specifying years on their own ("2008"), to fully specifying a time-zone and exact second of an event ("20080721T124032+0100") The longer format is unlikely to cause confusion (to machines), but the shorter variants could easily be mistaken for model numbers. e.g. the ISSN of periodicals for sale:

    <li><a href="..." class="issn 02624079 dtstart 20080719" title="New Scientist dated 19th July 2008">New Scientist no. 2665</a></li>

As we can't rely on ordering, we need to join the data-type and the data-value together. A few approaches have been suggested, including wrapping the value, or concatenating the pieces with an arbitrary separator - I suggest using a hyphen, which I'll justify in a minute:

    <a href="..." class="issn{02624079} dtstart{20080719}">
    <a href="..." class="issn#02624079 dtstart#20080719">
    <a href="..." class="issn-02624079 dtstart-20080719">

### The hyphenated-prefix selector `[attribute|=prefix]`

CSS 2 introduced [several attribute selectors](http://www.w3.org/TR/REC-CSS2/selector.html#attribute-selectors), including one I'm calling the hypehenated-prefix selector.

The specification admits the primary purpose of this selector is for matching language subcodes; i.e. where CSS rules need only apply to content written in some subset of natural languages:

\[lang|=en\] blockquote, \[lang|=en\] q, blockquote\[lang|=en\], q\[lang|=en\] { quotes: '“' ”'; }
\[lang|=de\] blockquote, \[lang|=de\] q, blockquote\[lang|=de\], q\[lang|=de\] { quotes: '«' '»'; }

The rules above specify different quote-marks for German and English. Using the prefix selector means the appropriate rule applies to all English languages, including "en-GB" and "en-US", as well as content marked no more specifically than lang="en". Similarly, the 'de' rule applies to all German languages.

However, this selector can just as easily be applied to classes. We can rewrite the telephone-number example as:

    <span class="tel-work">+1 212 800 1234<span>
    <span class="tel-home">+1 212 123 1234<span>





    [class|=tel] { font: ...; padding-left: 16px; background: transparent no-repeat middle left; }
    .tel-home { background-image: url(icons/tel-home.gif); }
    .tel-work { background-image: url(icons/tel-work.gif); }
    .tel-fax { background-image: url(icons/tel-fax.gif); }

### Relaxing the hyphenated-prefix rules

Sadly, the hyphenated-prefix is overly-restricted. In the following example, only one rule applies:

    [class|=issn] { font-weight: bold }
    [class|=dtstart] { background-image: url(bg/microformat.gif); }
    <li><a href="..." class="issn-02624079 dtstart-20080719" title="New Scientist dated 19th July 2008">New Scientist no. 2665</a></li>

The problem is due to the way `[attribute|=prefix]` is defined:

> Match when the element's "att" attribute value is a hyphen-separated list of "words", beginning with "val". _The match always starts at the beginning of the attribute value._ This is primarily intended to allow language subcode matches (e.g., the "lang" attribute in HTML) as described in RFC 1766 (\[RFC1766\]).

(Emphasis added.)

If the definition had instead been made to cater for a white space separated set of hyphenated tokens, we'd be in a much better position for styling and parsing machine-data microformats today.

### \[attribute|=prefix\] implementations

(Surprisingly) the big four browsers (including IE7) all support the hyphenation prefix selector. But, JavaScript library support is lacking, specifically (naming the javascript library I use daily) [jQuery](http://jquery.com/) doesn't handle the hyphenated-prefix selector, although it's a simple patch.

Assuming JavaScript libraries (or microformat parsers) already implement attribute-selectors, it's a simple matter to support white space separated hyphenated-prefixes. The key regular-expression is:

    /(^|\s)prefix(-|\s|$)/

Assuming your users know what they're doing and are willing to fix their own issues after throwing something stupid at your library, the regular-expression is easily built on executed on the fly:

    new RegExp("(^|\\s)" + prefix + "(-|\\s|$)").test(attribute)

Or (I think), in [XPath 2.0](http://www.w3.org/TR/xpath-functions/#func-matches):

    //*[matches(@attribute, "(^|\s)prefix(-|\s|$)")]

### Encoding data

Quotations and ampersands aside (naturally taken care of by normal (X)HTML encoding rules) there's an obvious problem when data-values contain white space. Fortunately, there's also an obvious solution, as several methods exist to encode arbitrary data into continuos strings without any white-space. In JavaScript, the methods available include `escape`, `encodeURI` and `encodeURIComponent`, and I'd suggest `encodeURI` as the best option - providing a good balance between safely encoding data, without being overly aggressive and creating human-unreadable data.

### Simplicity is the key

Microformats success depends on its simplicity; using a few attributes and a handful of patterns to invisibly add extra layers of information to existing content.

Hopefully, I haven't suggested anything in conflict with existing microformats. Hyphenated-prefixes should be viewed as an _additional tool_ in your arsenal. Not as a competing or successor solution.

With a more flexible definition of the that damned attribute selector, I'm sure the [unAPI](http://unapi.info/specs/) folks would have produced an _even simpler_ specification, and the arguments around microformat's [datetime design pattern](http://microformats.org/wiki/datetime-design-pattern) would have been resolved years ago.

Though I'm sure it doesn't show, I've written and rewritten this article many times, but it doesn't get any more complex:

**If you want to piggy-back machine-data on existing content, use the class attribute. Separate data-types from data-values using a hyphen, and encode the data using something equivalent to JavaScript's `encodeURI`.**

That's all folks
