"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

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
