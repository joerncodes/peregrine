# 2025-07-09 Backend API Documentation

## Overview
The Peregrine backend is a Node.js Express application that provides a RESTful API for image management and search functionality.

## Server Configuration
- **Port**: 3001
- **Host**: 0.0.0.0 (binds to all interfaces)
- **CORS**: Enabled for cross-origin requests
- **Body Parser**: JSON parsing enabled

## Environment Variables
```bash
IMAGES_DIR="/app/public/images"  # Image storage directory
MEILI_HOST="http://localhost:7700"  # Meilisearch host
MEILI_MASTER_KEY="supersecretkey"  # Meilisearch API key
```

## API Endpoints

### GET /
**Purpose**: Health check endpoint
**Response**: `{ "message": "Hello World!" }`

### GET /images/:filename
**Purpose**: Serve image files
**Parameters**: 
- `filename` (path) - Name of the image file
**Response**: Binary image data
**Example**: `GET /images/abc123-my-image.jpg`

### POST /upload
**Purpose**: Upload and process new images
**Content-Type**: multipart/form-data
**Body**: 
- `image` (file) - Image file to upload
**Process**:
1. Validate file upload
2. Generate random filename prefix
3. Extract metadata using Sharp
4. Create image document for Meilisearch
5. Index document in Meilisearch
**Response**: 
```json
{
  "message": "Image uploaded successfully",
  "filename": "abc123-my-image.jpg",
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "format": "jpeg",
    "size": 245760
  }
}
```

### GET /search
**Purpose**: Search images in the library
**Query Parameters**: 
- `q` (optional) - Search query string
**Search Configuration**:
- Limit: 1000 results
- Sort: createdAt:desc (newest first)
- Features: Typo-tolerance, instant results
**Response**: Array of image objects
```json
[
  {
    "id": "my-image",
    "title": "My Image",
    "description": "",
    "tags": [],
    "filePath": "/images/abc123-my-image.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "dimensions": {
      "width": 1920,
      "height": 1080,
      "format": "jpeg",
      "size": 245760
    }
  }
]
```

### PATCH /image/:id
**Purpose**: Update image metadata
**Parameters**: 
- `id` (path) - Image ID
**Body**: 
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["tag1", "tag2"]
}
```
**Response**: `{ "message": "Image updated" }`

### DELETE /image/:id
**Purpose**: Delete image from index
**Parameters**: 
- `id` (path) - Image ID
**Response**: `{ "message": "Image deleted" }`
**Note**: Only removes from Meilisearch index, not filesystem

### GET /reset
**Purpose**: Reset entire image library (development only)
**Process**:
1. Delete Meilisearch index
2. Remove all files from images directory
**Response**: `{ "message": "Images reset successful" }`

## Image Processing Pipeline

### File Upload (Multer)
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const randomPrefix = Math.random().toString(36).substring(2, 15);
    const extension = file.mimetype.split("/")[1];
    const originalName = file.originalname || `upload-${Date.now()}`;
    const baseName = path.parse(originalName).name;
    const finalName = randomPrefix + "-" + baseName + "." + extension;
    cb(null, finalName);
  },
});
```

### Metadata Extraction (Sharp)
```javascript
const metadata = await sharp(imagePath).metadata();
// Extracts: width, height, format, channels, density
```

### Document Structure
```javascript
const imageData = {
  id: slugify(title, { lower: true, remove: /[.]/g }),
  title: path.parse(originalname).name,
  description: "",
  filePath: "/images/" + filename,
  createdAt: new Date().toISOString(),
  dimensions: {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: file.size,
  },
};
```

## Meilisearch Integration

### Index Initialization
```javascript
await meilisearch.createIndex("images");
await meilisearch.index("images").updateSortableAttributes(["createdAt"]);
```

### Search Configuration
- **Index Name**: "images"
- **Sortable Attributes**: ["createdAt"]
- **Default Sort**: createdAt:desc
- **Result Limit**: 1000
- **Features**: Typo-tolerance, instant search

## Error Handling
- **Upload Errors**: 400 for no file, 500 for processing failures
- **Search Errors**: Auto-retry with index creation if needed
- **File Serving**: 404 for missing files
- **General**: Proper HTTP status codes and error messages

## Related Topics
- [[2025-07-09 Peregrine Project Overview]]
- [[2025-07-09 Peregrine Architecture]]
- [[2025-07-09 Frontend Components]]
- [[2025-07-09 Development Setup]]
- [[2025-07-09 Deployment Guide]]