import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getFoldersByWorkspaceId } from "@/lib/server-actions/folder-actions";
import {
  getCollaboratingWorkspaces,
  getPrivateWorkspaces,
  getSharedWorkspaces,
} from "@/lib/server-actions/workspaces-actions";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { PlanUsage } from "./plan-usage";
import { NativeNavigation } from "./native-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoldersDropdownList } from "./folders-dropdown-list";
import { getUserSubscriptionStatus } from "@/lib/server-actions/user-actions";
import { UserCard } from "./user-card";

interface SidebarProps {
  params: { workspace_id: string };
  className?: string;
}

export const Sidebar = async ({ params, className }: SidebarProps) => {
  const { data: user } = await getUser();

  if (!user) return redirect("/sign-in");

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  const { data: folders, error: foldersError } = await getFoldersByWorkspaceId(
    params.workspace_id
  );

  if (subscriptionError || foldersError) {
    console.log("subscription", subscription);
    console.log("subscription error", subscriptionError);
    console.log("folders error", foldersError);

    return redirect("/dashboard");
  }

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  // TODO: Add error handling
  if (
    privateWorkspaces.error ||
    collaboratingWorkspaces.error ||
    sharedWorkspaces.error
  ) {
    console.log("data private workspaces error", privateWorkspaces.error);
    console.log(
      "data collaborating workspaces error",
      collaboratingWorkspaces.error
    );
    console.log("data shared workspaces error", sharedWorkspaces.error);
  }

  return (
    <aside
      className={cn(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces?.data || []}
          collaboratingWorkspaces={collaboratingWorkspaces?.data || []}
          sharedWorkspaces={sharedWorkspaces.data || []}
          defaultValue={[
            ...(privateWorkspaces.data || []),
            ...(collaboratingWorkspaces.data || []),
            ...(sharedWorkspaces.data || []),
          ].find((workspace) => workspace.id === params.workspace_id)}
        />
        <PlanUsage
          foldersLength={folders?.length || 0}
          subscription={subscription}
        />
        <NativeNavigation myWorkspaceId={params.workspace_id} />

        <ScrollArea className="overflow-auto relative h-[450px]">
          <div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40" />
          <FoldersDropdownList
            workspaceFolders={folders || []}
            workspaceId={params.workspace_id}
          />
        </ScrollArea>
      </div>
      <UserCard subscription={subscription} />
    </aside>
  );
};
