"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { Tables } from "@/lib/supabase/supabase.types";
import { MAX_FOLDERS_FREE_PLAN } from "@/lib/constants";

interface PlanUsageProps {
  foldersLength: number;
  subscription: Tables<"subscriptions"> | null;
}

export const PlanUsage = ({ foldersLength, subscription }: PlanUsageProps) => {
  const pathname = usePathname();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateFoldersLength = foldersLength;
    setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);
  }, [foldersLength, subscription]);

  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
  }, [pathname]);

  return <div>PlanUsage</div>;
};
