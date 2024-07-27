"use server";

import { revalidatePath } from "next/cache";

import { liveblocks } from "../liveblock";
import { parseStringify } from "../utils";

export const createRoom = async ({
  userId,
  email,
  roomId,
}: {
  userId: string;
  email: string;
  roomId: string;
}) => {
  try {
    const metadata = {
      creatorId: userId,
      creatorEmail: email,
      title: "New Room",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/dashboard");

    return parseStringify(room);
  } catch (error) {
    console.error(error);
    return { error: "Error creating the room" };
  }
};

export const getRoom = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      return { error: "You don't have access to this room" };
    }

    return parseStringify(room);
  } catch (error) {
    console.error(error);
    return { error: "Error getting the room" };
  }
};