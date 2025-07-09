# Development Setup

## Prerequisites
- **Node.js**: v18+ recommended
- **Yarn**: Package manager
- **Docker**: For Meilisearch and containerization
- **Git**: Version control

## Project Structure
```
peregrine/
├── backend/              # Express.js API server
│   ├── index.js         # Main server file
│   ├── package.json     # Backend dependencies
│   └── yarn.lock        # Dependency lock file
├── frontend/            # React application
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   ├── lib/         # Utility functions
│   │   ├── @types/      # TypeScript definitions
│   │   └── assets/      # Static assets
│   ├── public/          # Public assets
│   ├── package.json     # Frontend dependencies
│   └── vite.config.ts   # Vite configuration
├── docker-compose.yml   # Multi-service orchestration
├── Dockerfile          # Container build instructions
├── nginx.conf          # Nginx configuration
└── package.json        # Root project configuration
```

## Development Commands

### Root Level Commands
```bash
# Install all dependencies
yarn install

# Start frontend development server
yarn frontend

# Start backend development server
yarn server

# Start Meilisearch only
yarn search

# Code formatting
yarn prettier

# Linting
yarn lint
```

### Frontend Commands
```bash
cd frontend/

# Start development server
yarn dev                # http://localhost:5173

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn lint

# Format code
yarn prettier
```

### Backend Commands
```bash
cd backend/

# Start development server (with nodemon)
yarn dev                # http://localhost:3001

# Start production server
yarn start

# Linting
yarn lint

# Format code
yarn prettier
```

## Environment Setup

### Development Environment Variables
Create `.env` files as needed:

**Backend (.env)**:
```bash
IMAGES_DIR="/app/public/images"
MEILI_HOST="http://localhost:7700"
MEILI_MASTER_KEY="supersecretkey"
```

**Frontend (.env)**:
```bash
VITE_API_URL="http://localhost:3001"
VITE_MEILI_MASTER_KEY="supersecretkey"
```

### Meilisearch Setup
```bash
# Start Meilisearch with Docker Compose
docker-compose up -d meilisearch

# Or use the npm script
yarn search
```

## Development Workflow

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd peregrine

# Install dependencies
yarn install

# Start Meilisearch
docker-compose up -d meilisearch
```

### 2. Start Development Servers
```bash
# Terminal 1: Backend
yarn server

# Terminal 2: Frontend
yarn frontend

# Terminal 3: Meilisearch (if not using Docker)
yarn search
```

### 3. Development URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Meilisearch**: http://localhost:7700

## Code Quality Tools

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

## Debugging

### Backend Debugging
```bash
# Enable debug logging
DEBUG=* yarn dev

# Check Meilisearch connection
curl http://localhost:7700/health

# View uploaded images
ls -la /app/public/images/
```

### Frontend Debugging
- **React Developer Tools**: Browser extension
- **Browser DevTools**: Network tab for API calls
- **Console**: Error messages and debug logs

### Common Issues
1. **Port conflicts**: Change ports in configuration
2. **CORS errors**: Check backend CORS settings
3. **File upload failures**: Check directory permissions
4. **Search not working**: Verify Meilisearch is running

## Testing

### Manual Testing Checklist
- [ ] Image upload via drag-and-drop
- [ ] Image upload via file picker
- [ ] Image upload via clipboard paste
- [ ] Search functionality
- [ ] Metadata editing
- [ ] Image actions (download, copy, delete)
- [ ] Responsive design

### API Testing
```bash
# Test upload
curl -X POST -F "image=@test.jpg" http://localhost:3001/upload

# Test search
curl "http://localhost:3001/search?q=test"

# Test health check
curl http://localhost:3001/
```

## Related Topics
- [[Peregrine Project Overview]]
- [[Peregrine Architecture]]
- [[Backend API Documentation]]
- [[Frontend Components]]
- [[Deployment Guide]]