# #!/bin/sh

# npm run collect

#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Change to app directory
cd $APP_DIR

# Check if the compiled file exists
if [ ! -f "build/src/collect.js" ]; then
  echo "collect.js not found, compiling..."
  # Compile just collect.ts
  npx tsc src/collect.ts --outDir build/ --esModuleInterop true --resolveJsonModule true
fi

# Run the script
node build/collect.js