import { DownloadIcon } from "lucide-react";
import type { ImageMeta } from "../../@types/ImageMeta";
import ActionButton, { type ActionButtonProps } from "./ActionButton";

export default function DownloadButton({
  image,
  uploading,
  variant
}: {
  image: ImageMeta;
  uploading: boolean;
  variant: ActionButtonProps["variant"];
}) {
  const onClick = () => {
    const a = document.createElement("a");
    a.href = image.filePath;
    a.download = image.title;
    a.click();
  };
  return (
    <ActionButton
      icon={<DownloadIcon />}
      onClick={onClick}
      disabled={uploading}
      tooltip="Download"
      variant={variant}
      size="icon"
    />
  );
}
