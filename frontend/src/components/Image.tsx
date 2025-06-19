import type { ImageMeta } from "@/@types/ImageMeta";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ActionBar from "./ActionBar";
import imageToClipboard from "@/lib/imageToClipboard";
import canCopyToClipboard from "@/lib/canCopyToClipboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Image({
  image,
  onEdit,
}: {
  image: ImageMeta;
  onEdit?: (image: ImageMeta) => void;
}) {
  const size = (image.dimensions.size / 1024 / 1024).toFixed(2);
  const canCopy = canCopyToClipboard(image);
  return (
    <Card className="pt-0 overflow-hidden bg-peregrine-secondary">
      <CardHeader className="p-0">
        <CardTitle className="sr-only"> {image.title}</CardTitle>
        <img
          onClick={() => {
            if (canCopyToClipboard(image)) {
              imageToClipboard(image, () => {
                toast.success("Image copied to clipboard");
              });
            } else {
              toast.error("Cannot copy to clipboard", {
                description:
                  "Copying images requires HTTPS or localhost. Also, GIFs cannot be copied to clipboard.",
              });
            }
          }}
          className={cn(
            "w-full h-auto hover:scale-103 transition-all duration-100",
            canCopy ? "cursor-pointer" : "cursor-not-allowed"
          )}
          src={image.filePath}
          alt={image.title}
        />
      </CardHeader>
      <CardContent className="text-white">
        <p className="text-md font-bold">{image.title}</p>
        <p className="text-sm text-muted">{image.description}</p>
        <p className="text-sm">
          {image.dimensions.format} &bull; {size} MB
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center group">
        <ActionBar
          image={image}
          uploading={false}
          variant="ghost"
          onEdit={onEdit}
        />
      </CardFooter>
    </Card>
  );
}
