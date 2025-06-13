import type { ImageMeta } from "@/@types/ImageMeta";

export default function Image({
  image,
  onClick,
}: {
  image: ImageMeta;
  onClick?: () => void;
}) {
  return (
    <figure>
      <img
        onClick={onClick}
        className="rounded-lg border-2 border-slate-600 hover:scale-103 cursor-pointer transition-all duration-100"
        src={image.filePath}
        alt={image.title}
        style={{ width: "250px", height: "250px", objectFit: "cover" }}
      />
      <figcaption className="text-sm text-slate-500 text-center">
        {image.title}
      </figcaption>
    </figure>
  );
}
