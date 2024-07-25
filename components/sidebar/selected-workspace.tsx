import { forwardRef, useEffect, useState } from "react";
import Link from "next/link";

import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SelectedWorkspaceProps {
  workspace: {
    id: string;
    logo?: string;
    title: string;
  };
  onClick?: () => void;
  className?: string;
}

export const SelectedWorkspace = forwardRef<
  HTMLAnchorElement,
  SelectedWorkspaceProps
>(({ workspace, onClick, className }, ref) => {
  const [workspaceLogoUrl, setWorkspaceLogoUrl] = useState("");

  useEffect(() => {
    if (workspace.logo) {
      getImageUrl({
        bucketName: "workspaces-logos",
        filePath: workspace.logo,
      }).then(setWorkspaceLogoUrl);
    }
  }, [workspace]);

  return (
    <Link
      ref={ref}
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick();
      }}
      className={cn(
        "flex rounded-md hover:bg-muted transition-all gap-2 justify-center cursor-pointer items-center my-1",
        className
      )}
    >
      <Avatar className="h-6 w-6 mr-1">
        <AvatarImage src={workspaceLogoUrl} />
        <AvatarFallback>{workspace.title[0]}</AvatarFallback>
      </Avatar>

      <p className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap ">
        {workspace.title}
      </p>
    </Link>
  );
});
