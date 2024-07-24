"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Tables } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface BannerImageProps {
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
}

export const BannerImage = ({ details }: BannerImageProps) => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await getImageUrl({
        bucketName: "file-banners",
        filePath: details.banner_url,
      }).then(setBannerUrl);
    });
  }, [details.banner_url]);

  return (
    <div
      className={cn(
        "relative w-full h-48 overflow-hidden",
        !details.banner_url && "bg-muted"
      )}
    >
      {isPending && <Skeleton className="w-full h-48 rounded-none" />}

      {details.banner_url && bannerUrl && !isPending && (
        <Image
          className="w-full h-48 object-cover"
          alt="Banner Image"
          src={bannerUrl}
          fill
          quality={100}
          priority
        />
      )}
    </div>
  );
};
