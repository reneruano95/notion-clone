import { redirect } from "next/navigation";

import { DashboardSetup } from "@/components/dashboard/dashboard-setup";

import { getUser } from "@/lib/server-actions/auth-actions";
import { getWorkspaces } from "@/lib/server-actions/workspaces-actions";
import { getUserSubscriptionStatus } from "@/lib/server-actions/user-actions";

export default async function DashboardPage() {
  const { data: user } = await getUser();

  if (!user) return redirect("/sign-in");

  const { data: workspace, error: workspaceError } = await getWorkspaces(
    user.id
  );

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  // TODO: Add error handling
  if (workspaceError || subscriptionError) {
    console.log("subscription error", subscriptionError);
    console.log("workspace error", workspaceError);
  }

  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup user={user} subscription={subscription} />
      </div>
    );
  }

  return redirect(`/dashboard/${workspace.id}`);
}
