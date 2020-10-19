---
title: "AppleScript - a frustrating beginning"
date: "2009-04-02T16:01:10.000Z"
modified: "2011-01-03T17:20:13.000Z"
folder: "2009/04/02/applescript-a-frustrating-beginning"
---

Academia and professional work has exposed me to a few different programming paradigms: functional, logical, procedural and object-orientated. I usually get along fine with a new paradigm, starting off with a few example programs and hacking away at them to get a decent grasp of the language. But, I'm not getting anywhere with AppleScript - it's a frustrating beastie!

I think the root cause is the documentation. A quick read of [wikipedia's page on AppleScript](http://en.wikipedia.org/wiki/AppleScript) shows you you're dealing with a _natural language_. AppleScript statements read like english sentences with padding words like "the" being optional, for example: `tell application "Finder" to say the name of the front Finder window as string`.

Maybe I'm being mislead because I'm holding onto [Tiger](http://www.apple.com/support/tiger/) while waiting for [Snow Leopard](http://www.apple.com/macosx/snowleopard/) - I can't see why you'd need to use `as string` at the end of the example given? A Finder window's name property is documented as unicode text and yet I need to explicitly convert it to a string (or equivalently and for no good reason `as text` works too). It's rubbish!

Accesing properties is a little odd too; I'm not even sure whether AppleScripts trying to be object-oreiented or not. We can rewrite the example to use a posessive `'s` instead of the `of` operator. e.g. `tell app "Finder" to say front Finder window's name as text` - which is nice. But sometimes it works, and sometimes it doesn't. (note: I arbitrarily abbreviated `application` to `app`, but I've no idea where to find a full list of supported abbreviations...!)

I don't grok the Script Editor at all. You can easily inspect the command, classes and properties supported by an application, but where the hell's the core language documentation? Where do you go to find out - when it comes to strings - `count` is a method, but `length` is a property? `count "some string"` is OK, but `count _of_ "some string"` isn't! How do I find a list of all properties of the AppleScript class - or any other arbitrary class, record or structure?

In the days and weeks ahead I hope to progress to such _advanced_ topics as:

- writing arbitrary text to standard output ([this doesn't work](http://groups.google.com/group/alt.comp.lang.applescript/browse_thread/thread/d6fd2cd13927d5b3/5cba6813346a1750) and I'd like to write to standard output whenever I need to, not solely at the end of the program.)
- checking a file exists (without using Finder or throwing an error)
- list files in a directory (without using `do shell script` or using Finder)
- get the urls of all tabs of all windows of safari (`tell app "Safari" to get URL of every document` only shows one URL per window, and my natural language instinct to use `every document of every tab of every window` falls flat on its face...)
- access the `/dev` directory (`POSIX file "/usr" as alias` is fine, `POSIX file "**/dev**" as alias` throws an error! WTF!?)

To end on a semi-useful note, here are some very basic things I've discovered while developing AppleScript's in a terminal window:

Determine AppleScript version number

`$ osascript -e "AppleScript's version"`

Show current track name from iTunes

(Note: I'm coming round to the idea that using `$'...'` is the best way of wrapping the applescript on a bash command-line - it allows you to backslash escape single-quotes and keep your double-quotes handy for literal strings.)

`$ osascript -e $'tell application "iTunes" to get current track's name'`

(you'd think there'd be more...)

I'll follow up with another AppleScript article once I've mastered the art of controlling iTunes to extract artwork and iterate over albums and artists.
