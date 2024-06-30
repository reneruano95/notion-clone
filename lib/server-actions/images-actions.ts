import { redirect } from "next/navigation";
import { createBrowserClient } from "../supabase/client";
import { getUser } from "./auth-actions";

export const getImageUrl = async ({
  bucketName,
  filePath,
}: {
  bucketName: string;
  filePath: string;
}) => {
  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await getUser();

  if (!user) return redirect("/sign-in");

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(`${user.id}/${filePath}`);

  return data.publicUrl;
};

export const uploadImage = async ({
  bucketName,
  file,
}: {
  bucketName: string;
  file: File | undefined;
}) => {
  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await getUser();

  if (!user) return redirect("/sign-in");
  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(`${user.id}/${filePath}`, file);

  return filePath;
};
