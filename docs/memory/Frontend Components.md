# Frontend Components

## Overview
The Peregrine frontend is built with React 19 and TypeScript, featuring a modern component-based architecture with responsive design and user-friendly interactions.

## Core Components

### App.tsx
**Purpose**: Main application component and state management
**Key Features**:
- Global state management (images, search, upload status)
- Drag-and-drop file handling
- Paste-from-clipboard functionality
- Image upload orchestration
- Search integration

**State Management**:
```typescript
const [loaded, setLoaded] = useState(false);
const [images, setImages] = useState<ImageMeta[]>([]);
const [search, setSearch] = useState("");
const [selectedImage, setSelectedImage] = useState<ImageMeta | null>(null);
const [showDropzoneOverlay, setShowDropzoneOverlay] = useState(false);
const [uploading, setUploading] = useState(false);
```

### Header.tsx
**Purpose**: Top navigation with search and upload functionality
**Features**:
- Peregrine logo and branding
- Search input with real-time filtering
- Upload button with file picker
- Responsive layout (mobile-friendly)

**Props Interface**:
```typescript
interface HeaderProps {
  loaded: boolean;
  uploading: boolean;
  setSearch: (search: string) => void;
  onUpload: (files: FileList) => void;
}
```

### Image.tsx
**Purpose**: Individual image display component
**Features**:
- Image thumbnail with hover effects
- Click-to-copy functionality
- Metadata display (title, description, file size)
- Action buttons integration
- Responsive design

**Key Functionality**:
```typescript
const canCopy = canCopyToClipboard(image);
// Handles clipboard copy with security context checks
```

### ImageSheet.tsx
**Purpose**: Modal for image metadata editing
**Features**:
- Full-size image display
- Form-based metadata editing
- Title, description, and tags management
- Save functionality with API integration
- Responsive modal design

**Form Integration**:
```typescript
const form = useForm({
  defaultValues: {
    title: image?.title,
    description: image?.description,
    tags: image?.tags,
  },
});
```

### ActionBar.tsx
**Purpose**: Collection of action buttons for image operations
**Features**:
- Edit button (opens ImageSheet)
- Open in new tab
- Download functionality
- Copy to clipboard
- Copy URL to clipboard
- Delete functionality

**Button Components**:
- EditButton
- OpenInNewTabButton
- DownloadButton
- CopyToClipboardButton
- CopyURLToClipboardButton
- DeleteButton

## Utility Components

### ActionButton.tsx
**Purpose**: Base component for action buttons
**Features**:
- Consistent styling and behavior
- Tooltip integration
- Disabled state handling
- Variant support (secondary, ghost, destructive, etc.)

### ImageMetaData.tsx
**Purpose**: Display image metadata information
**Features**:
- File format, size, dimensions
- Creation date
- Structured data presentation

## UI Components (shadcn/ui)

### Form Components
- **Input**: Text input with validation styling
- **Textarea**: Multi-line text input
- **Label**: Form field labels
- **Button**: Various button styles and variants
- **Form**: Form wrapper with validation

### Layout Components
- **Card**: Container for image and metadata
- **Sheet**: Modal/drawer for image editing
- **Alert**: Information and error messages
- **Tooltip**: Hover information

### Utility Components
- **Toaster**: Toast notifications (using Sonner)
- **Dropzone**: File drag-and-drop functionality

## TypeScript Interfaces

### ImageMeta
```typescript
export type ImageMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  filePath: string;
  dimensions: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  createdAt: string;
};
```

### ActionButtonProps
```typescript
export type ActionButtonProps = {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  variant: "secondary" | "ghost" | "link" | "default" | "destructive" | "outline";
  size: "sm" | "lg" | "icon" | "default";
};
```

## Utility Functions

### Image Operations
- **canCopyToClipboard**: Checks if image can be copied (not GIF, secure context)
- **imageToClipboard**: Copies image to system clipboard
- **imageDownload**: Downloads image to user's device

### Styling Utilities
- **cn**: Combines and merges Tailwind classes
- **clsx**: Conditional class name utility
- **twMerge**: Tailwind-aware class merging

## Styling and Design

### Theme Colors
- **Primary**: Main brand color
- **Secondary**: Accent color
- **Background**: Gradient background
- **Text**: High contrast text colors

### Custom Fonts
- **Limelight**: Display font for headings
- **Open Sans**: Body text font

### Responsive Design
- **Mobile-first**: Responsive grid layout
- **Breakpoints**: xs, sm, md, lg, xl, 2xl
- **Grid System**: 2-8 columns based on screen size

## State Management Patterns

### Upload Flow
1. User initiates upload (drag, click, paste)
2. `handleUpload` function processes files
3. Upload state prevents interactions
4. Success/error notifications via toast
5. Image list refresh after completion

### Search Flow
1. User types in search input
2. `setSearch` updates state
3. `useEffect` triggers API call
4. Results update image grid
5. Loading states managed during search

## Performance Considerations
- **React 19**: Latest React features and optimizations
- **Lazy Loading**: Images loaded as needed
- **Memoization**: Prevent unnecessary re-renders
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: For large image collections

## Related Topics
- [[Peregrine Project Overview]]
- [[Peregrine Architecture]]
- [[Backend API Documentation]]
- [[Development Setup]]
- [[Deployment Guide]]