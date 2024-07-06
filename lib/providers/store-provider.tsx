"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type WorkspaceStore,
  createCounterStore,
} from "@/lib/stores/workspace-store";

export type WorkspaceStoreApi = ReturnType<typeof createCounterStore>;

export const WorkspaceStoreContext = createContext<
  WorkspaceStoreApi | undefined
>(undefined);

export interface WorkspaceStoreProviderProps {
  children: ReactNode;
}

export const WorkspaceStoreProvider = ({
  children,
}: WorkspaceStoreProviderProps) => {
  const storeRef = useRef<WorkspaceStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCounterStore();
  }

  return (
    <WorkspaceStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkspaceStoreContext.Provider>
  );
};

export const useWorkspaceStore = <T,>(
  selector: (store: WorkspaceStore) => T
): T => {
  const workspaceStoreContext = useContext(WorkspaceStoreContext);

  if (!workspaceStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(workspaceStoreContext, selector);
};
