"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Tables } from "@/lib/supabase/supabase.types";
import { useAppsStore } from "@/lib/providers/store-provider";
import { cn } from "@/lib/utils";

import { SelectedWorkspace } from "./selected-workspace";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";
import { getImageUrl } from "@/lib/server-actions/images-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface WorkspaceDropdownProps {
  privateWorkspaces: Tables<"workspaces">[] | [];
  collaboratingWorkspaces: Tables<"workspaces">[] | [];
  sharedWorkspaces: Tables<"workspaces">[] | [];
  defaultValue: Tables<"workspaces"> | undefined;
}

export const WorkspaceDropdown = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}: WorkspaceDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [workspaceLogoUrl, setWorkspaceLogoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { appWorkspaces, setWorkspaces } = useAppsStore((store) => store);

  useEffect(() => {
    if (selectedOption?.logo) {
      getImageUrl({
        bucketName: "workspaces-logos",
        filePath: selectedOption.logo,
      }).then(setWorkspaceLogoUrl);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (!appWorkspaces.length) {
      setWorkspaces(
        [
          ...privateWorkspaces,
          ...collaboratingWorkspaces,
          ...sharedWorkspaces,
        ].map((workspace) => ({
          ...workspace,
          folders: [],
        }))
      );
    }
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces]);

  const handleSelect = useCallback(
    (workspace: Tables<"workspaces">) => {
      setSelectedOption(workspace);
      setOpen(false);
    },
    [setOpen, setSelectedOption]
  );

  useEffect(() => {
    const findSelectedWorkspace = appWorkspaces.find(
      (workspace) => workspace.id === defaultValue?.id
    );

    if (findSelectedWorkspace) {
      setSelectedOption(findSelectedWorkspace);
    }
  }, [defaultValue, appWorkspaces]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <Avatar className="h-6 w-6 mr-1">
            <AvatarImage src={workspaceLogoUrl} />
            <AvatarFallback>{selectedOption?.title[0]}</AvatarFallback>
          </Avatar>

          {selectedOption &&
            appWorkspaces.find((w) => w === selectedOption)?.title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <div className="relative mb-4">
        <PopoverContent className="w-full p-1">
          <Command>
            <CommandInput placeholder="Search workspace..." className=" p-0" />
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandList>
              <CommandGroup className="p-0">
                {!!privateWorkspaces.length && (
                  <>
                    <p className="text-muted-foreground font-bold text-sm border-b mt-4 mb-2">
                      PRIVATE
                    </p>
                    {privateWorkspaces.map((w) => (
                      <Link href={`/dashboard/${w.id}`}>
                        <CommandItem
                          key={w.id}
                          value={w.id}
                          onSelect={(currentValue) => {
                            const workspace = privateWorkspaces.find(
                              (w) => w.id === currentValue
                            );
                            if (workspace) {
                              handleSelect(workspace);
                            }
                            setOpen(false);
                          }}
                          className="p-2"
                        >
                          <SelectedWorkspace
                            key={w.id}
                            workspace={w}
                            onClick={() => handleSelect(w)}
                            className={cn(
                              selectedOption?.id === w.id ? "bg-muted" : ""
                            )}
                          />
                        </CommandItem>
                      </Link>
                    ))}
                  </>
                )}
              </CommandGroup>

              <CommandGroup className="p-0">
                {!!sharedWorkspaces.length && (
                  <>
                    <p className="text-muted-foreground font-bold text-sm border-b mt-4 mb-2">
                      SHARED
                    </p>
                    {sharedWorkspaces.map((w) => (
                      <Link href={`/dashboard/${w.id}`}>
                        <CommandItem
                          key={w.id}
                          value={w.id}
                          onSelect={(currentValue) => {
                            const workspace = sharedWorkspaces.find(
                              (w) => w.id === currentValue
                            );
                            if (workspace) {
                              handleSelect(workspace);
                            }
                            setOpen(false);
                          }}
                          className="p-2"
                        >
                          <SelectedWorkspace
                            key={w.id}
                            workspace={w}
                            onClick={() => handleSelect(w)}
                          />
                        </CommandItem>
                      </Link>
                    ))}
                  </>
                )}
              </CommandGroup>

              <CommandGroup className="p-0">
                {!!collaboratingWorkspaces.length && (
                  <>
                    <p className="text-muted-foreground font-bold text-sm border-b mt-4 mb-2">
                      COLLABORATING
                    </p>
                    {collaboratingWorkspaces.map((w) => (
                      <Link href={`/dashboard/${w.id}`}>
                        <CommandItem
                          key={w.id}
                          value={w.id}
                          onSelect={(currentValue) => {
                            const workspace = collaboratingWorkspaces.find(
                              (w) => w.id === currentValue
                            );
                            if (workspace) {
                              handleSelect(workspace);
                            }
                            setOpen(false);
                          }}
                          className="p-2"
                        >
                          <SelectedWorkspace
                            key={w.id}
                            workspace={w}
                            onClick={() => handleSelect(w)}
                          />
                        </CommandItem>
                      </Link>
                    ))}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
};
