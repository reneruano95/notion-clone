"use client";

import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardSetupProps {
  user: User;
  subscription: {} | null;
}

export const DashboardSetup = ({ user, subscription }: DashboardSetupProps) => {
  return (
    <Card className="w-[380px] md:w-[600px]">
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action=""></form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
