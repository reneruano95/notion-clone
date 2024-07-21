"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

import "quill/dist/quill.snow.css";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { getImageUrl } from "@/lib/server-actions/images-actions";
import { EmojiPicker } from "../global/emoji-picker";

interface QuillEditorProps {
  dirDetails: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
  actualDirId: string;
}

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

export const QuillEditor = ({
  dirDetails,
  dirType,
  actualDirId,
}: QuillEditorProps) => {
  const router = useRouter();
  const pathname = usePathname();

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

  const [quill, setQuill] = useState<any>(null);
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
  const [bannerUrl, setBannerUrl] = useState("");

  const [saving, startTransition] = useTransition();

  useEffect(() => {
    if (dirType === "file") {
      getImageUrl({
        bucketName: "file-banners",
        filePath: dirDetails.banner_url,
      }).then(setBannerUrl);
    }
  }, [dirDetails]);

  const details = useMemo(() => {
    let selectedDirDetails;

    if (dirType === "workspace") {
      selectedDirDetails = appWorkspaces.find(
        (workspace) => workspace.id === workspaceId
      );
    }

    if (dirType === "folder") {
      selectedDirDetails = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId);
    }

    if (dirType === "file") {
      selectedDirDetails = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === actualDirId);
    }

    if (selectedDirDetails) return selectedDirDetails;

    return {
      title: dirDetails.title,
      emoji: dirDetails.emoji,
      created_at: dirDetails.created_at,
      data: dirDetails.data,
      in_trash: dirDetails.in_trash,
      banner_url: dirDetails.banner_url,
    } as Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  }, [appWorkspaces, workspaceId, folderId, actualDirId, dirType]);

  const breadcrumbs = useMemo(() => {
    if (!pathname || !appWorkspaces || !workspaceId) return;

    const segments = pathname
      .split("/")
      .filter((segment) => segment !== "dashboard" && segment);

    const workspaceDetails = appWorkspaces.find(
      (workspace) => workspace.id === workspaceId
    );

    const workspaceBreadcrumb = workspaceDetails
      ? `${workspaceDetails.emoji} ${workspaceDetails.title}`
      : "";

    if (segments.length === 1) return workspaceBreadcrumb;

    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find(
      (folder) => folder.id === folderSegment
    );

    const folderBreadcrumb = folderDetails
      ? `/ ${folderDetails.emoji} ${folderDetails.title}`
      : "";

    if (segments.length === 2)
      return `${workspaceBreadcrumb}${folderBreadcrumb}`;

    const fileSegment = segments[2];
    const fileDetails = folderDetails?.files.find(
      (file) => file.id === fileSegment
    );

    const fileBreadcrumb = fileDetails
      ? `/ ${fileDetails.emoji} ${fileDetails.title}`
      : "";

    return `${workspaceBreadcrumb}${folderBreadcrumb}${fileBreadcrumb}`;
  }, [pathname, appWorkspaces, workspaceId]);

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");

      wrapper.append(editor);
      const Quill = (await import("quill")).default;

      //WIP cursors
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          // TODO: Add cursors
        },
      });

      setQuill(q);
    }
  }, []);

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
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8">
          <div>{breadcrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="-ml-3 bg-background border-2 flex items-center justify-center dark:border-white border-[#EB5757] h-8 w-8 rounded-full">
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
            {saving ? (
              <Badge
                className="bg-orange-600 hover:bg-orange-700 top-4 text-white right-4 z-50 animate-pulse"
                variant="secondary"
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                className="bg-emerald-600 hover:bg-emerald-700 top-4 text-white right-4 z-50"
                variant="secondary"
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {details.banner_url && (
        <div className="relative w-full h-[200px]">
          <Image
            fill
            className="w-full md:f-48 h-20 object-cover"
            alt="Banner Image"
            src={bannerUrl}
          />
        </div>
      )}
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div className="w-full self-center max-w-[800px] flex flex-col px-7 lg:my-8">
          <div className="text-[80px]">
            <EmojiPicker getValue={onEmojiChange}>
              <div className="w-[100px] cursor-pointer transition-colors h-[100px] flex items-center justify-center hover:bg-muted rounded-xl">
                {details.emoji}
              </div>
            </EmojiPicker>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div id="container" ref={wrapperRef} className="max-w-[800px]"></div>
      </div>
    </>
  );
};
