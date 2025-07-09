# 2025-07-09 Bug Fix: Unique ID Generation for Image Uploads

## Issue Description
The Peregrine backend was generating non-unique IDs for uploaded images, causing overwrites when:
- Users pasted multiple images from clipboard (generic names like "image.png")
- Users uploaded files with identical names
- Multiple uploads had the same original filename

## Root Cause
The original ID generation logic only used the filename:
```javascript
const title = path.parse(req.file.originalname).name;
const id = slugify(title, { lower: true, remove: /[.]/g });
```

This meant:
- `"vacation.jpg"` → ID: `"vacation"`
- `"vacation.jpg"` (uploaded again) → ID: `"vacation"` (overwrites first)
- `"image.png"` (clipboard paste) → ID: `"image"`
- `"image.png"` (another paste) → ID: `"image"` (overwrites first)

Since Meilisearch uses the ID as the document identifier, documents with identical IDs replace each other instead of creating new entries.

## Solution Implemented
Changed the ID generation to always include timestamp and random suffix:

```javascript
// Always generate unique ID to prevent overwrites
const timestamp = Date.now();
const randomSuffix = Math.random().toString(36).substring(2, 7);
const id = slugify(`${title}-${timestamp}-${randomSuffix}`, { lower: true, remove: /[.]/g });
```

## Results
Now all uploads generate unique IDs:
- `"vacation.jpg"` → `"vacation-1704123456789-abc12"`
- `"vacation.jpg"` (uploaded again) → `"vacation-1704123456890-def34"`
- `"image.png"` (clipboard paste) → `"image-1704123456891-ghi56"`
- `"image.png"` (another paste) → `"image-1704123456892-jkl78"`

## Benefits
✅ **No More Overwrites**: Multiple files with same name create separate entries
✅ **Clipboard Paste Fixed**: Each paste gets unique ID
✅ **Still Human-Readable**: IDs start with original filename
✅ **Chronological**: Timestamp allows sorting by upload time
✅ **URL-Safe**: Slugified for web compatibility

## Files Modified
- `backend/index.js` - Updated upload endpoint ID generation logic

## Date Fixed
January 2025

## Related Topics
- [[2025-07-09 Backend API Documentation]]
- [[2025-07-09 Peregrine Architecture]]
- [[2025-07-09 Development Setup]]