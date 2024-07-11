import Link from "next/link";

import CypressHomeIcon from "@/components/icons/cypressHomeIcon";
import CypressSettingsIcon from "@/components/icons/cypressSettingsIcon";
import CypressTrashIcon from "@/components/icons/cypressTrashIcon";
import { cn } from "@/lib/utils";

interface NativeNavigationProps {
  myWorkspaceId: string;
  className?: string;
}

export const NativeNavigation = ({
  myWorkspaceId,
  className,
}: NativeNavigationProps) => {
  return (
    <nav className={cn("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>

        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressSettingsIcon />
            <span>Settings</span>
          </Link>
        </li>

        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressTrashIcon />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
