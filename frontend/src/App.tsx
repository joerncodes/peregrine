import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import "./App.css";
import type { ImageMeta } from "./@types/ImageMeta";
import Image from "./components/Image";
import Dropzone from "shadcn-dropzone";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import ImageSheet from "./components/ImageSheet";
import { FileQuestionIcon, InfoIcon, UploadIcon } from "lucide-react";
import Header from "./components/Header";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageMeta | null>(null);
  const [showDropzoneOverlay, setShowDropzoneOverlay] = useState(false);
  const [uploading, setUploading] = useState(false);

  window.addEventListener("paste", async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      await handleUpload(files);
    }
  });

  async function fetchImages(search: string = "") {
    const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
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

  // Extract the upload logic into a reusable function
  const handleUpload = async (files: FileList | File[]) => {
    setUploading(true);
    let successCount = 0;
    const fileArray = Array.from(files);

    await Promise.all(
      fileArray.map(async (file) => {
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
  };

  return (
    <>
      <div className="bg-gradient-to-br from-peregrine-background to-peregrine-highlight/30">
        <main className="min-h-screen pb-20">
          <Header
            loaded={loaded}
            uploading={uploading}
            setSearch={setSearch}
            onUpload={handleUpload}
          />
          {/* Dropzone overlay spanning the entire screen */}
          {showDropzoneOverlay && (
            <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
              <Dropzone onDrop={handleUpload}>
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
            className={`mx-auto px-4 ${uploading ? "pointer-events-none opacity-50 select-none" : ""}`}
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
              <div
                className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 gap-4"
                style={{ gridTemplateRows: "masonry" }}
              >
                {images.map((image) => (
                  <Image
                    key={image.id}
                    image={image}
                    onEdit={(image) => setSelectedImage(image)}
                  />
                ))}
              </div>
            ) : (
              <Alert className="bg-white/80 border-2 border-peregrine-primary w-full md:w-1/3 mx-auto">
                <FileQuestionIcon className="mt-1" />
                <AlertTitle className="text-lg font-limelight text-peregrine-primary">
                  No images found
                </AlertTitle>
                <AlertDescription className="text-black">
                  Try uploading some by{" "}
                  <strong className="text-peregrine-secondary">
                    dragging and dropping
                  </strong>{" "}
                  or{" "}
                  <strong className="text-peregrine-secondary">
                    clicking the upload button
                  </strong>{" "}
                  above!
                </AlertDescription>
              </Alert>
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
