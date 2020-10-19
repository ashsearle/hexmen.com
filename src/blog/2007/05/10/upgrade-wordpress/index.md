---
title: "Upgrading WordPress using mysqli"
date: "2007-05-10T07:25:29.000Z"
modified: "2011-01-03T17:21:35.000Z"
folder: "2007/05/10/upgrade-wordpress"
---

Out-of-the-box WordPress assumes it's going to be talking to a MySQL database using PHP's original mysql extension instead of the newer mysql*i* extension (true up to WordPress 2.1.3 at least). If for some reason you need to run using mysqli, there are simple instructions on the WordPress support site: [MySQLi for WordPress 2.1.x](http://wordpress.org/support/topic/110026).

Switching to MySQLi was easy and worked as described, except for one thing: I couldn't upgrade WordPress. After a bit of sleuthing I found there's a MySQL version check buried in the upgrade process. For the current version (WordPress 2.1.3) it's checking that MySQL is version 4.0.0 or higher. According to the [PHP documentation for mysqli](http://uk3.php.net/mysqli), it needs to run on MySQL 4.1 or above - so the version check is redundant.

Short-term fix: follow the first few steps of the [WordPress upgrade process](http://codex.wordpress.org/Upgrading_WordPress) but before [running the upgrade program](http://codex.wordpress.org/Upgrading_WordPress#Step_9:_Run_the_WordPress_upgrade_program) edit `wp-admin/upgrade-functions.php` and gut this function:

    function wp_check_mysql_version() {
        // (version-check removed)
    }

You should be able to run the upgrade program fine now.
