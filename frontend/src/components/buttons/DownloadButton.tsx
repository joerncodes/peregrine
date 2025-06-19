import { DownloadIcon } from "lucide-react";
import type { ImageMeta } from "../../@types/ImageMeta";
import ActionButton, { type ActionButtonProps } from "./ActionButton";
import imageDownload from "@/lib/imageDownload";

export default function DownloadButton({
  image,
  uploading,
  variant
}: {
  image: ImageMeta;
  uploading: boolean;
  variant: ActionButtonProps["variant"];
}) {
  return (
    <ActionButton
      icon={<DownloadIcon />}
      onClick={() => imageDownload(image)}
      disabled={uploading}
      tooltip="Download"
      variant={variant}
      size="icon"
    />
  );
}
