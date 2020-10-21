---
title: "MySQL latin1 → utf8 (Wordpress upgrade)"
date: "2008-07-08T08:46:10.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "Sometimes a small changes via command-line is all you need to fix encoding issues with a MySQL backup"
---

Spurred on by [mass hacking](https://techcrunch.com/2008/06/11/my-blog-was-hacked-is-yours-next-huge-wordpress-security-issues/), I've updated my old (version 2.0.3) Wordpress install to something a little newer.

I decided to err on the side of caution and upgrade a _copy_ of the live DB first - and I'm glad I did. I saw lots of problems with accents and symbols getting munged in the upgrade - well, that's what I thought.

In reality, the symbols were being screwed in the backup-and-restore process. Words such as "naïve", £-signs and various typographic quotes were obviously getting messed up through character-encoding issues.

After a bit of sleuthing, I found the output from `mysqldump` wasn't valid. The problem was caused by a combination of default connection settings in a `.my.cnf`, and the fact that the old Wordpress install was storing utf-8 characters inside a latin1 database.

My MySQL default settings are:

```
[client]
default-character-set=utf8
```

Because we're pulling latin1 data over a utf-8 connection, MySQL starts doing character-set conversions, and screws up a bunch of text that it _thinks_ is latin1, but in reality is actually already in utf-8.

The fix for the backup process was to override my default settings with latin1:

```bash
mysqldump --default-character-set=latin1 --opt -h db.example.com -u user -ppassword schema > db-backup-latin1-20080707.sql
```

That worked fine, and the next step was reloading it into the DB as utf-8. This required a little bit of string replacement using a command-line utility bundled with MySQL. If you're going to do this yourself, watch what you type: I somehow typed in "lastin1" halfway through and lost an hour or so trying to figure out what went wrong. Anyhow, here's the command-line:

```bash
sed \
  -e 's/CHARSET=latin1/CHARSET=utf8/g' \
  -e 's/SET NAMES latin1/SET NAMES utf8/g' \
  < db-backup-latin1-20080707.sql > db-backup-utf8-20080707.sql
```

You should now be able to blat / restore / overwrite your DB and ensure all tables are in the appropriate character set, ready for a smooth wordpress upgrade.

```bash
mysql --opt -h db.example.com -u user -ppassword schema < db-backup-utf8-20080707.sql
```
