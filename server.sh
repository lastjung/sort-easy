#!/bin/bash

# Project Directory
PROJECT_DIR="/Users/eric/PG/sort-easy"
PORT=5181

# Function: Turn On (Simple Foreground Mode)
server_on() {
    cd "$PROJECT_DIR"
    echo "🚀 Starting server on port $PORT..."
    pnpm dev --port $PORT
}

case "$1" in
    on)
        server_on
        ;;
    *)
        server_on
        ;;
esac
