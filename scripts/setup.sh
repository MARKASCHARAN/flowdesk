#!/usr/bin/env bash

set -e

echo "Setting up FlowDesk..."

# 1. Install dependencies
echo "Installing dependencies..."
npm install

# 2. Setup environment variables if they don't exist
if [ ! -f backend/.env ]; then
  echo "Creating backend/.env from example or defaults..."
  cat <<EOF > backend/.env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowdesk?schema=public"
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=refreshsecret
FRONTEND_URL=http://localhost:3000
EOF
fi

# 3. Start backing services
echo "Starting database and redis via docker-compose..."
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 5

# 4. Prisma setup
echo "Generating Prisma Client and running migrations..."
npm run prisma:generate --workspace=backend
npm run prisma:migrate --workspace=backend

echo "Setup complete! You can now run './scripts/start-dev.sh' to start the backend application."
