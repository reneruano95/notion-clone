"use server";

import { AuthResponse, AuthTokenResponsePassword } from "@supabase/supabase-js";
import { SignInFormValues } from "@/components/sign-in/sign-in-form";
import { createServerClient } from "@/lib/supabase/server";
import { SignUpFormValues } from "@/components/sign-up/sign-up-form";

export const signIn = async ({
  email,
  password,
}: SignInFormValues): Promise<AuthTokenResponsePassword> => {
  const supabase = createServerClient();

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return JSON.parse(JSON.stringify(response));
};

export const signUp = async (
  formData: SignUpFormValues
): Promise<AuthResponse> => {
  const supabase = createServerClient();

  const { firstName, lastName, email, password } = formData;

  const response = await supabase.auth.signUp({
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

  return JSON.parse(JSON.stringify(response));
};
