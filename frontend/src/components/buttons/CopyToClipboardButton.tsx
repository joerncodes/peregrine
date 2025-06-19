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
  let tooltip = "Copy to clipboard";
  if (image.dimensions.format.toLowerCase() === "gif")
    tooltip = "GIFs cannot be copied to clipboard";
  if (!window.isSecureContext)
    tooltip = "Copying images requires HTTPS or localhost";

  const disabled =
    uploading ||
    image.dimensions.format.toLowerCase() === "gif" ||
    !window.isSecureContext;

  return (
    <ActionButton
      icon={<ClipboardIcon />}
      onClick={() => imageToClipboard(image, () => {})}
      disabled={disabled}
      tooltip={tooltip}
      variant={variant}
      size="icon"
    />
  );
}
