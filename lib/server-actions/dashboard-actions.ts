"use server";

import { PostgrestError } from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";
import { or } from "drizzle-orm";

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
      .from("collaborators")
      .select("workspaces!inner(*)")
      .or("workspaces_id.eq.id", {
        referencedTable: "workspaces",
      })
      .eq("workspaces.workspace_owner_id", userId);

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
      .from("collaborators")
      .select("workspaces!inner(*)")
      .eq("users.id", "collaborators.user_id")
      .eq("collaborators.workspaces_id", "workspaces.id")
      .eq("users.id", userId);

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
      .from("collaborators")
      .select("workspaces!inner(*)")
      .or("workspaces_id.eq.id", {
        referencedTable: "workspaces",
      })
      .eq("workspaces.workspace_owner_id", userId)
      .order("created_at", { ascending: false });

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
