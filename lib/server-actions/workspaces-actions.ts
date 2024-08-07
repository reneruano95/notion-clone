"use server";

import { PostgrestError } from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";
import { validate } from "uuid";

export const createWorkspace = async (
  workspace: Tables<"workspaces">
): Promise<{
  data: Tables<"workspaces">[] | null;
  error: PostgrestError | null;
}> => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from("workspaces").insert(workspace);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as PostgrestError };
  }
};

export const getWorkspaces = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("workspace_owner_id", userId)
      .select()
      .limit(1)
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const supabase = createServerClient();

  const isValid = validate(workspaceId);
  if (!isValid) {
    return {
      data: null,
      error: new Error("Invalid workspace ID"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .limit(1)
      .select();

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "eq", userId)
      .filter("is_private", "eq", true)
      .select();

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "neq", userId)
      .filter("is_private", "eq", false)
      .select();

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const getSharedWorkspaces = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .filter("workspace_owner_id", "eq", userId)
      .filter("is_private", "eq", false)
      .select();

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const updateWorkspace = async (
  workspace: Partial<Tables<"workspaces">>,
  workspaceId: string
): Promise<{
  data: Tables<"workspaces">[] | null;
  error: PostgrestError | null;
}> => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("workspaces")
      .update(workspace)
      .eq("id", workspaceId);

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);

    if (error) {
      return { data: null, error };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};
