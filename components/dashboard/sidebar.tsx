import { redirect } from "next/navigation";

import { getUser } from "@/lib/server-actions/auth-actions";
import {
  getFoldersByWorkspaceId,
  getUserSubscriptionStatus,
} from "@/lib/server-actions/dashboard-actions";

interface SidebarProps {
  params: { workspace_id: string };
  className?: string;
}

export const Sidebar = async ({ params, className }: SidebarProps) => {
  const {
    data: { user },
  } = await getUser();

  if (!user) return redirect("/sign-in");

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  const { data: folders, error: foldersError } = await getFoldersByWorkspaceId(
    params.workspace_id
  );

  if (subscriptionError || foldersError) {
    console.log("subscription error", subscriptionError);
    console.log("folders error", foldersError);

    redirect("/dashboard");
  }

  return <div>Sidebar</div>;
};
