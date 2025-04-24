# #!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Get the parent directory (the app root)
APP_DIR="$(dirname "$SCRIPT_DIR")"

echo "Running daily quotes process from $APP_DIR"

# Change to the app directory
cd "$APP_DIR"

# Make sure we have the right environment
if [ -f .env ]; then
  source .env
  echo "Environment loaded from .env file"
else
  echo "Warning: .env file not found"
fi

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY environment variable is not set"
  exit 1
fi

# Use the node from the path if available
if command -v node &> /dev/null; then
    NODE_CMD="node"
else
    # Try to find node in common locations
    for possible_node in /usr/bin/node /usr/local/bin/node /opt/node/bin/node /app/node_modules/.bin/node; do
        if [ -x "$possible_node" ]; then
            NODE_CMD="$possible_node"
            break
        fi
    done
    
    # If we still don't have node, exit with error
    if [ -z "$NODE_CMD" ]; then
        echo "Error: Node.js not found"
        exit 1
    fi
fi

echo "Using Node.js at: $NODE_CMD"

# First collect a new quote
echo "Collecting new quote..."
$NODE_CMD build/src/collect.js
if [ $? -ne 0 ]; then
  echo "Error: Quote collection failed"
  exit 1
fi

# Wait a moment to ensure the collection is complete
echo "Waiting for collection to complete..."
sleep 5

# Then analyze and save to database
echo "Analyzing and saving quote..."
$NODE_CMD build/src/analyze.js
if [ $? -ne 0 ]; then
  echo "Error: Quote analysis failed"
  exit 1
fi

echo "Daily quotes process completed successfully"