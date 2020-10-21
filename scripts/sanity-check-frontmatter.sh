#!/bin/bash

# Grab all frontmatter (between lines consisting of '---'), and check the values
sed '/^---$/,/^---$/!d;//d' $(find src/blog -name index.md) | grep -oE '^[^:]+' | sort | uniq -c
