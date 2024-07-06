"use server";

import { PostgrestError } from "@supabase/supabase-js";

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
      data: response.data || [],
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
      data: response.data || [],
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
      data: response.data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};
