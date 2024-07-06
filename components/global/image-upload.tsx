import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CloudUpload, ImageUp, X } from "lucide-react";

import { getImageUrl, uploadImage } from "@/lib/server-actions/images-actions";
import { Loader } from "./loader";

interface ImageUploadProps {
  bucketName: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export const ImageUpload = ({
  bucketName,
  value,
  onChange,
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (value) {
      startTransition(() =>
        getImageUrl({ bucketName, filePath: value }).then(setImageUrl)
      );
    }
  }, [value]);

  const handleClear = async () => {
    setImageUrl("");
    onChange("");
  };

  const handleSelectedImage = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const filePath = await uploadImage({ bucketName, file });
      onChange(filePath);
    } catch (error) {
      console.log("error uploading image", error);

      toast.error("An error occurred while uploading the image", {
        duration: 3000,
      });
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-28 flex items-center justify-center">
        <Loader />
        <p className="sr-only">Uploading...</p>
      </div>
    );
  }

  if (value) {
    return (
      <div className="w-full h-28">
        {imageUrl && (
          <div className="relative h-full w-fit mx-auto">
            <Image
              src={imageUrl}
              width={100}
              height={100}
              alt="photo-2"
              className="w-full h-full rounded-lg object-contain"
            />
            <button
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-primary rounded-full text-white p-1 shadow-sm border"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-28">
      <input
        type="file"
        id="custom-input"
        accept="image/*"
        onChange={handleSelectedImage}
        hidden
      />
      <label
        htmlFor="custom-input"
        className="flex flex-col justify-center items-center w-full h-full text-muted-foreground text-center text-sm py-2 px-4 rounded-md border-2 border-dashed border-muted-foreground font-semibold cursor-pointer"
      >
        <ImageUp className="w-6 h-6" />
        <p>Click to upload your workspace logo</p>
        <p>SVG, PNG, JPG or GIF</p>
      </label>
    </div>
  );
};
