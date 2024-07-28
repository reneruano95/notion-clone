"use server";

import { revalidatePath } from "next/cache";
import { RoomData } from "@liveblocks/node";

import { liveblocks } from "../liveblock";
import { parseStringify } from "../utils";
import { Tables } from "../supabase/supabase.types";
import { error } from "console";

export const createRoom = async ({
  userId,
  email,
  roomId,
  roomType,
  title,
  usersAccessesEmails,
}: {
  userId: string;
  email: string;
  roomId: string;
  roomType: "workspace" | "folder" | "file";
  title: string;
  usersAccessesEmails?: string[];
}) => {
  try {
    const metadata = {
      creatorId: userId,
      roomType: roomType,
      creatorEmail: email,
      title: title,
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    if (usersAccessesEmails && usersAccessesEmails.length > 0) {
      usersAccessesEmails.forEach((email) => {
        usersAccesses[email] = ["room:write"];
      });
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/dashboard");

    return parseStringify(room) as RoomData;
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
      return {
        data: null,
        error: {
          message: "You don't have access to this room",
        },
      };
    }

    return {
      data: parseStringify(room) as RoomData,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: {
        message: "Error getting the room",
      },
    };
  }
};

export const updateRoom = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath("/dashboard");

    return parseStringify(updatedRoom) as RoomData;
  } catch (error) {
    console.error(error);
    return { error: "Error updating the room" };
  }
};

export const getRooms = async () => {
  try {
    const rooms = await liveblocks.getRooms();

    return rooms;
  } catch (error) {
    console.error(error);
    return { error: "Error getting the rooms" };
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);

    revalidatePath("/dashboard");

    return { message: "Room deleted" };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting the room" };
  }
};

export const deleteRooms = async (roomIds: string[]) => {
  try {
    await Promise.all(roomIds.map((roomId) => liveblocks.deleteRoom(roomId)));

    revalidatePath("/dashboard");

    return { message: "Rooms deleted" };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting the rooms" };
  }
};

export const addCollaborators = async (
  roomId: string,
  collaborators: Tables<"users">[]
) => {
  try {
    const usersAccesses: RoomAccesses = {};

    collaborators.forEach((collaborator) => {
      usersAccesses[collaborator.email!] = ["room:write"];
    });

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    revalidatePath("/dashboard");

    return parseStringify(room) as RoomData;
  } catch (error) {
    console.error(error);
    return { error: "Error adding collaborators" };
  }
};
