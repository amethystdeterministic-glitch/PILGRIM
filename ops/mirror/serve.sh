#!/usr/bin/env bash
set -e

cd public
python3 -m http.server 8181
