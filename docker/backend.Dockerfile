FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy workspace package files
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci

# Copy source
COPY backend/ ./backend/

# Generate Prisma Client
RUN npm run prisma:generate --workspace=backend

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
