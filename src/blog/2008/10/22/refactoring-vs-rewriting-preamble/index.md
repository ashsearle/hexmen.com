---
title: "Refactoring vs Rewriting (preamble)"
date: "2008-10-22T16:22:38.000Z"
modified: "2011-01-03T17:20:13.000Z"
folder: "2008/10/22/refactoring-vs-rewriting-preamble"
---

The say the path to recovery starts with admitting you have a problem.  
I wish our problem was code-rot, or a simple case of a good design gone horribly wrong through bodged maintenance and hacks. (If only we'd managed to achieve such lofty goals to start with.)  
Let's just rephrase: _the path to recovery starts with acceptance_.  
Think of this as an acceptance speech, or a first-time introduction at Incontinence Anonymous. "Hi. My name is Ash, and I've made a mess."  
I'm admitting to a problem (in public) because I want to move on. I want to get the feeling of acceptance, figure out the six-step plan to recovery, and start climbing out of this pile of manure one shitty handful at a time.  
This is going to be public and painful, but I've checked with my partner and extracted a grumbling murmur to go ahead.

### What are we talking about here?

We'll be talking about [our price comparison site: ewelike.com](http://ewelike.com). That's the beast waiting for a handy dollop of TLC, or a lethal injection (I leave it to you to make your own call on that.)  
The code-base is a nightmare. From tier-to-tier, front-to-back; a full blown living nightmare. Every day I sit down to code I debate whether to poke it a little more, or pronounce the code dead and rewrite the whole thing from scratch.  
Not good.

### More haste, less speed

For a two-man team, we managed to rack-up an impressive tally of mistakes very early on, starting with how we chose a language:  
I was a Java aficionado, and my partner came from a Microsoft background. Neither of us wanted to cross-train - not out of loyalty or hate, but because neither platform seemed like the best way to get stuff out the door quickly.  
Without ruminating obsessively, we decided scripting was the path to follow and quickly short-listed the three P's (perl, python and PHP), ruby and lua. Python and Perl were quickly ruled out for the most immature reasons (the partner hates perl's stereotypical punctuation-heavy style - and I hate python's space-sensitivity.) A brief foray into installing Lua on OS X convinced me it was too unpopular and risky to use. With high hopes for Ruby (and Rails) that option quickly hit a wall too due to immense confusion and a complete absence of "mod_ruby" (I know, things have moved on.)  
So we ended up with PHP. I think its important (to me) to realize we ended up with PHP by default, not on its merits. PHP, of all things. PHP with it's "magic" methods. PHP with its retarded unicode support. PHP with its piss-poor objects.  
In case you missed the subtle undertone there: I don't like PHP. But at the time, we'd ruled out all other options and talked ourselves into PHP with the convincer "Facebook runs it... it's gotta scale!"

### Design? What design?

A two-man team: both degree educated, both experienced with languages from Ada to Eiffel and Lisp to Miranda. Both with industry experience working on small, medium and large teams. Both smart enough to know better.  
Of course, it's different when you're your own boss. When there's no client. No timescale. No requirements.  
We got sucked into the 'agile' cult, taking on all their bad practices, and failing to follow any of the good. Very soon we were banging out code with gay abandon. We never planned a proper object model, and felt more productive banging out procedural code instead of implementing class hierarchies - this has lead directly to inefficient, inelegant code with a more than a touch of the cut'n'pastes.  
To his credit, my partner introduced unit-testing with SimpleTest quite early-on. To our detriment, we never grouped tests into test-suites, only ever running tests in isolation. With human-error at play we'd regularly introduce code that broke a test, and not notice till weeks later. It wasn't long before we were so used to having broken tests around that on we'd actual revel in the rare occasion when a test went green again.  
Stupid, stupid, stupid, stupid...

### The way forward...?

Though I'm sorely tempted to throw our code out the window together with PHP, I'm driven by the hope step-by-step refactoring can lead us to safety, breathing new life into the code, and new momentum into the site - without the unavoidable stagnation a total rewrite-from-scratch would entail.  
We have a ton of work ahead of us, and its hard deciding what to focus on first:

Unit Tests

- remove/update outdated tests
- fix failing tests
- organize into suites and then into a one-click "run all tests"
- integrate "run all tests" into the build process: no pass, no deploy

Database

- general tuning (setting caching and buffer sizes)
- query optimizations (using [High Performance MySQL](http://ewelike.com/products/High-Performance-MySQL_Arjen-Lentz_Book/468195) \[ewelike.com\])

PHP

- finish class design using ActiveRecord / ActiveObject
- solve bottlenecks with caching (where possible)

UI

- simplify/rewrite semantic HTML
- break-up & organize CSS

That's simply a list of things to refactor and fix, excluding all the _new_ things we want to do (total front-end redesign, better ajax, more features...)  
I've no doubt this is going to be a slow and painful process, but I'm hopeful the end results will be worth it. It's been said that the only way to understand something is to try and explain it (hence this waffling preamble) - I'm planning to write follow-up articles as we go along, sharing the best-practices we discover, as well as pitfalls to avoid.  
Please excuse me, I have some work to do.
