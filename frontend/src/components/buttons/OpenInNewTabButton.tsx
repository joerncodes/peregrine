import { ZoomInIcon } from "lucide-react";
import type { ImageMeta } from "../../@types/ImageMeta";
import ActionButton, { type ActionButtonProps } from "./ActionButton";

export default function OpenInNewTabButton({
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
      icon={<ZoomInIcon />}
      onClick={() => image && window.open(image.filePath, "_blank")}
      disabled={uploading}
      tooltip="Open in new tab"
      variant={variant}
      size="icon"
    />
  );
}
