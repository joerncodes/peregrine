export type ImageMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  filePath: string;
  dimensions: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  createdAt: string;
};
