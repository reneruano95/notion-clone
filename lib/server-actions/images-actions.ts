import { redirect } from "next/navigation";
import { createBrowserClient } from "../supabase/client";
import { getUser } from "./auth-actions";

export const getImageUrl = async ({
  bucketName,
  filePath,
  id,
}: {
  bucketName: string;
  filePath: string;
  id?: string;
}) => {
  const supabase = createBrowserClient();

  const { data: user } = await getUser();
  if (!user) return redirect("/sign-in");

  if (bucketName === "file-banners") {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${id}/${filePath}`);

    return data.publicUrl;
  } else {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${user.id}/${filePath}`);

    return data.publicUrl;
  }
};

export const uploadImage = async ({
  bucketName,
  file,
  id,
}: {
  bucketName: string;
  file: File | undefined;
  id?: string;
}) => {
  const supabase = createBrowserClient();

  const { data: user } = await getUser();

  if (!user) return redirect("/sign-in");
  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  if (bucketName === "file-banners") {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${id}/${filePath}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
  } else {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${user.id}/${filePath}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
  }

  return filePath;
};

export const deleteImage = async ({
  bucketName,
  filePath,
  id,
}: {
  bucketName: string;
  filePath: string;
  id?: string;
}) => {
  const supabase = createBrowserClient();

  const { data: user } = await getUser();
  if (!user) return redirect("/sign-in");

  if (bucketName === "file-banners") {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([`${id}/${filePath}`]);

    return {
      data,
      error,
    };
  } else {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([`${user?.id}/${filePath}`]);

    return {
      data,
      error,
    };
  }
};
