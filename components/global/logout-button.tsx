"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { useAppsStore } from "@/lib/providers/store-provider";
import { signOut } from "@/lib/server-actions/auth-actions";

interface LogoutButtonProps {
  children: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();

  const { setWorkspaces } = useAppsStore((store) => store);

  const logout = async () => {
    await signOut();
    router.refresh();
    setWorkspaces([]);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full p-2"
      onClick={logout}
    >
      {children}
    </Button>
  );
};
