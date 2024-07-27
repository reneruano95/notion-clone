"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider as Provider,
} from "@liveblocks/react";
import { LiveblocksLoader } from "@/components/global/liveblocks-loader";
import { getUsers } from "../server-actions/user-actions";

interface LiveblocksProviderProps {
  children: React.ReactNode;
}

export const LiveblocksProvider = ({ children }: LiveblocksProviderProps) => {
  return (
    <Provider
      authEndpoint={"/api/liveblocks-auth"}
      resolveUsers={async (userIds) => {
        const { data: users, error } = await getUsers(userIds);

        return users;
      }}
    >
      <ClientSideSuspense fallback={<LiveblocksLoader />}>
        {children}
      </ClientSideSuspense>
    </Provider>
  );
};
