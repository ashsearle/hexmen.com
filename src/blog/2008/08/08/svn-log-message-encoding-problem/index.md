---
title: "SVN log message encoding problem"
date: "2008-08-08T11:03:12.000Z"
modified: "2011-01-03T17:20:14.000Z"
folder: "2008/08/08/svn-log-message-encoding-problem"
---

It's good practice to put useful commentary in the log message whenever you commit code to a repository.

Today, I wrote a log message about centigrade and farenheit conversions, using the proper degree symbol °, but this triggered an encoding problem, resulting in an error message:

macbook:~/projects/smarty ash\$ svn ci plugins/function.temperature.php
svn: Commit failed (details follow):
**svn: Can't convert string from native encoding to 'UTF-8':**
svn: Tweak: altered temperature title attribute so it contains both farenheight AND
centigrade. e.g. "88?\\194?\\176F or 17?\\194?\\176C". The order is switched depending on user
preference.
--This line, and those below, will be ignored--

M function.temperature.php

svn: Your commit message was left in a temporary file:
svn: '/Users/ash/projects/propagandr/smarty/plugins/svn-commit.tmp'

It didn't take long to realize although my editor (vim) was configured to use UTF-8, the subversion command-line client had no way of knowing that.

One way of stopping this happening again would be to set my locale permanently so the character-type is UTF-8 (e.g. `export LC_CTYPE=en.UTF-8`.) But, as a short-term one-off fix, avoiding retyping the log message (and a little off-topic: remembering subversion ignores filenames mentioned in log messages, forcing you to reenter them on the command-line again) - the simple fix was:

ash\$ `LC_CTYPE=en_GB.UTF-8 svn ci -F plugins/svn-commit.tmp plugins/function.temperature.php`

Worked like a charm.
