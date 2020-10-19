---
title: "Bloody hosting providers"
date: "2008-08-29T10:22:38.000Z"
modified: "2011-01-03T17:20:14.000Z"
folder: "2008/08/29/bloody-hosting-providers"
---

Choosing a hosting provider can be a difficult process, especially when you're on a budget.

I'm heavily involved with [ewelike](http://ewelike.com), a product information and price-comparison site that we're _slowly_ improving as we integrate more price and information feeds.

Of course you can't actually _see_ ewelike right now, as [our hosting provider](http://www.flexiscale.com/)'s been trying to commit [hari kari](http://en.wikipedia.org/wiki/Hari_kari) for the last 3 days.

On-demand computing? Not quite.

**Update: 2008-09-01** [ewelike](http://ewelike.com) came back to life on Friday night. Aside from some recoverable table-corruption, I think we've emerged relatively unscathed - and possibly a little bit wiser.

### Decisions on a shoe-string

We didn't have the option of cloud-computing when we started, and we definitely didn't have the venture capital to buy our own hardware. Our choice was between shared-hosting and private-servers.

We chose shared-hosting with [dreamhost](http://www.dreamhost.com). Compared to service providers in England, dreamhost offered an enticing package with plenty of storage and bandwidth included. We'd got a good feel about them as we knew plenty of designers, developers and bloggers that used or recommended them.

Setup was simple, and we were pleasantly surprised by the freedom offered for a shared-hosting platform - they even allowed users to install custom-compiled copies of PHP to run on.

Sadly, we suffered a few reliability issues, and we never had any guarantee of performance. Once our database started to grow and performance dropped, we realized we need to look around at someone else (at this point, we'd had too many reliability issues to give dreamhost's private servers a go.)

There were so many options for private-servers that we suffered a touch of analysis-paralysis. Should we rent or buy? Build our own server, or let someone else do it? Which flavor of Linux should we go for?

And then cloud-computing took off.

### Cloud computing

After looking at various grid services, we narrowed our options to [Amazon's Elastic Compute Cloud](http://aws.amazon.com/ec2) and [Flexiscale](http://www.flexiscale.com). Running a price-comparison site using Amazon's platform just felt wrong - including Amazon is price-comparison is almost mandatory, but storing their competitor's prices, product images and information within Amazon's data-centers? That's just weird.

The FlexiScale service is provided by [xcalibre](http://www.xcalibre.co.uk/index.html), a UK-based company I use to host the hexmen site, run by a team I've found supportive and responsive in the past. The most enticing things about FlexiScale were fast setup times, low startup costs, and simple methods for improving (virtual) server performance - with straight-forward billing costs.

We've been running on a Flexiscale for a few months without any problems. Until a few days ago.

### Your risk or mine?

When Amazon's EC2 service had an outage earlier this year, I asked a friend "would you rather deal with regular outages yourself, or put-up with occasional problems completely out of your control?"

We'd been thinking about hosting something ourselves: our own PCs in our own homes, using our own broadband connections. The hardware would probably be the most reliable piece of the puzzle, and the broadband the least. In fact, we worked on the assumption that we'd probably be missing for an hour or so every week, with the occasional issue where we'd be gone for a few hours (and ranting down the phone at our ISP.)

The risks of home-hosting seemed too great. Much better to go with a professional outfit with monitoring and procedures in place to resolve the inevitable problems as quickly and painlessly as possible.

### Misery

Ewelike's been down 3 days now. **Three days!** I know we've still got a lot of work to do to build-up traffic and a loyal user-base, and that's probably a saving grace at this point. I'd hate to be clock-watching thinking "that's another thousand pounds lost... And another...".

I'm going to crawl off and figure out how to handle fail-over in future. Do we need to go so far as having the app ready to run on two different clouds? Would we be paranoid enough to have primary and secondary name-servers pointing to different services, just in-case one goes down?

It's time to stop wallowing and crack on with things - but first I'll get my English on and make a nice cup of tea. That'll fix it.
