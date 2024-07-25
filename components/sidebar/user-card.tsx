import { LogOut } from "lucide-react";

import { getUser } from "@/lib/server-actions/auth-actions";
import { getImageUrl } from "@/lib/server-actions/images-actions";
import { getUserDetails } from "@/lib/server-actions/user-actions";
import { Tables } from "@/lib/supabase/supabase.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CypressProfileIcon from "../icons/cypressProfileIcon";
import { LogoutButton } from "../global/logout-button";
import ModeToggle from "../global/mode-toggle";

interface UserCardProps {
  subscription: Tables<"subscriptions"> | null;
}

export const UserCard = async ({ subscription }: UserCardProps) => {
  const { data: user } = await getUser();

  if (!user) return;

  const { data: userDetails, error: userDetailsError } = await getUserDetails(
    user.id
  );

  let avatarUrl;
  if (userDetailsError) {
    console.log("userDetailsError", userDetailsError);
  }

  avatarUrl = await getImageUrl({
    bucketName: "avatars",
    filePath: userDetails?.avatar_url || "",
  });

  return (
    <article className="hidden sm:flex justify-between items-center py-2">
      <aside className="flex justify-center items-center gap-2">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            <CypressProfileIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-muted-foreground">
            {subscription?.status === "active" ? "Pro Plan" : "Free Plan"}
          </span>
          <small className="w-[100px] overflow-hidden overflow-ellipsis">
            {userDetails?.email}
          </small>
        </div>
      </aside>
      <div className="flex items-center justify-center">
        <LogoutButton>
          <LogOut />
        </LogoutButton>
        <ModeToggle />
      </div>
    </article>
  );
};
