"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveblocksLoader } from "../global/liveblocks-loader";

interface CollaborativeRoomProps {
  children: React.ReactNode;
  roomId: string;
}
export const CollaborativeRoom = ({
  children,
  roomId,
}: CollaborativeRoomProps) => {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<LiveblocksLoader />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
