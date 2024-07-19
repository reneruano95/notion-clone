"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";

import { useStore } from "zustand";

import { type AppStore, createAppStore } from "@/lib/stores/app-store";
import { useId } from "../hooks/useId";
import { getFiles } from "../server-actions/file-actions";

export type StoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<StoreApi | undefined>(undefined);

export interface AppStoreProviderProps {
  children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<StoreApi>();

  const { folderId, workspaceId } = useId();

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  // useEffect(() => {
  //   console.log("App State Changed", storeRef.current?.getState());
  // }, [storeRef.current]);

  useEffect(() => {
    if (!folderId || !workspaceId) return;
    const fetchFiles = async () => {
      const { error: filesError, data } = await getFiles(folderId);
      if (filesError) {
        console.log(filesError);
      }
      if (!data) return;

      storeRef.current?.setState((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((workspace) => ({
          ...workspace,
          folders: workspace.folders.map((folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                files: data,
              };
            }
            return folder;
          }),
        })),
      }));
    };
    fetchFiles();
  }, [folderId, workspaceId]);

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppsStore = <T,>(selector: (store: AppStore) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`);
  }

  return useStore(appStoreContext, selector);
};
