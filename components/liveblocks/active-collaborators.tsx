import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ActiveCollaborators = () => {
  const others = useOthers();
  const currentUser = useSelf();

  const collaborators = others.map((other) => other.info);
  // console.log(collaborators);

  return (
    <ul className="flex px-3">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id} className="relative">
          <Avatar
            className="inline-block size-8 ring-2"
            style={{ border: `2px solid ${color}` }}
          >
            <AvatarImage src={avatar || ""} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </li>
      ))}

      {currentUser && (
        <li className="relative">
          <Avatar
            className="inline-block size-8 ring-2"
            style={{ border: `2px solid ${currentUser.info.color}` }}
          >
            <AvatarImage src={currentUser.info.avatar || ""} />
            <AvatarFallback>{currentUser.info.name[0]}</AvatarFallback>
          </Avatar>
        </li>
      )}
    </ul>
  );
};
