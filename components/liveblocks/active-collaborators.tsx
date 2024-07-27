import { useOthers, useSelf } from "@liveblocks/react/suspense";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const ActiveCollaborators = () => {
  const others = useOthers();
  const currentUser = useSelf();

  const collaborators = others.map((other) => other.info);
  // console.log(collaborators);

  return (
    <ul className="flex px-3">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id} className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className="inline-block size-8 ring-2"
                  style={{ border: `2px solid ${color}` }}
                >
                  <AvatarImage src={avatar || ""} />
                  <AvatarFallback className="select-none">
                    {name[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}

      {currentUser && (
        <li className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className="inline-block size-8 ring-2"
                  style={{ border: `2px solid ${currentUser.info.color}` }}
                >
                  <AvatarImage src={currentUser.info.avatar || ""} />
                  <AvatarFallback className="select-none">
                    {currentUser.info.name[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{currentUser.info.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      )}
    </ul>
  );
};
