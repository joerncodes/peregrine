import OpenInNewTabButton from "./buttons/OpenInNewTabButton";
import type { ImageMeta } from "../@types/ImageMeta";
import DownloadButton from "./buttons/DownloadButton";
import CopyToClipboardButton from "./buttons/CopyToClipboardButton";
import CopyURLToClipboardButton from "./buttons/CopyURLToClipboardButton";
import DeleteButton from "./buttons/DeleteButton";
import type { ActionButtonProps } from "./buttons/ActionButton";

export default function ActionBar({
  image,
  uploading,
  variant = "default"
}: {
  image: ImageMeta;
  uploading: boolean;
  variant?: ActionButtonProps["variant"];
}) {
  return (
    <div className="flex-wrap flex max-w-full justify-center items-center group">
      <OpenInNewTabButton variant={variant} image={image} uploading={uploading} />
      <DownloadButton variant={variant} image={image} uploading={uploading} />
      <CopyToClipboardButton
        variant={variant}
        image={image}
        uploading={uploading}
      />
      <CopyURLToClipboardButton variant={variant} image={image} uploading={uploading} />
      <DeleteButton
        variant={variant}
        image={image}
        uploading={uploading}
      />
    </div>
  );
}
