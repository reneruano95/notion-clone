"use server";

import { redirect } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const addCollaborators = async (
  workspaceId: string,
  newCollaborators: Tables<"users">[]
) => {
  const supabase = createServerClient();

  try {
    for (const user of newCollaborators) {
      const existingCollaborator = await supabase
        .from("collaborators")
        .select()
        .eq("user_id", user.id)
        .eq("workspace_id", workspaceId)
        .single();

      if (!existingCollaborator.data) {
        await supabase.from("collaborators").insert({
          user_id: user.id,
          workspace_id: workspaceId,
        });
      }
    }

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const removeCollaborators = async (
  workspaceId: string,
  removedCollaborators: Tables<"users">[]
) => {
  const supabase = createServerClient();

  try {
    for (const user of removedCollaborators) {
      const existingCollaboration = await supabase
        .from("collaborators")
        .select()
        .eq("user_id", user.id)
        .eq("workspace_id", workspaceId)
        .single();

      if (existingCollaboration.data) {
        await supabase
          .from("collaborators")
          .delete()
          .eq("user_id", user.id)
          .eq("workspace_id", workspaceId);
      }
    }

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getCollaborators = async (workspaceId: string) => {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    const { data, error } = await supabase
      .from("collaborators")
      .select("users(*)")
      .eq("workspace_id", workspaceId)
      .neq("user_id", user.id);

    if (error) {
      return {
        data: null,
        error,
      };
    }

    const collaborators = data.map(
      (collaborator) => collaborator.users
    ) as Tables<"users">[];

    return {
      data: collaborators,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};
