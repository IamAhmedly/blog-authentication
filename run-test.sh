#!/bin/bash

# Get the container ID
CONTAINER_ID=$(docker ps -aqf name=node-app-auth)

# Run the test command inside the container
docker exec -t -w /backend-app "$CONTAINER_ID" npm run test:app