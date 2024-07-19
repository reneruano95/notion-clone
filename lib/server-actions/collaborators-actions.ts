"use server";

import { PostgrestError, User } from "@supabase/supabase-js";

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
