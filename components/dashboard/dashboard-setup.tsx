"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmojiPicker } from "../global/emoji-picker";

interface DashboardSetupProps {
  user: User;
  subscription: {} | null;
}

export const DashboardSetup = ({ user, subscription }: DashboardSetupProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

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
        <form action="">
          <div className="text-5xl">
            <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
              {selectedEmoji}
            </EmojiPicker>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
