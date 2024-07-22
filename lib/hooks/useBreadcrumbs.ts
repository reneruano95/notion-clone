import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { useId } from "./useId";
import { useAppsStore } from "../providers/store-provider";

export const useBreadcrumbs = () => {
  const pathname = usePathname();
  const { workspaceId } = useId();
  const { appWorkspaces } = useAppsStore((store) => store);

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

  return breadcrumbs;
};
