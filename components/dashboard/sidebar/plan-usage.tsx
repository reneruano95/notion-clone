"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { Tables } from "@/lib/supabase/supabase.types";
import { MAX_FOLDERS_FREE_PLAN } from "@/lib/constants";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Progress } from "@/components/ui/progress";
import CypressDiamondIcon from "@/components/icons/cypressDiamondIcon";

interface PlanUsageProps {
  foldersLength: number;
  subscription: Tables<"subscriptions"> | null;
}

export const PlanUsage = ({ foldersLength, subscription }: PlanUsageProps) => {
  const pathname = usePathname();
  const { appWorkspaces } = useAppsStore((store) => store);

  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
  }, [pathname]);

  useEffect(() => {
    const stateFoldersLength = appWorkspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.folders?.length;

    if (stateFoldersLength === undefined) return;

    setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);

    if (stateFoldersLength > MAX_FOLDERS_FREE_PLAN) {
      setUsagePercentage(100);
    }

    if (stateFoldersLength < 0) {
      setUsagePercentage(0);
    }

    return () => {};
  }, [appWorkspaces, workspaceId, foldersLength]);

  return (
    <article className="mb-4">
      {subscription?.status !== "active" && (
        <div className="flex  gap-2 text-muted-foreground mb-2 items-center">
          <div className="h-4 w-4">
            <CypressDiamondIcon />
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} className="h-1" />
      )}
    </article>
  );
};
