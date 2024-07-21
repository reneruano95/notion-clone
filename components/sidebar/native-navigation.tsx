import Link from "next/link";
import { House, Search, Settings as SettingsIcon, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Settings } from "../settings/settings";

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
          <Search className="dark:fill-[#2B2939] fill-[#D3D3D3] dark:stroke-[#817EB5] stoke-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-purple-400 group-hover/native:stroke-washed-blue-500" />
          <span>Search</span>
        </li>
        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <House className="dark:fill-[#2B2939] fill-[#D3D3D3] dark:stroke-[#817EB5] stoke-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-purple-400 group-hover/native:stroke-washed-blue-500" />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all cursor-pointer">
            <SettingsIcon className="dark:fill-[#2B2939] fill-[#D3D3D3] dark:stroke-[#817EB5] stoke-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-purple-400 group-hover/native:stroke-washed-blue-500" />
            <span>Settings</span>
          </li>
        </Settings>

        <li>
          <Link
            className="group/native flex gap-2 text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <Trash2 className="dark:fill-[#2B2939] fill-[#D3D3D3] dark:stroke-[#817EB5] stoke-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-purple-400 group-hover/native:stroke-washed-blue-500" />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
