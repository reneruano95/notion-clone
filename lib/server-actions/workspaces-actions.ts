"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const createWorkspace = async (workspace: Tables<"workspaces">) => {
  const supabase = createServerClient();
  const response = await supabase.from("workspaces").insert(workspace).select();

  return response;
};

export const getWorkspaces = async (userId: string) => {
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

export const getPrivateWorkspaces = async (userId: string) => {
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

export const getCollaboratingWorkspaces = async (userId: string) => {
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

export const getSharedWorkspaces = async (userId: string) => {
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
