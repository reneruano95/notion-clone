"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

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
import { Loader } from "../global/loader";
import { createWorkspace } from "@/lib/server-actions/dashboard-actions";
import { useAppsStore } from "@/lib/providers/store-provider";

const createWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .describe(" Workspace name")
    .min(1, "Your workspace name must be at least 1 character long"),
  workspaceLogo: z
    .string()
    .describe("Workspace logo")
    .min(1, "You need to upload a workspace logo"),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

interface DashboardSetupProps {
  user: User;
  subscription: Tables<"subscriptions"> | null;
}

export const DashboardSetup = ({ user, subscription }: DashboardSetupProps) => {
  const router = useRouter();
  const { addWorkspace } = useAppsStore((store) => store);

  const [selectedEmoji, setSelectedEmoji] = useState<string>("🖥️");

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
      workspaceLogo: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    console.log("onSubmit", values);
    try {
      const newWorkspace: Tables<"workspaces"> = {
        id: uuidv4(),
        banner_url: "",
        created_at: new Date().toISOString(),
        emoji: selectedEmoji,
        data: "",
        in_trash: "",
        title: values.workspaceName,
        logo: values.workspaceLogo,
        workspace_owner_id: user.id,
        is_private: true,
      };

      const { data, error: createWorkspaceError } = await createWorkspace(
        newWorkspace
      );

      if (createWorkspaceError) {
        throw createWorkspaceError;
      }

      addWorkspace({
        ...newWorkspace,
        folders: [],
      });

      toast.success(`${newWorkspace.title} has been created successfully.`);

      router.replace(`/dashboard/${newWorkspace.id}`);
    } catch (error) {
      console.log("error creating workspace", error);
      toast.error(
        "An error occurred while creating the workspace. Please try again."
      );
    } finally {
      form.reset();
    }
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormItem className="w-full space-y-1">
                      <FormLabel className="text-sm text-muted-foreground">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      {form.formState.errors.workspaceName ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>Your workspace name</FormDescription>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="workspaceLogo"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    {/* <FormLabel className="text-sm text-muted-foreground">
                      Logo
                    </FormLabel> */}
                    <FormControl>
                      <ImageUpload
                        bucketName="workspaces-logos"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    {form.formState.errors.workspaceLogo ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Upload an image that represents your workspace.
                      </FormDescription>
                    )}
                    {subscription?.status !== "active" && (
                      <FormDescription className="text-muted-foreground block !mt-0">
                        To customize your workspace, you need to be on a Pro
                        Plan
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <div className="self-end">
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? "Create Workspace" : <Loader />}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
