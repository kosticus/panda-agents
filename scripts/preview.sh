#!/bin/bash
# Usage: ./scripts/preview.sh <name>
# Examples: ./scripts/preview.sh cook, ./scripts/preview.sh chop, ./scripts/preview.sh water
#           ./scripts/preview.sh sleep, ./scripts/preview.sh panda, ./scripts/preview.sh ground, ./scripts/preview.sh layout

set -e
cd "$(dirname "$0")/.."

name="$1"
if [ -z "$name" ]; then
  echo "Usage: ./scripts/preview.sh <name>"
  echo "Available:"
  for f in scripts/generate-*-preview.mjs; do
    n=$(basename "$f" | sed 's/generate-//;s/-preview\.mjs//')
    echo "  $n"
  done
  exit 1
fi

# Find matching script (support partial matches like "cook" -> "chore-cooking")
script=$(ls scripts/generate-*"$name"*-preview.mjs 2>/dev/null | head -1)
if [ -z "$script" ]; then
  echo "No preview script matching '$name'"
  exit 1
fi

output=$(node "$script")
echo "$output"

png=$(echo "$output" | grep -o 'Wrote .*\.png' | head -1 | sed 's/^Wrote //')
if [ -n "$png" ]; then
  open "$png"
else
  echo "Script ran but no PNG path found in output"
fi
