---
title: "Fixing Firebug’s Style Tab"
date: "2006-12-11T11:13:40.000Z"
modified: "2011-01-03T17:21:36.000Z"
folder: "2006/12/11/fixing-firebugs-style-tab"
---

Lots of people are unable to use the **Style** tab in the new [Firebug](http://www.getfirebug.com/downloads.html "Download Firebug at www.getfirebug.com") beta. The [Firebug FAQ](http://getfirebug.com/faq.html) leads to a thread suggesting this fix:

1.  Uninstall Firefox
2.  Delete the (left-over) install folder (e.g. `C:\Program Files\Mozilla Firefox`)
3.  Reinstall Firefox using a _custom install_ (to ensure the DOM Inspector is installed

Knowing that I already had the DOM Inspector installed, I thought I'd try removing just a few files, instead of the whole install folder. Whatever I did worked, and the **Style** tab works for me now. This more conservative procedure is:

1.  Uninstall Firefox
2.  Delete only the named `inspector`\* in `C:\Program Files\Mozilla Firefox\components`
3.  Reinstall Firefox using a _custom install_ (to ensure the DOM Inspector is installed

I'm not sure whether the uninstall and reinstall procedure is strictly necessary, so I'm hoping someone out there can try this:

1.  Stop Firefox
2.  Delete all files named `inspector`\* in `C:\Program Files\Mozilla Firefox\components`
3.  Restart Firefox
