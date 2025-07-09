# 2025-07-09 Bug Fix: Multiple Image Uploads on Clipboard Paste

## Issue Description
When users pasted an image from clipboard, 4 identical images would be created instead of 1. This was causing unnecessary duplicates and storage waste.

## Root Cause
The paste event listener was added directly to the `window` object without proper React lifecycle management:

```javascript
// BAD - outside useEffect, no cleanup
window.addEventListener("paste", async (event) => {
  // ... paste logic
});
```

This caused:
- Multiple listeners to accumulate on every component re-render
- No cleanup of old listeners
- If component rendered 4 times → 4 listeners → 4 uploads per paste

## Solution Implemented
Moved the paste listener into a proper `useEffect` hook with cleanup:

```javascript
// GOOD - proper React lifecycle management
useEffect(() => {
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      await handleUpload(files);
    }
  };

  window.addEventListener("paste", handlePaste);
  return () => {
    window.removeEventListener("paste", handlePaste);
  };
}, [handleUpload]);
```

## Key Improvements
✅ **Proper cleanup** - removes old listeners on component re-render
✅ **Single listener** - only one active paste listener at a time
✅ **TypeScript typing** - `ClipboardEvent` instead of generic `Event`
✅ **Dependency array** - updates when `handleUpload` changes
✅ **Correct positioning** - after `handleUpload` declaration to avoid linter errors

## Results
- **Before**: 1 paste → 4 identical images
- **After**: 1 paste → 1 image ✅

## Files Modified
- `frontend/src/App.tsx` - Fixed paste event listener implementation

## Date Fixed
January 2025

## Related Issues
- [[2025-07-09 Bug Fix: Unique ID Generation for Image Uploads]]

## Related Topics
- [[2025-07-09 Frontend Components]]
- [[2025-07-09 Peregrine Architecture]]
- [[2025-07-09 Development Setup]]