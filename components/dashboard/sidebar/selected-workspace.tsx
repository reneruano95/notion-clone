import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Tables } from "@/lib/supabase/supabase.types";
import { getImageUrl } from "@/lib/server-actions/images-actions";

interface SelectedWorkspaceProps {
  workspace: Tables<"workspaces">;
  onClick?: () => void;
}

export const SelectedWorkspace = ({
  workspace,
  onClick,
}: SelectedWorkspaceProps) => {
  const [workspaceLogo, setWorkspaceLogo] = useState("/public/cypresslogo.svg");

  useEffect(() => {
    if (workspace.logo) {
      getImageUrl({
        bucketName: "workspaces-logos",
        filePath: workspace.logo,
      }).then(setWorkspaceLogo);
    }
  }, [workspace]);

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick();
      }}
      className="flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 justify-center cursor-pointer items-center my-2"
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={26}
        height={26}
        objectFit="cover"
      />
      <div className="flex flex-col">
        <p className="text-lg w-[170px] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {workspace.title}
        </p>
      </div>
    </Link>
  );
};
