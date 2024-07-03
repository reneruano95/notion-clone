import { redirect } from "next/navigation";

import { getUser } from "@/lib/server-actions/auth-actions";
import {
  getCollaboratingWorkspacesByUserId,
  getFoldersByWorkspaceId,
  getPrivateWorkspacesByUserId,
  getSharedWorkspacesByUserId,
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

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspacesByUserId(user.id),
      getCollaboratingWorkspacesByUserId(user.id),
      getSharedWorkspacesByUserId(user.id),
    ]);

  return <aside>Sidebar</aside>;
};
