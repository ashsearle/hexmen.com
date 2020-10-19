---
title: "Fixing mysqldump character-encoding in Vim"
date: "2008-07-09T10:22:23.000Z"
modified: "2011-01-03T17:20:14.000Z"
folder: "2008/07/09/fixing-mysqldump-character-encoding-in-vim"
---

If you find yourself in a position where your `mysqldump` backup/restore process isn't working, it's worth checking for character-encoding issues - and the best way to do this is often to look at the SQL in your backup file.

To tell [vim](https://www.vim.org/) you prefer working in unicode, you may have added some settings to your `.vimrc`:

`set encoding=utf-8 fenc=utf-8`

That doesn't get vim to treat existing files as UTF-8 though! Vim tries to figure-out the encoding itself, and may well get it wrong.

Looking at the mysqldump file, you could see garbage like:

`One naÃ¯ve approach`

Something's horribly wrong there. It looks like an encoding issue, and a quick `:set fenc` shows you whether vim opened the file in `latin1` or `utf-8`.

You can force vim to re-open the file in utf-8 using:

`:e ++enc=utf8 %`

Hopefully, you now see:

`One naïve approach`

Now you know you've got unicode in your mysqldump, you can fix the restore process by a bit of search-and-replace on connection settings and table-creation statements. i.e you're looking for lines like:

`/*!40101 SET NAMES latin1 */;`

...and...

`ENGINE=MyISAM DEFAULT CHARSET=latin1;`

Switch those from `latin1` to `utf8` and, fingers-crossed, you should be able to restore your db backup, and _upgrade_ all your tables to utf8 in the process.
