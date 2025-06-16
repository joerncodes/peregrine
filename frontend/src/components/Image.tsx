import type { ImageMeta } from "@/@types/ImageMeta";

export default function Image({
  image,
  onClick,
}: {
  image: ImageMeta;
  onClick?: () => void;
}) {
  return (
    <figure className="flex flex-col items-center gap-1">
      <img
        onClick={onClick}
        className="w-full h-auto rounded-sm border-2 border-transparent hover:border-peregrine-primary-dark/50 hover:scale-103 cursor-pointer transition-all duration-100"
        src={image.filePath}
        alt={image.title}
      />
      <figcaption className="text-sm text-peregrine-primary">
        {image.title}
      </figcaption>
    </figure>
  );
}
