#!/usr/bin/env bash

echo "Copying ML configuration to local machine..."

# Try to copy without sudo first
cp ./config.toml /etc/gorse/config.toml 2>/dev/null

# If cp command fails, ask for sudo
if [ $? -ne 0 ]; then
    echo "Permission denied to copy file. Attempting to run as admin..."
    sudo mkdir /etc
    sudo mkdir /etc/gorse
    sudo cp ./config.toml /etc/gorse/config.toml
fi

echo "Starting background workers..."

s_compose="docker-compose --env-file .env.local"
$s_compose rm && $s_compose up

npm i && npm i -g dotenv-cli && npm run dev
