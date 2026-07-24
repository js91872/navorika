#!/bin/bash
# Bypass ESLint completely
export NEXT_PUBLIC_IGNORE_ESLINT=true
export NEXT_PUBLIC_IGNORE_TYPESCRIPT=true
export NEXT_DISABLE_ESLINT=1
export ESLINT=0

# Run Next.js build with no lint
npx next build --no-lint
