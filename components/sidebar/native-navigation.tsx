import Link from "next/link";

import CypressHomeIcon from "@/components/icons/cypressHomeIcon";
import CypressSettingsIcon from "@/components/icons/cypressSettingsIcon";
import CypressTrashIcon from "@/components/icons/cypressTrashIcon";
import { cn } from "@/lib/utils";
import { Settings } from "../settings/settings";
import { Search } from "lucide-react";

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
        <li className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all cursor-pointer">
          <Search className="dark:fill-[#2B2939] fill-[#D3D3D3]  dark:stroke-[#817EB5]  stoke-Neutrals/neutrals-7  transition-all group-hover/native:fill-washed-purple-400 group-hover/native:stroke-washed-blue-500" />
          <span>Search</span>
        </li>
        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all cursor-pointer">
            <CypressSettingsIcon />
            <span>Settings</span>
          </li>
        </Settings>

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
