"use server";

import { redirect } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";

import { createServerClient } from "../supabase/server";
import { parseStringify } from "../utils";

export const getUserSubscriptionStatus = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

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

export const getUsersFromSearch = async (email: string) => {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", user.id)
      .ilike("email", `%${email}%`)
      .select();

    if (error) {
      return { data: null, error };
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

export const getUserDetails = async (userId: string) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { data: null, error };
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

export const getUsers = async ({ userEmails }: { userEmails: string[] }) => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("email", userEmails)
      .select();

    if (error) {
      return { data: null, error };
    }
    const users = data.map((user) => ({
      id: user.id,
      name: user.full_name!,
      email: user.email!,
      avatar: user.avatar_url!,
    }));

    const sortedUsers = userEmails.map((email) =>
      users.find((u) => u.email === email)
    );

    return {
      data: parseStringify(sortedUsers) as typeof users,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError,
    };
  }
};
