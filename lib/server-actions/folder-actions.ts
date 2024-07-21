"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true })
      .select();

    if (error) {
      return {
        data: null,
        error,
      };
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

export const getFolderDetails = async (folderId: string) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .select();

    if (error) {
      return {
        data: null,
        error,
      };
    }
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};

export const createFolder = async (newFolder: Tables<"folders">) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from("folders").insert(newFolder);

    if (error) {
      return {
        data: null,
        error,
      };
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

export const updateFolder = async (
  updatedFolder: Partial<Tables<"folders">>,
  folderId: string
) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("folders")
      .update(updatedFolder)
      .eq("id", folderId);

    if (error) {
      return {
        data: null,
        error,
      };
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

export const deleteFolder = async (folderId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);

    if (error) {
      return {
        data: null,
        error,
      };
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
