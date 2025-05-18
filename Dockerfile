# Use official Node image
FROM node:24-alpine

# Install pnpm globally
RUN corepack enable && \
corepack prepare pnpm@latest --activate && \
apk add --no-cache libc6-compat curl ca-certificates

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY pnpm-lock.yaml ./
COPY package*.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the Next.js app
RUN pnpm build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
