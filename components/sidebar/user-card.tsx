import { getUser } from "@/lib/server-actions/auth-actions";
import { Tables } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";

interface UserCardProps {
  subscription: Tables<"subscriptions"> | null;
}

export const UserCard = async ({ subscription }: UserCardProps) => {
  const {
    data: { user },
  } = await getUser();

  if (!user) return;

  return <div>UserCard</div>;
};
