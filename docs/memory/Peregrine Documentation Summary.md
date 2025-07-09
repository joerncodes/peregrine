# Peregrine Documentation Summary

## Documentation Overview
This knowledge base contains comprehensive documentation for the Peregrine project, a modern self-hosted image library application. The documentation is organized into interconnected topics covering all aspects of the project.

## Available Documentation

### Core Documentation
- **[[Peregrine Project Overview]]** - Purpose, features, and key highlights
- **[[Peregrine Architecture]]** - System architecture, tech stack, and data flow
- **[[Backend API Documentation]]** - Complete API reference and implementation details
- **[[Frontend Components]]** - React components, utilities, and UI architecture
- **[[Development Setup]]** - Local development environment and workflow
- **[[Deployment Guide]]** - Production deployment with Docker and CI/CD

## Key Project Insights

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Sharp + Multer
- **Search**: Meilisearch for instant, typo-tolerant search
- **Infrastructure**: Docker + nginx + Docker Compose

### Core Features
- **Multi-method Upload**: Drag-and-drop, file picker, clipboard paste
- **Instant Search**: Lightning-fast search with typo tolerance
- **Image Management**: Comprehensive metadata editing and image operations
- **Self-hosted**: Complete control over data and infrastructure
- **Modern UI**: Responsive, accessible design with custom theming

### Architecture Highlights
- **Full-stack separation**: Clear frontend/backend boundaries
- **RESTful API**: Well-defined endpoints for all operations
- **File processing**: Sharp for metadata extraction and image optimization
- **Search integration**: Meilisearch for advanced search capabilities
- **Containerized deployment**: Docker-based production setup

### Development Features
- **TypeScript**: Full type safety across the codebase
- **Modern tooling**: Vite for fast development, ESLint/Prettier for code quality
- **Component architecture**: Reusable React components with shadcn/ui
- **State management**: React hooks for efficient state handling

## Getting Started Quick Reference

### Development Setup
```bash
# Clone and install
git clone <repo-url> && cd peregrine
yarn install

# Start services
docker-compose up -d meilisearch
yarn server    # Terminal 1
yarn frontend  # Terminal 2
```

### Production Deployment
```bash
# Docker Compose deployment
docker-compose up -d

# Access application
# http://localhost:3033
```

## API Quick Reference
- `POST /upload` - Upload images
- `GET /search?q=query` - Search images
- `PATCH /image/:id` - Update metadata
- `DELETE /image/:id` - Delete image
- `GET /images/:filename` - Serve image files

## File Structure
```
peregrine/
├── backend/         # Express API server
├── frontend/        # React application
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── docs/memory/     # This documentation
```

## Related Resources
- **Repository**: Original codebase and version control
- **README.md**: Quick start guide and basic information
- **Docker Hub**: Container images for deployment
- **GitHub Actions**: Automated CI/CD pipeline

## Contributing
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation when making changes
- Follow semantic versioning for releases

## Support and Maintenance
- Monitor application logs for issues
- Regular backup of images and Meilisearch data
- Keep dependencies updated for security
- Scale resources based on usage patterns

This documentation provides a complete reference for understanding, developing, and deploying the Peregrine image library application.