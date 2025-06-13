import { useEffect, useState } from "react";
import peregrineLogo from "./assets/peregrine.png";
import "./App.css";
import type { ImageMeta } from "./@types/ImageMeta";
import SearchFactory from "./search/SearchFactory";
import { Input } from "./components/ui/input";
import Image from "./components/Image";
import Dropzone from "shadcn-dropzone";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { ClipboardIcon, DownloadIcon, ZoomInIcon } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageMeta | null>(null);

  async function fetchImages(search: string = "") {
    const result = await SearchFactory.getInstance()
      .index("images")
      .search(search);
    setImages(result.hits as ImageMeta[]);
    setLoaded(true);
  }

  useEffect(() => {
    fetchImages(search);
  }, [search]);

  return (
    <>
      <header className="bg-peregrine-primary text-peregrine-text p-8 flex items-center gap-4 shadow-md">
        <img src={peregrineLogo} alt="Peregrine" className="w-14 h-14" />
        <h1 className="text-4xl font-bold text-center">Peregrine</h1>
        <Input
          type="text"
          placeholder="Search"
          className="w-full bg-peregrine-background text-peregrine-highlight-dark"
          autoFocus
          disabled={!loaded}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </header>
      <main className="container mx-auto mt-10">
        <div className="grid grid-cols-4 gap-4">
          <Dropzone
            onDrop={async (acceptedFiles: File[]) => {
              await Promise.all(
                acceptedFiles.map(async (file) => {
                  const formData = new FormData();
                  formData.append("image", file);
                  await fetch("http://localhost:3001/upload", {
                    method: "POST",
                    body: formData,
                  });
                })
              );
              toast.success("Images uploaded");
              await fetchImages(search);
            }}
          />
          {images.map((image) => (
            <Image
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </main>

      <Sheet open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <SheetContent className="p-6">
          <SheetHeader>
            <SheetTitle>{selectedImage?.title}</SheetTitle>
          </SheetHeader>
          {selectedImage && (
            <div className="mt-6 space-y-4">
              <img
                src={selectedImage.filePath}
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  title="Zoom"
                  onClick={() =>
                    selectedImage &&
                    window.open(selectedImage.filePath, "_blank")
                  }
                >
                  <ZoomInIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  title="Download"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = selectedImage.filePath;
                    a.download = selectedImage.title;
                    a.click();
                  }}
                >
                  <DownloadIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  title="Copy to clipboard"
                  onClick={async () => {
                    try {
                      const img = new window.Image();
                      img.crossOrigin = "anonymous";
                      img.src = selectedImage.filePath;

                      img.onload = async () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx?.drawImage(img, 0, 0);

                        canvas.toBlob(async (blob) => {
                          if (blob) {
                            try {
                              await navigator.clipboard.write([
                                new window.ClipboardItem({ "image/png": blob }),
                              ]);
                              toast.success("Image copied to clipboard");
                              setSelectedImage(null);
                            } catch (err) {
                              toast.error("Failed to copy image. :(");
                              console.error("Failed to copy image:", err);
                            }
                          }
                        }, "image/png");
                      };

                      img.onerror = () => {
                        console.error("Failed to load image for copying.");
                      };
                    } catch (err) {
                      console.error("Failed to copy image:", err);
                    }
                  }}
                >
                  <ClipboardIcon className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {selectedImage.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Toaster />
    </>
  );
}

export default App;
