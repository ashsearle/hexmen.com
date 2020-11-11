---
title: "Motivational MOTD"
blurb: "A small shell-script to output a motivational message-of-the-day - only once a day"
date: "2020-11-11T18:50:07.471Z"
---

Occasional quotes and motivational messages sometimes give me a little boost, so I thought I'd tweak my shell to display a random message for the first terminal session of the day.

## /etc/motd

Hard-coding something in `/etc/motd` would irritate me: it'd be the same message displayed again and again, in every terminal session. (_Well actually_ it'd only be [login sessions][login-motd], but that seems to be most interactive session across for me.)

(Side-note: you can silence the `login` process by creating a `~/.hushlogin` file. i.e. `touch ~/.hushlogin` will suppress `/etc/motd` content in any/all login shells.)

## /etc/update-motd.d/

A step up from a static `/etc/motd` file: Ubuntu and Debian support dynamic [motd fragments][motd-fragments], assembling a message from output of any number of executables in the `/etc/update-motd.d/` folder. I might have taken this approach if I was running an appropriate OS, but think it would still suffer from the same problem of displaying the message in every shell window.

(Side-note: the executables in `/etc/update-motd.d/` run in lexixcal sort order; it's common practice to give the executables numeric prefixes: e.g. `10-weather` would run before `99-scheduled-downtime`)

## Simplified Requirements

I want:

1. a repository of motiviational messages
1. a record of the last time a message was displayed (_any_ message)

To keep things simple I'll keep all the messages in a plain-text file, and use the last-modified timestamp of a sentinel file to record the 'last displayed' time.

## Stealing content

I intend to carefully curate quotes that resonate with me, but for expediency I'll grab some quotes in bulk from a couple of random articles.

(I'm including these details as an example of extracting information direct from the DOM using Chrome's devtools.)

First up: [17 Motivational Quotes to Inspire You to Be Successful](https://www.success.com/17-motivational-quotes-to-inspire-you-to-be-successful/)

To extract the quotes I browsed the site in Chrome, opened devtools and used the Elements to check the structure of the page to identify container and structural elements used in the markup, then ran a snippet of code in the Console tab to get all the content into the clipboard.

In this particular case all quotes were marked up as `h3` elements. I copied all the `h3` text content to the clipboard:

```js
copy(
  Array.from(document.querySelectorAll("h3"))
    .map(({ textContent }) => textContent)
    .join("\n")
);
```

I used the CLI to filter out empty-lines (using `awk`), unwanted extra headings (using `head`) and stripped off an unwanted `number. ` prefix from every quote (using `awk` again)

```bash
# Ensure ~/.config/motd folder exists:
mkdir -p ~/.config/motd

# Filter the clipboard data and append to the given file (the file will be created if it doesn't already exist.)
pbpaste | awk NF | head -17 | awk '{ sub(/^[^ ]+ /, "") } 1' >> ~/.config/motd/messages
```

On reflection: shell commands were the wrong tool for the job. As we're grabbing content from the web browser, we'd be better off doing the filtering and manipulation before copying the content to the clipboard:

```js
// Grab all quotes (and some unwanted noise)
quotes = Array.from(document.querySelectorAll("h3")).map(({ textContent }) => textContent);

// After inspecting results and trying various things in console, we quickly arrive at:
copy(
  quotes
    .filter(Boolean) // removes empty strings
    .slice(0, 17) // only use content from the first 17 (non-empty) headings
    .map((quote) => quote.replace(/.*? /, "")) // strip off unwanted prefix
    .join("\n")
);
```

Second source: [300 Motivational Quotes To Inspire You Today](https://www.oberlo.co.uk/blog/motivational-quotes).

```js
quotes = Array.from(document.querySelectorAll(".single-post ol>li")).map(
  ({ textContent }) => textContent
);

// After inspection, we believe all the content is clean, so no addigional filtering/processing required:
copy(quotes.join("\n"));
```

```bash
pbpaste >> ~/.config/motd/messages
```

## The script

```bash
#!/bin/bash

CONFIG_DIR=~/.config/motd
MESSAGES="${CONFIG_DIR}/messages"
MESSAGES_LAST_DISPLAY="${MESSAGES}-last-display"

if [ ! -f "$MESSAGES" ]; then
  echo "$0: Store messages in '${MESSAGES}' (file does not exist)"
  exit 1
fi

if [ ! -s "$MESSAGES" ]; then
  echo "$0: Cannot find any messages in '${MESSAGES}'"
  exit 1
fi

if [ ! -r "$MESSAGES" ]; then
  echo "$0: Cannot read messages from '${MESSAGES}' (file is not readable)"
  exit 1
fi

if [ -f "$MESSAGES_LAST_DISPLAY" ]; then
  TODAY=$(date +%F)
  LAST_DATE_DISPLAYED=$(date -r "$MESSAGES_LAST_DISPLAY" +%F)
  if [ "$TODAY" == "$LAST_DATE_DISPLAYED" ]; then
    # We already displayed a message today
    # (One motivational message a day is enough)
    exit 0
  fi
fi

# Get a random message from the file:
MESSAGE=$(shuf -n 1 "$MESSAGES" 2> /dev/null)

if [ -z "$MESSAGE" ]; then
  echo "$0: Empty message (blank line) found in '${MESSAGES}'"
  exit 1
fi

# Using \033 instead of \e for escape codes as \e wasn't working in iTerm on macOS
echo -e "\033[38;5;81m${MESSAGE}\033[m"

# Create file or update its last-modified-time (mtime):
touch "$MESSAGES_LAST_DISPLAY" &> /dev/null
```

Also available as [a gist](https://gist.github.com/ashsearle/bb815eb99b429c0a8ec46a5bc45d16a4)

I called the script `motd` and stored it in `~/bin` (which is in my `PATH`.)

As I reuse a `~/.bash_profile` between machines, I check whether the `motd` command exists before trying to execute it:

```bash
# Run our motd command if-and-only-if it exists:
command -v motd &> /dev/null && motd
```

## Tidbits

- `date -r` allows you to get (and format) the last-modified data for a file - e.g. `date -r file +%F`
- there's a handy `copy()` function available in the console in Chrome devtools (and Safari, and Firefox.) (note: the browsers behave slightly differently if you try copying non-text content (such as arrays))
- terminal emulators may use/understand/require different escape sequence syntax: e.g. `\e` vs `\033`
- `~/.config/` is emerging as a bucket various tools use to store config (in their own named subfolder)
- use `command -v` to check if a command exists (I would have settled for `which`)
- use `&> filename` to redirect stdout _and_ stderr to the same file ([this stackoverflow answer][stackoverflow-redirection-answer] has more info on redirection syntax)
- use `shuf` to select random lines from a file (see [man page][man-shuf])

[login-motd]: https://manpages.ubuntu.com/manpages/xenial/en/man1/login.1.html#files
[motd-fragments]: https://manpages.ubuntu.com/manpages/xenial/man5/update-motd.5.html#best%20practices
[man-shuf]: http://manpages.ubuntu.com/manpages/trusty/man1/shuf.1.html
[stackoverflow-redirection-answer]: https://stackoverflow.com/a/24793436/98493
