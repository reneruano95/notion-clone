"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveblocksLoader } from "../global/liveblocks-loader";

interface CollaborativeRoomProps {
  children: React.ReactNode;
  roomId: string;
  roomMetadata: RoomMetadata;
}
export const CollaborativeRoom = ({
  children,
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<LiveblocksLoader />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
