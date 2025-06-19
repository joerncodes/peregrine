import type { ImageMeta } from "@/@types/ImageMeta";

export default function canCopyToClipboard(image: ImageMeta) {
  return image.dimensions.format.toLowerCase() !== "gif" && window.isSecureContext;
}