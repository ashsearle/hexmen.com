---
title: "Getting git to work on OS X Tiger"
date: "2008-08-22T11:58:10.000Z"
modified: "2011-01-03T17:20:14.000Z"
blurb: "Some lessons learned and tips to help migrate from Subversion to Git on OS X Tiger"
---

If you haven't heard of [git](https://en.wikipedia.org/wiki/Git) yet, it's quickly becoming the preferred version-control system for tons of open-source projects, including the twin suns of [ruby on rails](https://github.com/rails/rails) and [prototype](https://github.com/prototypejs/prototype).

In fact, if you keep your eye on the [github blog](https://github.blog/) you'll see a steady stream of well-known projects moving over to git, as diverse as the [Blueprint CSS framework](https://github.com/joshuaclayton/blueprint-css) and the [Haskell compiler](https://gitlab.haskell.org/ghc/ghc).

Basically, if _git_ was a stock-market commodity, analysts would be issuing **strong buy** recommendations left, right and centre. Git's [tipping-point](https://en.wikipedia.org/wiki/The_Tipping_Point) has arrived.

### How to play

_If you've arrived here via search-engine, it's probably because you're trying to work around errors like **Can't locate Error.pm** or **Can't locate SVN/Core.pm**. Read on..._

I already had macports installed, but if you haven't, follow the [macports install instructions](https://www.macports.org/install.php) - we'll be using macports to download and install git as it's supposed to be simpler than building from source.

If you've had macports installed a while, make sure it's up to date:

```bash
sudo port selfupdate
```

We want to use git to connect to subversion repositories as well, so we'll just check that's possible:

```
$ port list variant:svn
git-core        @1.6.0  devel/git-core
subversion      @1.5.1  devel/subversion
```

I already had subversion installed but through trial-and-error found I needed to reinstall it with perl-bindings (git must be using perl scripts to talk to subversion...) Note: I'm using the `-f` flag to force it to reinstall, you might want to try without first, just to see what conflicts it brings up:

```bash
sudo port uninstall -f subversion-perlbindings
sudo port install -f subversion-perlbindings
```

Next, we install git:

```bash
# This may take a while to install with all its dependencies:
sudo port install git-core +svn
```

And finally, we check it works:

```bash
mkdir myproject; cd myproject;
# Check your PATH's set properly, this should output:
# fatal: Not a git repository
git svn
# If that's OK... clone a repository:
git svn clone https://example.com/svn/project/trunk
```

### Can't locate Error.pm

If you're getting _Can't locate Error.pm_ or _Can't locate SVN/Core.pm_ you should immediately try:

```bash
PATH=/opt/local/bin:$PATH git svn
```

If that works, you know it's just a `PATH` problem. It's something to do with Apple's perl install having slightly kooky ideas about where to store perl libraries.

If you're still getting complaints about Error.pm, you need to install the CPAN module - and we're going to use the `/opt/local/bin` instance of cpan, to make sure things go in the right place for us:

```bash
sudo /opt/local/bin/cpan -i lib::Error
```

Cross your fingers, and try again:

```bash
PATH=/opt/local/bin:$PATH
git svn clone https://example.com/svn/project/trunk
```

If things are working, git will spend a while cloning the subversion repository by pulling out every single revision so you can have a complete set of revisions (including deltas), ready for you to refer to with lightning-speed regardless of internet connectivity. Which is nice.
