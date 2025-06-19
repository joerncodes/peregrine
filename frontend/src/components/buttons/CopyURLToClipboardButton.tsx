import { toast } from "sonner";
import { LinkIcon } from "lucide-react";
import type { ImageMeta } from "../../@types/ImageMeta";
import ActionButton, { type ActionButtonProps } from "./ActionButton";

export default function CopyURLToClipboardButton({
  image,
  uploading,
  variant,
}: {
  image: ImageMeta;
  uploading: boolean;
  variant: ActionButtonProps["variant"];
}) {
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + image.filePath
      );
      toast.success("Image URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  }

  return (
    <ActionButton
      icon={<LinkIcon />}
      onClick={onClick}
      disabled={uploading}
      tooltip="Copy URL"
      variant={variant}
      size="icon"
    />
  );
}
