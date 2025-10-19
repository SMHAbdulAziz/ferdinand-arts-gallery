FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install all dependencies (including dev dependencies needed for build)
RUN cd frontend && npm ci

# Copy application code
COPY frontend ./frontend

# Build the application
RUN cd frontend && npm run build

# Remove dev dependencies after build
RUN cd frontend && npm prune --production

# Expose port (Railway will set the PORT env var)
EXPOSE $PORT

# Start the application with Railway's PORT
CMD ["sh", "-c", "cd frontend && npm start -- -p $PORT"]