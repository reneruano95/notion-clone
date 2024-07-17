"use server";

import { PostgrestError, User } from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const createWorkspace = async (workspace: Tables<"workspaces">) => {
  const supabase = createServerClient();
  const response = await supabase.from("workspaces").insert(workspace).select();

  return response;
};

export const getWorkspacesByUserId = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("workspaces")
      .select("*")
      .eq("workspace_owner_id", userId)
      .select()
      .limit(1)
      .single();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getUserSubscriptionStatus = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const supabase = createServerClient();

  try {
    const response = await supabase
      .from("folders")
      .select("*")
      .eq("workspace_id", workspaceId)
      .select();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getPrivateWorkspacesByUserId = async (userId: string) => {
  const supabase = createServerClient();

  try {
    const response = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "eq", userId)
      .filter("is_private", "eq", true)
      .select();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getCollaboratingWorkspacesByUserId = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "neq", userId)
      .filter("is_private", "eq", false)
      .select();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getSharedWorkspacesByUserId = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "eq", userId)
      .filter("is_private", "eq", false)
      .select();

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

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
  removedCollaborators: User[]
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

export const getUsersFromSearch = async (email: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("users")
      .select("*")
      .ilike("email", `%${email}%`)
      .select();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const createFolder = async (data: Tables<"folders">) => {
  const supabase = createServerClient();

  try {
    const response = await supabase.from("folders").insert(data);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const updateFolder = async (
  data: Partial<Tables<"folders">>,
  folderId: string
) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("folders")
      .update(data)
      .eq("id", folderId);
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
