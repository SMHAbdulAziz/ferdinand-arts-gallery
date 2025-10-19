FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install all dependencies
RUN cd frontend && npm install

# Copy application code
COPY frontend ./frontend

# Build the application
RUN cd frontend && npm run build

# Remove dev dependencies after build
RUN cd frontend && npm prune --production

# Expose port
EXPOSE 3000

# Use the standalone server instead of next start
WORKDIR /app/frontend
CMD ["node", ".next/standalone/server.js"]