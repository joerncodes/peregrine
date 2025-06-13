import { useEffect, useState } from "react";
import peregrineLogo from "./assets/peregrine.png";
import "./App.css";
import type { ImageMeta } from "./@types/ImageMeta";
import SearchFactory from "./search/SearchFactory";
import { Input } from "./components/ui/input";
import Image from "./components/Image";
import Dropzone, { type DropzoneState } from "shadcn-dropzone";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { ClipboardIcon, DownloadIcon, UploadIcon, ZoomInIcon } from "lucide-react";
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
      <div className="bg-gradient-to-br from-peregrine-background to-peregrine-highlight/30">
        <header className="bg-gradient-to-r from-peregrine-primary to-peregrine-highlight text-peregrine-text p-8 flex items-center gap-6 shadow-lg rounded-b-2xl mb-8">
          <img
            src={peregrineLogo}
            alt="Peregrine"
            className="w-16 h-16 drop-shadow-lg"
          />
          <h1 className="text-5xl font-extrabold tracking-tight text-center ">
            Peregrine
          </h1>
          <Input
            type="text"
            placeholder="Search images..."
            className="bg-white/80 text-peregrine-primary-dark border-2 border-peregrine-primary focus:border-peregrine-highlight focus:ring-2 focus:ring-peregrine-highlight/50 shadow-md rounded-xl px-4 py-2 transition-all w-full"
            autoFocus
            disabled={!loaded}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </header>
        <main className="min-h-screen pb-20">
          <div className="container mx-auto">
            <div className="mb-8 flex justify-center">
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
              >
                {(dropzone: DropzoneState) => (
                  <>
                    {dropzone.isDragAccept ? (
                      <div className="rounded-xl border-2 border-dashed border-peregrine-primary bg-white/70 hover:bg-peregrine-highlight/20 transition-all p-8 w-full max-w-2xl shadow-md flex items-center gap-2">
                        <UploadIcon className="w-5 h-5" />
                        Yup, just like this. Now drop the files.
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-peregrine-primary bg-white/70 hover:bg-peregrine-highlight/20 transition-all p-8 w-full max-w-2xl shadow-md flex items-center gap-2">
                        <UploadIcon className="w-5 h-5" />
                        Drop files to upload
                      </div>
                    )}
                  </>
                )}
              </Dropzone>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {images.map((image) => (
                <Image
                  key={image.id}
                  image={image}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        </main>

        <Sheet
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <SheetContent className="p-8 max-w-lg mx-auto bg-white/95 rounded-l-2xl shadow-2xl border-0">
            <SheetHeader>
              <SheetTitle className="text-3xl font-bold text-peregrine-primary mb-2">
                {selectedImage?.title}
              </SheetTitle>
            </SheetHeader>
            {selectedImage && (
              <div className="mt-4 space-y-6">
                <img
                  src={selectedImage.filePath}
                  alt={selectedImage.title}
                  className="w-full rounded-xl shadow-lg border border-peregrine-highlight"
                />
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    title="Zoom"
                    className="hover:bg-peregrine-highlight/40"
                    onClick={() =>
                      selectedImage &&
                      window.open(selectedImage.filePath, "_blank")
                    }
                  >
                    <ZoomInIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    title="Download"
                    className="hover:bg-peregrine-highlight/40"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = selectedImage.filePath;
                      a.download = selectedImage.title;
                      a.click();
                    }}
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    title="Copy to clipboard"
                    className="hover:bg-peregrine-highlight/40"
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
                                  new window.ClipboardItem({
                                    "image/png": blob,
                                  }),
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
                    <ClipboardIcon className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-base text-gray-600 italic">
                    {selectedImage.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-peregrine-highlight/40 text-peregrine-primary-dark rounded-full text-sm font-medium shadow-sm border border-peregrine-primary/20"
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
      </div>
    </>
  );
}

export default App;
