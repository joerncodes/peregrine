import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  ZoomInIcon,
  DownloadIcon,
  ClipboardIcon,
  SaveIcon,
  LinkIcon,
} from "lucide-react";
import type { ImageMeta } from "../@types/ImageMeta";
import { toast } from "sonner";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ImageSheetProps {
  image: ImageMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploading: boolean;
  onUpdate: (image: ImageMeta) => void;
}

const ImageSheet: React.FC<ImageSheetProps> = ({
  image,
  open,
  onOpenChange,
  uploading,
  onUpdate,
}) => {
  const form = useForm({
    defaultValues: {
      title: image?.title,
      description: image?.description,
      tags: image?.tags,
    },
  });

  useEffect(() => {
    form.reset({
      title: image?.title,
      description: image?.description,
      tags: image?.tags,
    });
  }, [image, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-8 max-w-lg mx-auto bg-white/95 rounded-l-2xl shadow-2xl border-0">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-peregrine-primary mb-2">
            {image?.title}
          </SheetTitle>
        </SheetHeader>
        {image && (
          <div className="mt-4 space-y-6">
            <img
              src={image.filePath}
              alt={image.title}
              className="w-full rounded-xl shadow-lg border border-peregrine-highlight"
            />
            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                size="icon"
                title="Zoom"
                className="hover:bg-peregrine-highlight/40 cursor-pointer"
                onClick={() => image && window.open(image.filePath, "_blank")}
                disabled={uploading}
              >
                <ZoomInIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                title="Download"
                className="hover:bg-peregrine-highlight/40 cursor-pointer"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = image.filePath;
                  a.download = image.title;
                  a.click();
                }}
                disabled={uploading}
              >
                <DownloadIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                title="Copy to clipboard"
                className="hover:bg-peregrine-highlight/40 cursor-pointer"
                onClick={async () => {
                  try {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.src = image.filePath;

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
                            onOpenChange(false);
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
                disabled={uploading}
              >
                <ClipboardIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                title="Copy URL"
                className="hover:bg-peregrine-highlight/40 cursor-pointer"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      window.location.origin + image.filePath
                    );
                    toast.success("Image URL copied to clipboard");
                  } catch {
                    toast.error("Failed to copy URL");
                  }
                }}
                disabled={uploading}
              >
                <LinkIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                title="Delete"
                className="hover:bg-red-600/80 cursor-pointer"
                onClick={async () => {
                  try {
                    await fetch(`http://localhost:3001/image/${image.id}`, {
                      method: "DELETE",
                    });
                    toast.success("Image deleted");
                    onUpdate(image);
                    onOpenChange(false);
                  } catch {
                    toast.error("Failed to delete image");
                  }
                }}
                disabled={uploading}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  const payload = {
                    ...values,
                    id: image?.id,
                  };
                  await fetch(`http://localhost:3001/image/${image?.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });
                  toast.success("Image updated");
                  onUpdate(image!);
                  onOpenChange(false);
                })}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoFocus={true}
                          placeholder={image?.title}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={image?.description}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-peregrine-primary text-white rounded-lg font-semibold shadow hover:bg-peregrine-highlight transition disabled:opacity-50 flex items-center gap-2 "
                  disabled={uploading}
                >
                  <SaveIcon className="w-5 h-5" />
                  Save
                </button>
              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ImageSheet;
