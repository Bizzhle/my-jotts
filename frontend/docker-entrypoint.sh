#!/bin/sh
set -e

# Create dynamic config.js from template at container startup
# This allows using runtime environment variables

# Read the template file
TEMPLATE_PATH="/usr/share/nginx/html/config-template.js"
CONFIG_PATH="/usr/share/nginx/html/config.js"

# Check if template exists
if [ -f "$TEMPLATE_PATH" ]; then
  echo "Generating runtime config from environment variables..."
  
  # Use envsubst to replace environment variables in the template
  # and save to config.js
  envsubst < $TEMPLATE_PATH > $CONFIG_PATH
  
  echo "Runtime configuration generated successfully"
else
  echo "Warning: generate-env-config.js not found! Runtime configuration will not be updated."
fi

# Execute the CMD from the Dockerfile
exec "$@"


