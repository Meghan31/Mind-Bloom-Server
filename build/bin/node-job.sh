#!/bin/bash

# Print debugging information
echo "--- Node.js path diagnostics ---"
which node || echo "which node failed"
ls -la /usr/bin/node* /usr/local/bin/node* 2>/dev/null || echo "No node in standard locations"
echo "PATH environment variable: $PATH"
echo "-------------------------------"
