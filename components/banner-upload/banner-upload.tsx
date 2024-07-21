import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";

import { uploadImage } from "@/lib/server-actions/images-actions";
import { updateFile as updateFileAction } from "@/lib/server-actions/file-actions";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";
import { useRouter } from "next/navigation";

interface BannerUploadProps {
  children: React.ReactNode;
  className?: string;
  dirType: "workspace" | "folder" | "file";
  id: string;
}

export const BannerUpload = ({
  children,
  className,
  dirType,
  id,
}: BannerUploadProps) => {
  const router = useRouter();
  const { workspaceId, folderId, fileId } = useId();
  const { appWorkspaces, updateWorkspace, updateFolder, updateFile } =
    useAppsStore((store) => store);

  const inputRef = useRef<HTMLInputElement>(null);

  const uploadBanner = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const filePath = await uploadImage({ bucketName: "file-banners", file });

      if (dirType === "workspace") {
        if (!workspaceId) return;

        updateWorkspace({ banner_url: filePath }, workspaceId);
        await updateWorkspaceAction({ banner_url: filePath }, workspaceId);
      }

      if (dirType === "folder") {
        if (!folderId || !workspaceId) return;

        updateFolder(workspaceId, folderId, { banner_url: filePath });
        await updateFolderAction({ banner_url: filePath }, folderId);
      }

      if (dirType === "file") {
        if (!fileId || !folderId || !workspaceId) return;

        updateFile(workspaceId, folderId, fileId, { banner_url: filePath });
        await updateFileAction({ banner_url: filePath }, fileId);
      }
    } catch (error) {
      console.log("error uploading image", error);

      toast.error("An error occurred while uploading the image", {
        duration: 3000,
      });
    }

    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        variant={"outline"}
        className="p-2 border-none bg-transparent hover:bg-transparent hover:text-muted-foreground"
      >
        {children}
      </Button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        id="custom-input"
        accept="image/*"
        onChange={(url) => uploadBanner(url)}
        hidden
      />
    </>
  );
};
