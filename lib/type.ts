declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];
declare type RoomAccesses = Record<string, AccessType>;

declare type RoomMetadata = {
  creatorId: string;
  roomType: "workspace" | "folder" | "file";
  email: string;
  title: string;
};
