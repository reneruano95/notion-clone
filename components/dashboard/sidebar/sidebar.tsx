import { redirect } from "next/navigation";

import { getUser } from "@/lib/server-actions/auth-actions";
import {
  getCollaboratingWorkspacesByUserId,
  getFoldersByWorkspaceId,
  getPrivateWorkspacesByUserId,
  getSharedWorkspacesByUserId,
  getUserSubscriptionStatus,
} from "@/lib/server-actions/dashboard-actions";
import { cn } from "@/lib/utils";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { Tables } from "@/lib/supabase/supabase.types";

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

  if (
    privateWorkspaces.error ||
    collaboratingWorkspaces.error ||
    sharedWorkspaces.error
  ) {
    console.log("privateWorkspaces error", privateWorkspaces.error);
    console.log("collaboratingWorkspaces error", collaboratingWorkspaces.error);
    console.log("sharedWorkspaces error", sharedWorkspaces.error);
  }

  let defaultValue: Tables<"workspaces"> | undefined;
  if (
    privateWorkspaces.data !== null &&
    collaboratingWorkspaces.data !== null &&
    sharedWorkspaces.data !== null
  ) {
    defaultValue = [
      ...privateWorkspaces.data,
      ...collaboratingWorkspaces.data,
      ...sharedWorkspaces.data,
    ].find((workspace) => workspace.id === params.workspace_id);
  }

  return (
    <aside
      className={cn(
        "hidden sm:flex sm:flex-col w-[250px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces.data}
          collaboratingWorkspaces={collaboratingWorkspaces.data}
          sharedWorkspaces={sharedWorkspaces.data}
          defaultValue={defaultValue}
        />
      </div>
    </aside>
  );
};
