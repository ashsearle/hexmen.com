Gatsby-based blog for hexmen.com.

This _was_ a company website, but company has now been disolved, so it needs
updating to remove all trace of 'Limited' from the site.

## Development

```bash
# Setup
cd hexmen.com
yarn install

# Start development server (http://localhost:8000).
yarn develop
# Note: the development server is HMR enabled.  e.g. changes to
# `site-footer.js` are immediately reflected in the browser.

# Build for production.
yarn clean
yarn build

# Serve production build (https://localhost:9000).
yarn serve

# Upload to server (https://hexmen.com).
yarn upload
```

Files are uploaded using `rsync` with various exclusions to preserve legacy
files we don't want to delete. The exclusions are listed in `.rsyncignore`
which is _not_ a standard filename, but seemed logical.

I found `rsync` is easier to use than `scp`; I made silly mistakes with `scp`
attempting to copy the _content_ of a `public` folder ended up creating a
`public_html/public` folder on the server. Using `scp -r public/* server:public_html/` wasn't an option as it missed dot-files.

Rsync tunrs out to be more logical and _much_ faster. It also has a `--dry-run`
mode to let us test things before doing them for real.

Example:

```bash
# Test
rsync -avz --dry-run --exclude-from=.rsyncignore --delete public/ server:public_html/

# Do it for real
rsync -avz --exclude-from=.rsyncignore --delete public/ server:public_html/
```
