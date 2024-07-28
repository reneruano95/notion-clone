declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];
declare type RoomAccesses = Record<string, AccessType>;

declare type UserType = "creator" | "editor" | "viewer";

declare type RoomMetadata = {
  creatorId: string;
  roomType: "workspace" | "folder" | "file";
  email: string;
  title: string;
};

declare type CollaborativeUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
};
