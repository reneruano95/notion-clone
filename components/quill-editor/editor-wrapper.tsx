import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Tables } from "@/lib/supabase/supabase.types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BannerImage } from "./banner-image";
import { IconPicker } from "../global/emoji-picker";
import { DirectoryTitle } from "./directory-title";

import { useBreadcrumbs } from "@/lib/hooks/useBreadcrumbs";
import { useAppsStore } from "@/lib/providers/store-provider";
import { useId } from "@/lib/hooks/useId";
import {
  updateFile as updateFileAction,
  deleteFile as deleteFileAction,
  restoreFilesFromTrash,
} from "@/lib/server-actions/file-actions";
import {
  updateFolder as updateFolderAction,
  deleteFolder as deleteFolderAction,
} from "@/lib/server-actions/folder-actions";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";

interface EditorWrapperProps {
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
  saving: boolean;
  actualDirId: string;
  children: React.ReactNode;
}

export const EditorWrapper = ({
  details,
  dirType,
  saving,
  actualDirId,
  children,
}: EditorWrapperProps) => {
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs();

  const { workspaceId, folderId } = useId();

  const {
    appWorkspaces,
    updateWorkspace,
    updateFolder,
    updateFile,
    deleteFile,
    deleteFolder,
    restoreFolderFromTrash,
  } = useAppsStore((store) => store);

  const [collaborators, setCollaborators] = useState<
    {
      id: string;
      email: string;
      avatar_url: string;
    }[]
  >([
    {
      id: "123456789",
      email: "test@test.com",
      avatar_url: "https://api.dicebear.com/9.x/pixel-art/svg",
    },
  ]);

  const restoreFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      updateFile(workspaceId, folderId, actualDirId, {
        in_trash: "",
      });
      await updateFileAction(
        {
          in_trash: "",
        },
        actualDirId
      );

      toast.success("File restored successfully");
    }

    if (dirType === "folder") {
      if (!folderId || !workspaceId) return;

      restoreFolderFromTrash(workspaceId, folderId, actualDirId);
      await updateFolderAction(
        {
          in_trash: "",
        },
        folderId as string
      );
      await restoreFilesFromTrash(folderId);

      toast.success("Folder and its files restored successfully");
    }
  };

  const deleteFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;

      deleteFile(workspaceId, folderId, actualDirId);
      await deleteFileAction(actualDirId);

      toast.success("File deleted successfully");
      router.replace(`/dashboard/${workspaceId}/`);
    }

    if (dirType === "folder") {
      if (!folderId || !workspaceId) return;

      deleteFolder(workspaceId, folderId);
      await deleteFolderAction(folderId);

      toast.success("Folder  and its files deleted successfully");
      router.replace(`/dashboard/${workspaceId}/`);
    }
  };

  const onEmojiChange = async (emoji: string) => {
    if (!actualDirId) return;

    if (dirType === "workspace") {
      updateWorkspace(
        {
          emoji,
        },
        actualDirId
      );

      await updateWorkspaceAction(
        {
          emoji,
        },
        actualDirId
      );
    }

    if (dirType === "folder") {
      if (!workspaceId) return;
      updateFolder(workspaceId, actualDirId, {
        emoji,
      });
      await updateFolderAction(
        {
          emoji,
        },
        actualDirId
      );
    }

    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      updateFile(workspaceId, folderId, actualDirId, {
        emoji,
      });
      await updateFileAction(
        {
          emoji,
        },
        actualDirId
      );
    }
  };

  return (
    <>
      <div className="relative">
        {details.in_trash && (
          <article className="py-2 z-40 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">
                This {dirType} has been deleted
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreFileHandler}
              >
                Restore
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={deleteFileHandler}
              >
                Delete Forever
              </Button>
            </div>
            <span className="text-sm text-white">{details.in_trash}</span>
          </article>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-6 gap-2">
          <div>{breadcrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex flex-row-reverse items-center justify-between gap-2 w-full">
              {saving ? (
                <Badge
                  className="bg-orange-600 hover:bg-orange-700 text-white  z-50 animate-pulse"
                  variant="secondary"
                >
                  Saving...
                </Badge>
              ) : (
                <Badge
                  className="bg-emerald-600 hover:bg-emerald-700 text-white  z-50"
                  variant="secondary"
                >
                  Saved
                </Badge>
              )}
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="bg-background border-2 flex items-center justify-center dark:border-white border-[#EB5757] h-8 w-8 rounded-full">
                        <AvatarImage
                          className="rounded-full"
                          src={collaborator.avatar_url || ""}
                        />
                        <AvatarFallback>
                          {collaborator.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{collaborator.email}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <BannerImage
          details={details}
          dirType={dirType}
          actualDirId={actualDirId}
        />
      </div>

      <div className="flex justify-center items-center flex-col relative">
        <div className="w-full self-center max-w-[800px] flex flex-col px-7">
          <div className="text-[80px] text-center -mt-[50px]">
            <IconPicker getValue={(emoji) => onEmojiChange(emoji)}>
              <div className="w-[100px] cursor-pointer transition-colors h-[100px] flex items-center justify-center hover:bg-muted  rounded-xl">
                {details.emoji}
              </div>
            </IconPicker>
          </div>

          <DirectoryTitle details={details} dirType={dirType} />
        </div>
      </div>
      {children}
    </>
  );
};
