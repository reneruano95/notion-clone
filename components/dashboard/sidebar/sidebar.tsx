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
import { PlanUsage } from "./plan-usage";
import { NativeNavigation } from "./native-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoldersDropdownList } from "./folders-dropdown-list";

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

  if (collaboratingWorkspaces) {
    // console.log("data private workspaces", privateWorkspaces.data);
    // console.log("data collaborating workspaces", collaboratingWorkspaces.data);
    // console.log("data shared workspaces", sharedWorkspaces.data);
  }

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
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          user={user}
          privateWorkspaces={privateWorkspaces?.data || []}
          collaboratingWorkspaces={collaboratingWorkspaces?.data || []}
          sharedWorkspaces={sharedWorkspaces.data || []}
          defaultValue={defaultValue}
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
    </aside>
  );
};
