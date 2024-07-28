"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider as Provider,
} from "@liveblocks/react";
import { LiveblocksLoader } from "@/components/global/liveblocks-loader";
import { getUsers } from "../server-actions/user-actions";
import { getUserColor } from "../utils";

interface LiveblocksProviderProps {
  children: React.ReactNode;
}

export const LiveblocksProvider = ({ children }: LiveblocksProviderProps) => {
  return (
    <Provider
      authEndpoint={"/api/liveblocks-auth"}
      resolveUsers={async ({ userIds }) => {
        const { data: users, error } = await getUsers({ userEmails: userIds });

        const resolvedUsers = users?.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          color: getUserColor(user.id),
        }));

        return resolvedUsers;
      }}
    >
      <ClientSideSuspense fallback={<LiveblocksLoader />}>
        {children}
      </ClientSideSuspense>
    </Provider>
  );
};
