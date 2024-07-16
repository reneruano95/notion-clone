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

export type StoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<StoreApi | undefined>(undefined);

export interface AppStoreProviderProps {
  children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<StoreApi>();

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  useEffect(() => {
    console.log("App State Changed", storeRef.current?.getState());
  }, [storeRef.current]);

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
