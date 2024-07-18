import { useEffect, useState } from "react";
import Link from "next/link";

import { Tables } from "@/lib/supabase/supabase.types";
import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SelectedWorkspaceProps {
  workspace: Tables<"workspaces">;
  onClick?: () => void;
}

export const SelectedWorkspace = ({
  workspace,
  onClick,
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
      className="flex rounded-md hover:bg-muted transition-all p-2 gap-2 justify-center cursor-pointer items-center my-2"
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={workspaceLogoUrl} />
        <AvatarFallback>{workspace.title[0]}</AvatarFallback>
      </Avatar>

      <p className="text-lg w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
        {workspace.title}
      </p>
    </Link>
  );
};
