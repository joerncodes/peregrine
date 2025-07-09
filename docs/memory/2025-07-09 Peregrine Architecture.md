# 2025-07-09 Peregrine Architecture

## System Architecture
Peregrine follows a modern full-stack architecture with clear separation of concerns:

### Frontend (React Application)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom Peregrine theme
- **UI Components**: shadcn/ui components for consistent design
- **State Management**: React hooks for local state management
- **Form Handling**: react-hook-form with Zod validation

### Backend (Node.js API)
- **Runtime**: Node.js with Express.js framework
- **File Processing**: Sharp for image metadata extraction
- **File Upload**: Multer for handling multipart/form-data
- **Search Engine**: Meilisearch for instant, typo-tolerant search
- **Storage**: Local filesystem for image files

### Search Engine (Meilisearch)
- **Purpose**: Provides lightning-fast search capabilities
- **Features**: Typo-tolerance, instant results, sortable attributes
- **Index**: "images" index with sortable createdAt field
- **Integration**: REST API communication with backend

### Infrastructure
- **Containerization**: Docker for application packaging
- **Web Server**: nginx for serving static files and API proxying
- **Orchestration**: Docker Compose for multi-service deployment
- **CI/CD**: GitHub Actions for automated Docker builds

## Technology Stack

### Frontend Dependencies
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "typescript": "~5.8.3",
  "vite": "^6.3.5",
  "tailwindcss": "^4.1.10",
  "@radix-ui/react-*": "Various UI primitives",
  "lucide-react": "^0.515.0",
  "sonner": "^2.0.5"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "meilisearch": "^0.51.0",
  "multer": "^2.0.1",
  "sharp": "^0.34.2",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "slugify": "^1.6.6"
}
```

## Data Flow

### Image Upload Process
1. User uploads image via drag-and-drop or file picker
2. Frontend sends multipart/form-data to `/api/upload`
3. Backend processes image with Sharp to extract metadata
4. Image saved to filesystem with random prefix naming
5. Metadata indexed in Meilisearch with generated ID
6. Success response returned to frontend

### Search Process
1. User types search query in frontend
2. Frontend sends GET request to `/api/search?q=query`
3. Backend queries Meilisearch index with search parameters
4. Results returned sorted by creation date (newest first)
5. Frontend renders image grid with results

### Image Management
1. User clicks image to open metadata sheet
2. Frontend loads image details in modal
3. User can edit title, description, tags
4. Changes sent to `/api/image/:id` via PATCH request
5. Backend updates Meilisearch index with new metadata

## Port Configuration
- **Frontend (dev)**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Meilisearch**: http://localhost:7700
- **Production**: http://localhost:3033 (nginx proxy)

## Related Topics
- [[2025-07-09 Peregrine Project Overview]]
- [[2025-07-09 Backend API Documentation]]
- [[2025-07-09 Frontend Components]]
- [[2025-07-09 Development Setup]]
- [[2025-07-09 Deployment Guide]]