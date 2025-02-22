#!/usr/bin/env sh

echo "=================================
||       🎉 Build init!        ||
================================="

rm -rf build
npx webpack --config ./config/webpack.config.js

echo "=================================
||       🎉 BUILD COMPLETED!     ||
================================="