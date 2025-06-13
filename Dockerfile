FROM node:20 AS build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./   
RUN yarn install
COPY frontend/ .
RUN yarn run build

# Prepare backend
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install
COPY backend/ .

# Final stage
FROM nginx:alpine
WORKDIR /app

# Create images directory and set permissions
RUN mkdir -p /app/public/images && chmod 777 /app/public/images

# Copy built frontend
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy backend
COPY --from=build /app/backend /app/backend

# Install Node.js for backend
RUN apk add --no-cache nodejs npm

# Start backend and nginx
CMD ["sh", "-c", "node /app/backend/index.js & nginx -g 'daemon off;'"]
