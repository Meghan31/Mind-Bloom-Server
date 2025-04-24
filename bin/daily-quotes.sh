#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Get the parent directory (the app root)
APP_DIR="$(dirname "$SCRIPT_DIR")"

echo "Running daily quotes process from $APP_DIR"

# Debug information
echo "PATH: $PATH"
echo "Directory contents:"
ls -la

# Change to the app directory
cd "$APP_DIR"

# Check if OPENAI_API_KEY is set directly from environment
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY environment variable is not set"
  exit 1
fi

# Try to find nodejs/node executable
NODE_CMD=""
for CMD in node nodejs /usr/bin/node /usr/local/bin/node /opt/node/bin/node; do
  if command -v $CMD >/dev/null 2>&1 || [ -x "$CMD" ]; then
    NODE_CMD=$CMD
    echo "Found Node.js at: $NODE_CMD"
    break
  fi
done

if [ -z "$NODE_CMD" ]; then
  echo "Error: Could not find Node.js executable"
  echo "Checking standard locations:"
  ls -la /usr/bin/node* /usr/local/bin/node* /opt/*/bin/node* 2>/dev/null || echo "No Node.js found in standard locations"
  exit 1
fi

# First collect a new quote
echo "Collecting new quote..."
$NODE_CMD src/collect.js
if [ $? -ne 0 ]; then
  echo "Error: Quote collection failed"
  exit 1
fi

# Wait a moment to ensure the collection is complete
echo "Waiting for collection to complete..."
sleep 5

# Then analyze and save to database
echo "Analyzing and saving quote..."
$NODE_CMD src/analyze.js
if [ $? -ne 0 ]; then
  echo "Error: Quote analysis failed"
  exit 1
fi

echo "Daily quotes process completed successfully"