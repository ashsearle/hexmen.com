---
title: "Tweaking PNG transparency with ImageMagick"
date: "2008-07-22T12:21:32.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "A brief article with command-line example using ImageMagick to tweak an image’s transparency"
---

This took me way too long to find out, so I thought I'd blog here and hopefully save someone else some time.

[ImageMagick](https://imagemagick.org/) is a great swiss-army-knife type tool, with a [shed-load of options](https://imagemagick.org/script/command-line-options.php) for converting and combining images. Unfortunately, the sheer number of options can make it a bit time-consuming and frustrating trying to find the one you want.

My aim was simple: given a PNG, make the _whole thing_ semi-transparent.

Searching Google using "transparent" and "opacity" drew a blank - all I got was instructions on how to set transparency for certain _colours_ - not what I wanted to do.

The word I was missing was "alpha", and the magic incantation for changing the opacity of the whole image is:

```bash
convert input.png -channel Alpha -evaluate Divide 2 output.png
```

In my case, I wanted to set the PNG to be 50% transparent (hence "Divide 2".) Of course, you can change that number to whatever works for you.
