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

export const getFileDetails = async (fileId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
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

export const moveFilesToTrash = async (folderId: string) => {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase
      .from("files")
      .update({
        in_trash: `Deleted by ${user?.email}`,
      })
      .eq("folder_id", folderId);

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

export const deleteFile = async (fileId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId);

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

export const restoreFilesFromTrash = async (folderId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .update({
        in_trash: "",
      })
      .eq("folder_id", folderId);

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
