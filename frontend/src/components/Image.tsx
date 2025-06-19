import type { ImageMeta } from "@/@types/ImageMeta";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ActionBar from "./ActionBar";

export default function Image({
  image,
  onClick,
}: {
  image: ImageMeta;
  onClick?: () => void;
}) {
  const size = (image.dimensions.size / 1024 / 1024).toFixed(2);
  return (
    <Card className="pt-0 overflow-hidden bg-peregrine-secondary">
      <CardHeader className="p-0">
        <CardTitle className="sr-only"> {image.title}</CardTitle>
        <img
          onClick={onClick}
          className="w-full h-auto hover:scale-103 cursor-pointer transition-all duration-100"
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
        <ActionBar image={image} uploading={false} variant="ghost" />
      </CardFooter>
    </Card>
  );
}
