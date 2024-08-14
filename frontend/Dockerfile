# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache g++ make libc6-compat

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies (including dev dependencies needed for the build)
RUN npm ci

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Remove unnecessary files and dev dependencies after build
RUN npm prune --production && \
    rm -rf /app/src /app/tests /app/.next/cache /app/node_modules/.cache

# Stage 2: Final production image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]

# Stage 3: Development image
FROM base AS dev

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
