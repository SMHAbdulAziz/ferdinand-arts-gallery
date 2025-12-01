# Ferdinand Arts Foundation - Frontend Docker Image
# Multi-stage build for optimized production deployment

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci && npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all frontend source files
COPY frontend ./

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 ferdinand && \
    adduser --system --uid 1001 ferdinand

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy standalone build (includes server and dependencies)
COPY --from=builder --chown=ferdinand:ferdinand /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=ferdinand:ferdinand /app/.next/static ./.next/static

# Copy public folder (images, assets, etc.)
COPY --from=builder --chown=ferdinand:ferdinand /app/public ./public

# Copy healthcheck file
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Change to non-root user
USER ferdinand

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the standalone server
CMD ["node", "server.js"]