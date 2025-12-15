#!/bin/sh
set -e

# Default values
export REACT_APP_SERVER_PROTOCOL=${REACT_APP_SERVER_PROTOCOL:-http}
export REACT_APP_SERVER_IP=${REACT_APP_SERVER_IP:-127.0.0.1}
export REACT_APP_SERVER_PORT=${REACT_APP_SERVER_PORT:-8443}

echo "Injecting runtime config: ${REACT_APP_SERVER_PROTOCOL}://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}"

# Run Node.js script to inject config
node /app/inject-config.js

exec serve -s build "$@"

