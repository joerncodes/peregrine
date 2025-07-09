# Peregrine Project Overview

## Purpose
Peregrine is a modern, self-hosted image library application that provides a lightning-fast, beautiful web interface for uploading, searching, and managing images. Built for users who want complete control over their image collections without relying on third-party services.

## Key Features

### Image Upload
- **Multiple Upload Methods**: Drag-and-drop, file picker, and clipboard paste
- **Batch Upload**: Upload multiple images simultaneously
- **Format Support**: Supports various image formats (JPEG, PNG, WebP, GIF, etc.)
- **Automatic Processing**: Images are processed with Sharp for metadata extraction

### Search & Discovery
- **Instant Search**: Lightning-fast, typo-tolerant search powered by Meilisearch
- **Full-text Search**: Search across titles, descriptions, and tags
- **Real-time Results**: Search results update as you type
- **Sortable Results**: Results sorted by creation date (newest first)

### Image Management
- **Metadata Editing**: Edit titles, descriptions, and tags
- **Quick Actions**: Copy to clipboard, download, open in new tab
- **Batch Operations**: Delete multiple images
- **Responsive Grid**: Masonry-style layout that adapts to screen size

### User Experience
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Custom Branding**: Peregrine-themed colors and typography
- **Progress Feedback**: Real-time upload progress and success notifications
- **Accessibility**: Keyboard navigation and screen reader support

## Technical Highlights
- **Self-Hosted**: Complete control over your data and infrastructure
- **Containerized**: Docker-based deployment for easy setup
- **Scalable**: Designed to handle large image collections efficiently
- **Fast**: Optimized for performance with modern web technologies

## Related Topics
- [[Peregrine Architecture]]
- [[Backend API Documentation]]
- [[Frontend Components]]
- [[Development Setup]]
- [[Deployment Guide]]