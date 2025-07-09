# Deployment Guide

## Overview
Peregrine supports multiple deployment methods, from simple development setup to production-ready containerized deployment with Docker.

## Docker Deployment (Recommended)

### Single Container Deployment
```bash
# Build the Docker image
docker build -t peregrine .

# Run the container
docker run -p 3033:80 \
  -e MEILI_HOST=http://meilisearch:7700 \
  -e MEILI_MASTER_KEY=supersecretkey \
  -v /path/to/images:/app/public/images \
  peregrine
```

### Docker Compose Deployment
```yaml
# docker-compose.yml
version: "3.8"
services:
  peregrine:
    build: .
    ports:
      - "3033:80"
    environment:
      - VITE_API_URL=http://localhost:3001
      - MEILI_HOST=http://meilisearch:7700
      - MEILI_MASTER_KEY=supersecretkey
    volumes:
      - /path/to/your/images:/app/public/images
    depends_on:
      - meilisearch

  meilisearch:
    image: getmeili/meilisearch:v1.7
    ports:
      - "7700:7700"
    volumes:
      - meili_data:/meili_data
    environment:
      - MEILI_MASTER_KEY=supersecretkey

volumes:
  meili_data:
```

**Deploy Command**:
```bash
docker-compose up -d
```

## Dockerfile Structure

### Multi-Stage Build
```dockerfile
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
```

## Nginx Configuration

### Reverse Proxy Setup
```nginx
# nginx.conf
client_max_body_size 100M;

server {
  listen 80;
  client_max_body_size 100M;

  # API proxy
  location /api/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_request_buffering off;
  }

  # Image serving
  location /images/ {
    alias /app/public/images/;
    try_files $uri =404;
  }

  # Frontend static files
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri /index.html;
  }
}
```

## GitHub Actions CI/CD

### Automated Docker Builds
```yaml
# .github/workflows/docker.yml
name: Create and publish a Docker image

on:
  push:
    branches: ['main']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      attestations: write
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to the Container registry
        uses: docker/login-action@65b78e6e13532edd9afa3aa52ac7964289d1a9c1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@9ec57ed1fcdbf14dcef7dfbe97b2010124a938b7
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=raw,value=latest

      - name: Build and push Docker image
        id: push
        uses: docker/build-push-action@f2a1d5e99d037542a71f64918e516c093c6f3fc4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Generate artifact attestation
        uses: actions/attest-build-provenance@v2
        with:
          subject-name: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME}}
          subject-digest: ${{ steps.push.outputs.digest }}
          push-to-registry: true
```

## Production Configuration

### Environment Variables
```bash
# Required for production
MEILI_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=your-secure-master-key
IMAGES_DIR=/app/public/images

# Optional
VITE_API_URL=https://your-domain.com
```

### Volume Mounts
```yaml
volumes:
  # Persistent image storage
  - /host/path/to/images:/app/public/images
  
  # Meilisearch data persistence
  - meili_data:/meili_data
```

### Security Considerations
- **Change default Meilisearch master key**
- **Use HTTPS in production**
- **Implement proper backup strategy**
- **Set up monitoring and logging**
- **Configure firewall rules**

## Scaling Options

### Horizontal Scaling
- **Load Balancer**: nginx or cloud load balancer
- **Multiple Instances**: Scale backend containers
- **Shared Storage**: Network-attached storage for images
- **Database**: Consider PostgreSQL for metadata

### Vertical Scaling
- **CPU/Memory**: Increase container resources
- **Storage**: Fast SSD storage for images
- **Network**: High-bandwidth connections

## Monitoring and Logging

### Health Checks
```bash
# Application health
curl http://localhost:3033/api/

# Meilisearch health
curl http://localhost:7700/health

# Container status
docker ps
docker logs peregrine_peregrine_1
```

### Log Management
```bash
# View application logs
docker-compose logs -f peregrine

# View Meilisearch logs
docker-compose logs -f meilisearch

# Persistent logging
docker-compose logs --tail=100 -f > peregrine.log
```

## Backup Strategy

### Image Backup
```bash
# Backup images directory
tar -czf images-backup-$(date +%Y%m%d).tar.gz /path/to/images

# Restore images
tar -xzf images-backup-20240115.tar.gz -C /path/to/restore
```

### Meilisearch Backup
```bash
# Backup Meilisearch data
docker run --rm -v meili_data:/data -v $(pwd):/backup \
  busybox tar -czf /backup/meili-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore Meilisearch data
docker run --rm -v meili_data:/data -v $(pwd):/backup \
  busybox tar -xzf /backup/meili-backup-20240115.tar.gz -C /data
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3033, 3001, 7700 are available
2. **Permission errors**: Ensure image directory has correct permissions
3. **Memory issues**: Increase container memory limits
4. **Network issues**: Check Docker network configuration

### Debug Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs peregrine
docker-compose logs meilisearch

# Execute commands in container
docker-compose exec peregrine sh

# Check resource usage
docker stats
```

## Related Topics
- [[Peregrine Project Overview]]
- [[Peregrine Architecture]]
- [[Backend API Documentation]]
- [[Frontend Components]]
- [[Development Setup]]