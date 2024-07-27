declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];
declare type RoomAccesses = Record<string, AccessType>;
declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};
