import { EditIcon } from "lucide-react";
import ActionButton from "./ActionButton";
import type { ActionButtonProps } from "./ActionButton";
import type { ImageMeta } from "../../@types/ImageMeta";

interface EditButtonProps {
  image: ImageMeta;
  uploading: boolean;
  variant?: ActionButtonProps["variant"];
  onEdit: (image: ImageMeta) => void;
}

export default function EditButton({
  image,
  uploading,
  variant = "default",
  onEdit,
}: EditButtonProps) {
  return (
    <ActionButton
      icon={<EditIcon className="w-4 h-4" />}
      variant={variant}
      size="icon"
      onClick={() => onEdit(image)}
      disabled={uploading}
      tooltip="Edit image details"
    />
  );
} 