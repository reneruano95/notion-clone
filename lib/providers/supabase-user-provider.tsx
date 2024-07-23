"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

import { Tables } from "../supabase/supabase.types";
import { getUser } from "../server-actions/auth-actions";
import { getUserSubscriptionStatus } from "../server-actions/user-actions";

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
      const { data: currentUser, error: userError } = await getUser();

      if (currentUser) {
        setUser(user);
        const { data: subscriptionStatus, error: subscriptionStatusError } =
          await getUserSubscriptionStatus(currentUser.user.id);

        if (subscriptionStatus) setSubscription(subscriptionStatus);

        if (subscriptionStatusError) {
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
