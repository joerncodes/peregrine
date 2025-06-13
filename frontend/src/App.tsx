import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import peregrineLogo from "./assets/peregrine.png";
import "./App.css";
import type { ImageMeta } from "./@types/ImageMeta";
import { Input } from "./components/ui/input";
import Image from "./components/Image";
import Dropzone from "shadcn-dropzone";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import ImageSheet from "./components/ImageSheet";
import { InfoIcon, UploadIcon } from "lucide-react";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageMeta | null>(null);
  const [showDropzoneOverlay, setShowDropzoneOverlay] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchImages(search: string = "") {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(search)}`
    );
    const images = await response.json();
    setImages(images);
    setLoaded(true);
  }

  useEffect(() => {
    fetchImages(search);
  }, [search]);

  useEffect(() => {
    let dragCounter = 0;
    const handleDragEnter = (e: Event) => {
      const event = e as unknown as DragEvent;
      dragCounter++;
      if (
        event.dataTransfer &&
        Array.from(event.dataTransfer.types).includes("Files")
      ) {
        setShowDropzoneOverlay(true);
      }
    };
    const handleDragLeave = () => {
      dragCounter--;
      if (dragCounter <= 0) {
        setShowDropzoneOverlay(false);
      }
    };
    const handleDrop = () => {
      dragCounter = 0;
      setShowDropzoneOverlay(false);
    };
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-peregrine-background to-peregrine-highlight/30">
        <header className="bg-gradient-to-r from-peregrine-primary to-peregrine-highlight text-peregrine-text p-8 flex items-center gap-6 shadow-lg rounded-b-2xl mb-8">
          <img
            src={peregrineLogo}
            alt="Peregrine"
            className="w-16 h-16 drop-shadow-lg -rotate-2"
          />
          <h1 className="text-5xl font-extrabold tracking-tight text-center ">
            Peregrine
          </h1>
          <Input
            type="text"
            placeholder="Search images..."
            className="bg-white/80 text-peregrine-primary-dark border-2 border-peregrine-primary focus:border-peregrine-highlight focus:ring-2 focus:ring-peregrine-highlight/50 shadow-md rounded-xl px-4 py-2 transition-all w-full"
            autoFocus
            disabled={!loaded || uploading}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </header>
        <main className="min-h-screen pb-20">
          {/* Dropzone overlay spanning the entire screen */}
          {showDropzoneOverlay && (
            <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
              <Dropzone
                onDrop={async (acceptedFiles: File[]) => {
                  setUploading(true);
                  let successCount = 0;
                  await Promise.all(
                    acceptedFiles.map(async (file) => {
                      if (!file.type.startsWith("image/")) {
                        toast.error(`${file.name} is not an image file`);
                        return;
                      }
                      const formData = new FormData();
                      formData.append("image", file);
                      await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      successCount++;
                    })
                  );
                  setTimeout(() => {
                    if (successCount > 0) {
                      toast.success(
                        `${successCount} image${successCount > 1 ? "s" : ""} uploaded.`
                      );
                    }
                    fetchImages(search);
                    setUploading(false);
                  }, 1000);
                }}
              >
                {() => (
                  <div
                    className="transition-opacity duration-200 fixed inset-0 flex items-center justify-center bg-white/80 border-2 border-dashed border-peregrine-primary pointer-events-auto opacity-100"
                    style={{ zIndex: 30 }}
                  >
                    <div className="flex items-center gap-2 text-peregrine-primary-dark text-xl">
                      <UploadIcon className="w-8 h-8" />
                      Drop files to upload.
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          )}
          {/* End Dropzone overlay */}
          <div
            className={`container mx-auto px-4 ${uploading ? "pointer-events-none opacity-50 select-none" : ""}`}
          >
            {images.length > 0 && (
              <div className="flex justify-center">
                <h2 className="text-md text-peregrine-text/70 text-center mb-6 flex gap-2 items-center">
                  <InfoIcon className="w-4 h-4" />
                  {images.length} images {search ? `for "${search}"` : ""} found
                </h2>
              </div>
            )}
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                  <Image
                    key={image.id}
                    image={image}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-peregrine-text text-lg">
                No images found. ¯\_(ツ)_/¯
                <br />
                Try uploading some.
              </div>
            )}
          </div>
        </main>

        <ImageSheet
          image={selectedImage}
          open={!!selectedImage}
          onOpenChange={(open) => setSelectedImage(open ? selectedImage : null)}
          uploading={uploading}
          onUpdate={() => {
            setTimeout(() => {
              fetchImages(search);
            }, 300);
          }}
        />
        <Toaster />
        {uploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-8 w-8 text-peregrine-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span className="text-peregrine-primary text-lg font-semibold">
                Uploading...
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
