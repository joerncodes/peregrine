import { ClipboardIcon } from "lucide-react";
import type { ImageMeta } from "../../@types/ImageMeta";
import imageToClipboard from "@/lib/imageToClipboard";
import ActionButton, { type ActionButtonProps } from "./ActionButton";

export default function CopyToClipboardButton({
  image,
  uploading,
  variant,
}: {
  image: ImageMeta;
  uploading: boolean;
  variant: ActionButtonProps["variant"];
}) {
  return (
    <ActionButton
      icon={<ClipboardIcon />}
      onClick={() => imageToClipboard(image, () => {})}
      disabled={uploading}
      tooltip="Copy to clipboard"
      variant={variant}
      size="icon"
    />
  );
}
