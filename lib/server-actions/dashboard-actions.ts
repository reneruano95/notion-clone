"use server";

import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const getWorkspacesByUserId = async (
  userId: string
): Promise<PostgrestSingleResponse<Tables<"workspaces">>> => {
  const supabase = createServerClient();

  const response = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_owner_id", userId)
    .single();

  return response;
};

export const getUserSubscriptionStatus = async (
  userId: string
): Promise<PostgrestSingleResponse<Tables<"subscriptions">>> => {
  const supabase = createServerClient();

  const response = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return response;
};
