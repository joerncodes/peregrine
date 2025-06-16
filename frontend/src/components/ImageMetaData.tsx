import type { ImageMeta } from "../@types/ImageMeta";

export type ImageMetaDataProps = {
  dimensions: ImageMeta['dimensions']
}
export default function ImageMetaData({ dimensions }: ImageMetaDataProps) {
  const { width, height, format, size } = dimensions;
  const sizeInMB = size / 1024 / 1024;
  return (
      <table>
        <tbody>
          <tr>
            <th className="text-left pr-4">Width</th>
            <td>{width} px</td>
          </tr>
          <tr>
            <th className="text-left pr-4">Height</th>
            <td>{height} px</td>
          </tr>
          <tr>
            <th className="text-left pr-4">Format</th>
            <td>{format}</td>
          </tr>
          <tr>
            <th className="text-left pr-4">Size</th>
            <td>{sizeInMB.toFixed(2)} MB</td>
          </tr>
        </tbody>
      </table>
  );
}
