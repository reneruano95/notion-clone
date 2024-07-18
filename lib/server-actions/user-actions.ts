"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createServerClient } from "../supabase/server";

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

export const getUsersFromSearch = async (email: string) => {
  const supabase = createServerClient();
  try {
    const response = await supabase
      .from("users")
      .select("*")
      .ilike("email", `%${email}%`)
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
