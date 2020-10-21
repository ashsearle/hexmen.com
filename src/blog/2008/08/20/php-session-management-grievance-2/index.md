---
title: "PHP Session Management (grievance 2)"
date: "2008-08-20T10:15:20.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "Spawning multiple requests to a PHP-backed can trigger blocking behaviour that requires a shift in how you manage server-side session state"
---

Sometimes PHP surprises you with an easy-to-use feature, like sessions.

Sessions are quite easy to use in PHP. One call to `@session_start()`, and you have a magic global called `$_SESSION` to store data in; associated with the user using a cookie called `PHPSESSID`. PHP takes care of reading and writing the session data for you, and you think no more about it.

Simple.

Time passes, and you haven't given sessions another thought. Your site's evolving, using more and more AJAX, and seems to be performing 'OK'. But, there's a niggling doubt that something's not quite right.

For us, we realized something was wrong when we opened multiple search-results in separate windows. We could see the tabs were loading one by one, slowly.

I guess we should have paid more attention to start with. Our previous web development background revolved around enterprise-class application servers. Sessions just worked, no concurrency worries. If you happened to run into a race-condition, you worked around it using threading and locking facilities provided by the implementation language. It never occurred to us that PHP would be so different.

PHP, the way we're running it (via `mod_php`) couldn't be further from the application-server model if it tried. Sessions are implemented using file-based storage by default, not held in shared memory ready for use by multiple threads.

Storing sessions in files means PHP has to take heavy-handed precautions against concurrent read/write access to the session - it locks the session file for the duration of a request.

The idea never occurred to us - that session management would block user-requests, stopping concurrent requests completing (think AJAX.) Fortunately the quick-fix solution is simple: call [`session_write_close()`](https://www.php.net/session_write_close) as soon as you've finished writing to the session. Depending how you use sessions, you may find a number of actions only need read-access to the session, in which case you may want to open and close the session together: `@session_start(); session_write_close()`

That's the quick fix, but there are plenty of other options to explore to. A quick code-audit could identify a ton of actions, controllers and pages that simply don't need session access at all. Now you know PHP locks the session file, you probably want to avoid calling `session_start()` unless absolutely necessary.

Secondly, PHP allows you to choose what type of session-management you use. You can use memcached either on its own, or with a database backing-store. You could use a MySQL back-end, or roll your own session management registered using [`session_set_save_handler`](https://www.php.net/manual/en/function.session-set-save-handler.php). It's really up to you.

Perhaps that's the problem right there. All the session-management hooks are there because the default session management sucks. The simplicity of using sessions lulls you into a false sense of security, but make no mistake - sessions need to be handled with care if you've any hope of running a high-volume website.

Are your sessions managed properly?
