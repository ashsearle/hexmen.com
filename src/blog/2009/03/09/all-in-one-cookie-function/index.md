---
title: "All-in-one cookie function"
date: "2009-03-09T11:18:06.000Z"
modified: "2011-01-03T17:20:13.000Z"
folder: "2009/03/09/all-in-one-cookie-function"
---

Users stumbling across jQuery may notice the API's designed so a method's behaviour varies depending on the number and type of arguments passed in a call (have a look at the [jQuery method](http://docs.jquery.com/Core/jQuery)!). In the right hands, this flexibility produces clean and elegant code without burdening the developer with 101 new method names to learn.

Let's do the same for cookies (source: [cookie.js](https://hexmen.com/js/cookie.js)).

### Three into one does go

Googling for '[javascript cookie functions](http://www.google.com/search?q=javascript+cookie+functions)' brings back Peter-Paul Koch's trio of functions from [QuirksMode](http://www.quirksmode.org/js/cookies.html). The functions are named `setCookie`, `readCookie` and `eraseCookie`. Browsing through the next few search-results we see the same thing going by different names: `get`, `set` and `deleteCookie`; `add` & `remove`, `erase` & `delete`, `read`, `get` and `check` - all variations on a theme, all separating functionality into a trio of functions.

Let's look at the method signatures:

- `createCookie(_name_, _value_, _days_)`
- `readCookie(_name_)`
- `eraseCookie(_name_)`

It's pretty basic stuff.

To merge the three functions into one, we have to differentiate between reading, writing and deleting a cookie by the number and value of arguments; I've chosen an implementation where deleting a cookie is achieved by setting it to `null`.

Here's some example usage:

```js
// create a cookie:
cookie("name", "value");
// read it:
alert(cookie("name"));
// erase it:
cookie("name", null);
```

### Flexibility

All those cookie calls pass at least one parameter... but isn't there something useful we can do with a plain parameterless `cookie()` call? Of course there is - let's return an associative array of all cookie values!

By default (without specifying an explicit expiry time) cookies survive until you restart the browser. It's kinda mandatory to provide some way of specifying an **expiry** time.

We'll accept an _optional_ third parameter specifying an expiry time in _days_:

```js
// create cookie for 1 year
cookie("theme", "minimal", 365);
// grab all cookies:
var cookies = cookie();
alert(cookies.theme);
```

Looking good so far. But there's more.

Like several of the cookie libraries, our function defaults to setting cookies on the top-level path "/" - this is a more common requirement than the browsers default behaviour, which sets a cookie so it's only used at or below the current page level (i.e. a cookie set while looking at "[/products/Nintendo-DSi-Console_Black/978372](http://ewelike.com/products/Nintendo-DSi-Console_Black/978372)" wouldn't be available when looking at any other product.)

To give developers flexibility I've made **path** another _optional_ parameter - it could be used to share cookies between "/product/\*" pages, but withhold them from any other area of a site.

While we're on the subject of sharing - what about cross-domain cookies? Cookies are naturally assigned to the domain the page is being viewed on, but sometimes we want to make sure a cookie's available to all sub-domains too. **domain** is also an _optional_ parameter.

Having both _path_ and _domain_ as optional parameters could be confusing - after all, they're both strings. Fortunately, we know paths begin with '/' and domains don't - and if you want to specify both you just stick to the right order: _path_ then _domain_:

```js
// share cookie between product pages:
cookie("view-description", "hidden", "/products");
// share cookie between domains:
cookie("id", "_", ".ewelike.com");
// save preferences cross-domain for 1 year:
cookie("prefs", "_", 365, "/products", ".ewelike.com");
```

Finally, there's an optional 'secure' parameter. I've never used this myself, but it's there if you want it. It's handy if you're storing sensitive information in cookies and you only want to allow the browser to transfer the cookie value when it's request pages via https. The code will take any _truthy_ value hanging off the end of the parameters (anything that's not been interpreted as expiry date, path or domain.):

```js
// set a secure cookie on the default path and domain
// (expires when the browser closes)
cookie("name", "value", true);
```

Want the code? Grab it now... [download cookie.js](/js/cookie.js) (dual-licensed under MIT and GPL, exactly the same as jQuery)
