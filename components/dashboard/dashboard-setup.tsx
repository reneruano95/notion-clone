"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "../global/emoji-picker";
import { Tables } from "@/lib/supabase/supabase.types";
import { ImageUpload } from "../global/image-upload";

const createWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .describe(" Workspace name")
    .min(1, "Workspace name is required."),
  workspaceLogo: z
    .string()
    .describe("Workspace logo")
    .min(1, "Workspace logo is required"),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

interface DashboardSetupProps {
  user: User;
  subscription: Tables<"subscriptions"> | null;
}

export const DashboardSetup = ({ user, subscription }: DashboardSetupProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("👋");

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
      workspaceLogo: "",
    },
  });

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    console.log("onSubmit", values);
  };

  return (
    <Card className="w-[600px] h-screen sm:h-auto flex flex-col justify-center">
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                    {selectedEmoji}
                  </EmojiPicker>
                </div>

                <FormField
                  control={form.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-muted-foreground">
                        Workspace Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="workspaceLogo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm text-muted-foreground">
                      Workspace Logo
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        bucketName="workspaces-logos"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    {!field.value && (
                      <FormDescription>
                        Upload an image that represents your workspace.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
