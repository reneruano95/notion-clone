import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";

import { uploadImage } from "@/lib/server-actions/images-actions";
import { updateFile as updateFileAction } from "@/lib/server-actions/file-actions";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";

interface BannerUploadProps {
  children: React.ReactNode;
  dirType: "workspace" | "folder" | "file";
}

export const BannerUpload = ({ children, dirType }: BannerUploadProps) => {
  const router = useRouter();
  const { workspaceId, folderId, fileId } = useId();
  const { updateWorkspace, updateFolder, updateFile } = useAppsStore(
    (store) => store
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const uploadBanner = useCallback(
    async ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      try {
        const filePath = await uploadImage({
          bucketName: "file-banners",
          file,
        });

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
    },
    [
      dirType,
      folderId,
      fileId,
      router,
      updateFile,
      updateFolder,
      updateWorkspace,
      workspaceId,
    ]
  );

  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        variant={"ghost"}
        className="hover:bg-background border-none flex item-center justify-center text-sm text-muted-foreground p-2"
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
