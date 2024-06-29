import { redirect } from "next/navigation";
import { toast } from "sonner";

import { DashboardSetup } from "@/components/dashboard/dashboard-setup";
import { getWorkspacesByUserId } from "@/lib/server-actions/dashboard-actions";

export default async function DashboardPage() {
  const { data: workspace, error } = await getWorkspacesByUserId();

  if (error) {
    console.log(error.message);
  }

  if (workspace) {
    console.log([workspace].length);
  }

  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup />
      </div>
    );
  }

  return redirect(`/dashboard/${workspace.id}`);
}
