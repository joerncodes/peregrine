import { toast } from "sonner";
import type { ImageMeta } from "../../@types/ImageMeta";
import ActionButton, { type ActionButtonProps } from "./ActionButton";
import { TrashIcon } from "lucide-react";

export default function DeleteButton({
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
      await fetch(`/api/image/${image.id}`, {
        method: "DELETE",
      });
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  }
  return (
    <ActionButton
      icon={<TrashIcon />}
      onClick={onClick}
      disabled={uploading}
      tooltip="Delete"
      variant={variant}
      size="icon"
    />
  );
}
