---
title: "A handy PHP debug function"
date: "2007-05-03T17:19:44.000Z"
modified: "2011-01-03T17:21:35.000Z"
folder: "2007/05/03/php-debug-function"
---

Like most developers, I often find it useful to spit out a few messages in the middle of a PHP script - especially when I'm debugging some problems.  
Sadly, after only a few months our pristine code-base has become spotted with this, over and over again:

    if (DEBUG) {
        echo "New user object: "; var_dump($user); echo "\\n";
    }

After discovering `var_export` I felt like I'd improved things by switching to:

    if (DEBUG) {
        printf("New user object: %s\\n", var_export($user, true));
    }

I still didn't like the fact that `if (DEBUG)` was appearing all over the place. So, after stumbling across [call_user_func_array](http://uk2.php.net/manual/en/function.call-user-func-array.php) I've implemented by own `debug` function:

    function debug()
    {
        if (DEBUG)
        {
    	$args = func_get_args();
    	$args[0] = "<pre>" . $args[0] . "</pre>\\n";
    	for ($i = 1, $l = count($args); $i < $l; $i++) {
    	    $args[$i] = htmlspecialchars(var_export($args[$i], true));
    	}
    	call_user_func_array('printf', $args);
        }
    }

Which means I can remove all the `if (DEBUG)` statements, leaving only:

    debug("New user object: %s", $user);

I think that's much cleaner.
