"use server";

import { AuthError } from "@supabase/supabase-js";
import { SignInFormValues } from "@/components/sign-in/sign-in-form";
import { createServerClient } from "@/lib/supabase/server";
import { SignUpFormValues } from "@/components/sign-up/sign-up-form";
import { createBrowserClient } from "../supabase/client";

export const signIn = async ({ email, password }: SignInFormValues) => {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
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
      error: error as AuthError,
    };
  }
};

export const signUp = async (formData: SignUpFormValues) => {
  try {
    const supabase = createServerClient();
    const { firstName, lastName, email, password } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

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
      error: error as AuthError,
    };
  }
};

export const signOut = async () => {
  const supabase = createServerClient();

  await supabase.auth.signOut();
};

export const getUser = async () => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
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
      error: error as AuthError,
    };
  }
};

export const getSession = async () => {
  const supabase = createBrowserClient();

  return await supabase.auth.getSession();
};
