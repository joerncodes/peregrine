import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { SaveIcon } from "lucide-react";
import type { ImageMeta } from "../@types/ImageMeta";
import { toast } from "sonner";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageMetaData from "./ImageMetaData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      <SheetTitle className="sr-only">Image Details</SheetTitle>
      <SheetContent className="p-8 max-w-lg mx-auto bg-white/95 rounded-l-2xl shadow-2xl border-0 overflow-y-auto">
        {image && (
          <div className="space-y-6">
            <img
              src={image.filePath}
              alt={image.title}
              className="w-full rounded-xl shadow-lg border border-peregrine-highlight"
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-limelight font-extrabold text-peregrine-primary">
                  {image?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {image.dimensions && (
                  <ImageMetaData dimensions={image.dimensions} />
                )}
              </CardContent>
            </Card>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  const payload = {
                    ...values,
                    id: image?.id,
                  };
                  await fetch(`/api/image/${image?.id}`, {
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
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-limelight text-peregrine-primary-dark">
                        Image Title
                      </FormLabel>
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
                      <FormLabel className="text-md font-limelight text-peregrine-primary-dark">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-48"
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
                  className="self-start mx-auto cursor-pointer mt-4 px-6 py-2 bg-peregrine-primary text-white rounded-lg font-semibold shadow hover:bg-peregrine-highlight transition disabled:opacity-50 flex items-center gap-2 "
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
