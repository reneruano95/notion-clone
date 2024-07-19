import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getUsersFromSearch } from "@/lib/server-actions/user-actions";
import { Tables } from "@/lib/supabase/supabase.types";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

interface CollaboratorsSearchProps {
  existingCollaborators: Tables<"users">[] | [];
  getCollaborators: (collaborator: Tables<"users">) => void;
  children: React.ReactNode;
}

export const CollaboratorsSearch = ({
  existingCollaborators,
  getCollaborators,
  children,
}: CollaboratorsSearchProps) => {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<Tables<"users">[] | []>(
    []
  );
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      const { data: results, error } = await getUsersFromSearch(e.target.value);

      setSearchResults(results || []);
    }, 500);
  };
  const addCollaborator = (collaborator: Tables<"users">) => {
    getCollaborators(collaborator);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full" asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Search Collaborators</SheetTitle>
          <SheetDescription asChild>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them from the
              settings tab.
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Search />
          <Input
            name="search"
            placeholder="Search Collaborators by email"
            onChange={onChangeHandler}
            className="dark:bg-background"
          />
        </div>
        <ScrollArea className="mt-6 overflow-y-auto w-full rounded-md">
          {searchResults
            .filter(
              (result) =>
                !existingCollaborators.some(
                  (collaborator) => collaborator.id === result.id
                )
            )
            .filter((result) => result.id !== user?.id)
            .map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center gap-2 mt-2"
              >
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback>{user?.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={() => addCollaborator(user)}
                >
                  Add
                </Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
