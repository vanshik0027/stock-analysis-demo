#satge 1 biuld the Application
FROM node:18-alpine AS base


FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./

RUN npm update && npm install

#stage 2 final production imgaes
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Prepare for  env fro devopmentr
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8090

ENV PORT 8090
# Use a more efficient command to start the development server
CMD ["npm", "run", "dev"]



# # Stage 1: Build the application
# FROM node:18-alpine AS builder

# # Install build dependencies
# RUN apk add --no-cache g++ make libc6-compat

# # Set the working directory
# WORKDIR /app

# # Copy only package.json and package-lock.json to leverage Docker cache
# COPY package*.json ./

# # Install dependencies (including dev dependencies needed for the build)
# RUN npm ci

# # Copy the application source code
# COPY . .

# # Build the application
# RUN npm run build

# # Remove unnecessary files and dev dependencies after build
# RUN npm prune --production && \
#     rm -rf /app/src /app/tests /app/.next/cache /app/node_modules/.cache

# # Stage 2: Final production image
# FROM node:18-alpine AS production

# # Set the working directory
# WORKDIR /app

# # Copy only the necessary files from the builder stage
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# # Set the environment to production
# ENV NODE_ENV=production

# # Clean up build dependencies and cache files
# RUN apk del g++ make libc6-compat && \
#     rm -rf /var/cache/apk/* /root/.npm /root/.cache /root/.node-gyp

# # Use a more efficient command to start the application
# CMD ["node", "server.js"]

# # Stage 3: Development image
# FROM node:18-alpine AS dev

# # Set the working directory
# WORKDIR /app

# # Set the environment to development
# ENV NODE_ENV=development

# # Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install --silent --no-optional

# # Copy the application source code
# COPY . .

# # Use a more efficient command to start the development server
# CMD ["npm", "run", "dev"]
