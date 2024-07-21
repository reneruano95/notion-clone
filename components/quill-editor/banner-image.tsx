"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Tables } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { Loader } from "../global/loader";
import { Skeleton } from "../ui/skeleton";

interface BannerImageProps {
  dirDetails: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
}

export const BannerImage = ({ dirDetails, details }: BannerImageProps) => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      getImageUrl({
        bucketName: "file-banners",
        filePath: dirDetails.banner_url,
      }).then(setBannerUrl);
    });
  }, [dirDetails]);

  return (
    <div
      className={cn(
        "relative w-full h-48 overflow-hidden",
        !details.banner_url && "bg-muted"
      )}
    >
      {isPending && <Skeleton className="w-full h-48 rounded-none" />}

      {details.banner_url && bannerUrl && !isPending && (
        <img
          className="w-full h-48 object-cover"
          alt="Banner Image"
          src={bannerUrl}
        />
      )}
    </div>
  );
};
