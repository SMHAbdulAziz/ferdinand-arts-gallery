FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd frontend && npm ci --only=production

# Copy application code
COPY frontend ./frontend

# Build the application
RUN cd frontend && npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "cd frontend && npm start"]