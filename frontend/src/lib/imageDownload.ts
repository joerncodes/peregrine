import type { ImageMeta } from "@/@types/ImageMeta";

export default function imageDownload(image: ImageMeta) {
  const a = document.createElement("a");
  a.href = image.filePath;
  a.download = image.title;
  a.click();
}
