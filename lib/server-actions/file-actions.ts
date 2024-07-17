"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";
import { Tables } from "../supabase/supabase.types";

export const createFile = async (data: Tables<"files">) => {
  const supabase = createServerClient();

  try {
    const response = await supabase.from("files").insert(data).select();

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

export const getFiles = async (folderId: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false })
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
