---
title: "<code>undefined</code> is not a reserved word"
date: "2007-01-19T21:31:33.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2007/01/19/undefined-is-not-a-reserved-word"
---

With the new release of Prototype (1.5.0) comes a new website for the [Prototype JavaScript Library](http://prototypejs.org/). The home-page of the new website features a snippet of JavaScript:

    cells: function(row) {
      if(row == undefined) return this.tab...
      return $(row).getElementsBySelector(...
    }

Let's get this straight: `undefined` is not a reserved word. It's safer and more logical to make the comparison to `null`:

    cells: function(row) {
      if(row == null) return this.tab...
      return $(row).getElementsBySelector(...
    }

As `null` **is** a reserved word (and it's quicker to type) I'd expect the Prototype community to favour it.  
_Note: assuming `undefined` hasn't been redefined, the two code fragments are functionally identical. i.e. the equals operator (`==`) treats `null` and the primitive value `undefined` exactly the same._
