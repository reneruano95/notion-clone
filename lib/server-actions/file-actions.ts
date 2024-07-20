"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const createFile = async (newFile: Tables<"files">) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from("files").insert(newFile);

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

export const getFiles = async (folderId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folderId)
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

export const updateFile = async (
  updatedFile: Partial<Tables<"files">>,
  fileId: string
) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .update(updatedFile)
      .eq("id", fileId);

    if (error) {
      return {
        data: null,
        error,
      };
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
