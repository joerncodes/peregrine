import type { ImageMeta } from "@/@types/ImageMeta";
import { toast } from "sonner";

export default async function imageToClipboard(image: ImageMeta, callback?: () => void) {
  try {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = image.filePath;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new window.ClipboardItem({
                "image/png": blob,
              }),
            ]);
            toast.success("Image copied to clipboard");
            if (callback) callback();
          } catch (err) {
            toast.error("Failed to copy image. :(");
            console.error("Failed to copy image:", err);
          }
        }
      }, "image/png");
    };

    img.onerror = () => {
      console.error("Failed to load image for copying.");
    };
  } catch (err) {
    console.error("Failed to copy image:", err);
  }
}
