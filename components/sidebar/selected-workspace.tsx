import { useEffect, useState } from "react";
import Link from "next/link";

import { Tables } from "@/lib/supabase/supabase.types";
import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SelectedWorkspaceProps {
  workspace: Tables<"workspaces">;
  onClick?: () => void;
  className?: string;
}

export const SelectedWorkspace = ({
  workspace,
  onClick,
  className,
}: SelectedWorkspaceProps) => {
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
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick();
      }}
      className={cn(
        "flex rounded-md hover:bg-muted transition-all gap-2 justify-center cursor-pointer items-center",
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
};
