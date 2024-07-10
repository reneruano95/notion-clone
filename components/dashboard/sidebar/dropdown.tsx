"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import useId from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Dropdown = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}: DropdownProps) => {
  const router = useRouter();

  const { folderId, workspaceId } = useId();
  const { appWorkspaces } = useAppsStore((store) => store);
  const [isEditing, setIsEditing] = useState(false);

  return <div>Dropdown</div>;
};
