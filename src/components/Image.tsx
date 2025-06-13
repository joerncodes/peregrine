import type { ImageMeta } from "@/@types/ImageMeta";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  ArrowDownOnSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/20/solid";

export default function Image({ image }: { image: ImageMeta }) {
  return (
    <figure>
      <ContextMenu>
        <ContextMenuTrigger>
          <a
            href={image.filePath}
            download={image.title || `image-${image.id}`}
          >
            <img
              className="rounded-lg border-2 border-slate-600 hover:translate-y-[-2px] cursor-pointer transition-all duration-300"
              src={image.filePath}
              alt={image.title}
              style={{ width: "250px", height: "250px" }}
            />
          </a>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <a
              href={image.filePath}
              download={image.title || `image-${image.id}`}
              className="flex items-center gap-2"
            >
              <ArrowDownOnSquareIcon /> Download
            </a>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={async () => {
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
                          new window.ClipboardItem({ "image/png": blob }),
                        ]);
                        console.log("Image copied to clipboard!");
                      } catch (err) {
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
            }}
          >
            <ClipboardDocumentListIcon /> Copy to Clipboard
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <figcaption className="text-sm text-slate-500 text-center">
        {image.title}
      </figcaption>
    </figure>
  );
}
