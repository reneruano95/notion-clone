import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";

import { updateFile as updateFileAction } from "@/lib/server-actions/file-actions";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";
import { deleteImage } from "@/lib/server-actions/images-actions";

interface BannerRemoveProps {
  dirType: "workspace" | "folder" | "file";
  actualDirId: string;
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
}
export const BannerRemove = ({
  details,
  dirType,
  actualDirId,
}: BannerRemoveProps) => {
  const router = useRouter();

  const { workspaceId, folderId, fileId } = useId();
  const { updateWorkspace, updateFolder, updateFile } = useAppsStore(
    (store) => store
  );

  const [isPending, startTransition] = useTransition();

  const removeBanner = useCallback(async () => {
    startTransition(async () => {
      if (!actualDirId) return;

      try {
        await deleteImage({
          bucketName: "file-banners",
          filePath: details.banner_url,
        });

        if (dirType === "workspace") {
          if (!workspaceId) return;

          updateWorkspace({ banner_url: "" }, workspaceId);
          await updateWorkspaceAction({ banner_url: "" }, workspaceId);
        }

        if (dirType === "folder") {
          if (!folderId || !workspaceId) return;

          updateFolder(workspaceId, folderId, { banner_url: "" });
          await updateFolderAction({ banner_url: "" }, folderId);
        }

        if (dirType === "file") {
          if (!fileId || !folderId || !workspaceId) return;

          updateFile(workspaceId, folderId, fileId, { banner_url: "" });
          await updateFileAction({ banner_url: "" }, fileId);
        }
      } catch (error) {
        console.log("error deleting image", error);

        toast.error("An error occurred while deleting the image", {
          duration: 3000,
        });
      }
    });

    router.refresh();
  }, [
    actualDirId,
    details.banner_url,
    dirType,
    folderId,
    fileId,
    router,
    updateFile,
    updateFolder,
    updateWorkspace,
    updateWorkspaceAction,
    updateFolderAction,
    updateFileAction,
    workspaceId,
  ]);

  return (
    <Button
      variant={"ghost"}
      disabled={isPending}
      onClick={removeBanner}
      className="hover:bg-background border-none flex item-center justify-center text-sm text-muted-foreground p-2"
    >
      <span className="whitespace-nowrap font-normal">Remove Banner</span>
    </Button>
  );
};
