"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Tables } from "../supabase/supabase.types";
import { getUser } from "../server-actions/auth-actions";
import { getUserSubscriptionStatus } from "../server-actions/user-actions";
import { toast } from "sonner";

type SupabaseUserApi = {
  user: User | null;
  subscription: Tables<"subscriptions"> | null;
};

const SupabaseUserContext = createContext<SupabaseUserApi>({
  user: null,
  subscription: null,
});

export const useSupabaseUser = () => useContext(SupabaseUserContext);

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

export const SupabaseUserProvider = ({
  children,
}: SupabaseUserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] =
    useState<Tables<"subscriptions"> | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const {
        data: { user },
      } = await getUser();

      if (user) {
        setUser(user);
        const { data, error } = await getUserSubscriptionStatus(user.id);

        if (data) setSubscription(data);

        if (error) {
          toast.error("Unexpected error. Please try again");
        }
      }
    };

    getUserDetails();
  }, []);

  return (
    <SupabaseUserContext.Provider value={{ user, subscription }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};
