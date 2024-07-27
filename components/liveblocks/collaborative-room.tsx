"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveblocksLoader } from "../global/liveblocks-loader";

export const CollaborativeRoom = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <RoomProvider id="my-room">
      <ClientSideSuspense fallback={<LiveblocksLoader />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
