"use server";

import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const getWorkspacesByUserId = async (): Promise<
  PostgrestSingleResponse<Tables<"workspaces">>
> => {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      data: null,
      error: {
        message: "User not found",
        code: "USER_NOT_FOUND",
        details: "User not found",
        hint: "Check if user is logged in",
      },
      status: 404,
      statusText: "User not found",
      count: null,
    };

  const response = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_owner_id", user.id)
    .single();

  return response;
};
