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

# Expose the port that Railway will assign
EXPOSE 3000

# Use a simpler start command that works with Railway
WORKDIR /app/frontend
CMD ["npm", "start"]