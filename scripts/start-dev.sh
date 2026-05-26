#!/usr/bin/env bash

set -e

echo "Starting FlowDesk Development Environment..."

# Ensure services are running
docker-compose up -d

# Run dev script
npm run dev --workspace=backend
