"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, useCallback, useRef } from "react";
import { Image as ImageIcon, Trash } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Tables } from "@/lib/supabase/supabase.types";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";

import {
  getImageUrl,
  uploadImage,
  deleteImage,
} from "@/lib/server-actions/images-actions";
import { updateFile as updateFileAction } from "@/lib/server-actions/file-actions";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";

interface BannerImageProps {
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
  actualDirId: string;
}

export const BannerImage = ({
  details,
  dirType,
  actualDirId,
}: BannerImageProps) => {
  const router = useRouter();
  const [bannerUrl, setBannerUrl] = useState("");
  const [onBlur, setOnBlur] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const { workspaceId, folderId, fileId } = useId();
  const { updateWorkspace, updateFolder, updateFile } = useAppsStore(
    (store) => store
  );

  useEffect(() => {
    startTransition(async () => {
      const filePath = details.banner_url;
      if (filePath) {
        const url = await getImageUrl({
          bucketName: "file-banners",
          filePath,
          id: actualDirId,
        });
        setBannerUrl(url);
      }
    });
  }, [details.banner_url]);

  const uploadBanner = useCallback(
    async ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      try {
        const filePath = await uploadImage({
          bucketName: "file-banners",
          file,
          id: actualDirId,
        });

        switch (dirType) {
          case "workspace":
            if (!workspaceId) return;
            updateWorkspace({ banner_url: filePath }, workspaceId);
            await updateWorkspaceAction({ banner_url: filePath }, workspaceId);
            break;
          case "folder":
            if (!folderId || !workspaceId) return;
            updateFolder(workspaceId, folderId, { banner_url: filePath });
            await updateFolderAction({ banner_url: filePath }, folderId);
            break;
          case "file":
            if (!fileId || !folderId || !workspaceId) return;
            updateFile(workspaceId, folderId, fileId, { banner_url: filePath });
            await updateFileAction({ banner_url: filePath }, fileId);
            break;
          default:
            break;
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

  const removeBanner = useCallback(async () => {
    if (!actualDirId) return;

    try {
      await deleteImage({
        bucketName: "file-banners",
        filePath: details.banner_url,
        id: actualDirId,
      });

      switch (dirType) {
        case "workspace":
          if (!workspaceId) return;
          updateWorkspace({ banner_url: "" }, workspaceId);
          await updateWorkspaceAction({ banner_url: "" }, workspaceId);
          break;
        case "folder":
          if (!folderId || !workspaceId) return;
          updateFolder(workspaceId, folderId, { banner_url: "" });
          await updateFolderAction({ banner_url: "" }, folderId);
          break;
        case "file":
          if (!fileId || !folderId || !workspaceId) return;
          updateFile(workspaceId, folderId, fileId, { banner_url: "" });
          await updateFileAction({ banner_url: "" }, fileId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("error deleting image", error);
      toast.error("An error occurred while deleting the image", {
        duration: 3000,
      });
    }

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
    <div className="relative">
      <div
        className={cn(
          "relative w-full h-56 sm:h-64 overflow-hidden",
          !details.banner_url && "bg-muted"
        )}
      >
        {isPending && <Skeleton className="w-full h-56 sm:h-64 rounded-none" />}

        {details.banner_url && bannerUrl && !isPending && (
          <Image
            className={cn(
              "object-cover w-full h-56 sm:h-64 rounded-none absolute top-0 left-0 z-0 filter brightness-75",
              onBlur &&
                "filter brightness-100 blur-sm transition-all duration-700 ease-in-out"
            )}
            alt="Banner Image"
            src={bannerUrl}
            fill
            quality={100}
            priority
          />
        )}
      </div>

      <div
        className=" flex items-center gap-1 absolute right-2 bottom-2"
        onMouseOver={() => setOnBlur(true)}
        onMouseOut={() => setOnBlur(false)}
      >
        <>
          <Button
            onClick={() => inputRef.current?.click()}
            variant={"outline"}
            size={"sm"}
            className="hover:bg-background border-none flex item-center justify-center text-sm text-muted-foreground gap-2 p-2 shadow z-50"
          >
            <ImageIcon size={20} />
            <span className="hidden sm:block whitespace-nowrap font-normal">
              {details.banner_url ? "Update Banner" : "Add Banner"}
            </span>
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

        {details.banner_url && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={removeBanner}
            className="hover:bg-red-500 hover:text-white border-none flex item-center justify-center text-sm gap-2 p-2 shadow z-50 text-red-500 dark:text-white"
          >
            <Trash size={20} />
            <span className="hidden sm:block whitespace-nowrap font-normal">
              Remove Banner
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
