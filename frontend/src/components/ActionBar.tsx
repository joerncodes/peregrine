import OpenInNewTabButton from "./buttons/OpenInNewTabButton";
import type { ImageMeta } from "../@types/ImageMeta";
import DownloadButton from "./buttons/DownloadButton";
import CopyToClipboardButton from "./buttons/CopyToClipboardButton";
import CopyURLToClipboardButton from "./buttons/CopyURLToClipboardButton";
import DeleteButton from "./buttons/DeleteButton";
import EditButton from "./buttons/EditButton";
import type { ActionButtonProps } from "./buttons/ActionButton";

export default function ActionBar({
  image,
  uploading,
  variant = "default",
  onEdit
}: {
  image: ImageMeta;
  uploading: boolean;
  variant?: ActionButtonProps["variant"];
  onEdit?: (image: ImageMeta) => void;
}) {
  return (
    <div className="flex-wrap flex max-w-full justify-center items-center group w-full md:w-3/4">
      {onEdit && (
        <EditButton
          variant={variant}
          image={image}
          uploading={uploading}
          onEdit={onEdit}
        />
      )}
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
