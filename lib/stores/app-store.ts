import { createStore } from "zustand/vanilla";
import { Tables } from "../supabase/supabase.types";

type appFoldersType = Tables<"folders"> & { file: Tables<"files">[] | [] };
type appWorkspacesType = Tables<"workspaces"> & {
  folders: appFoldersType[] | [];
};
export type AppState = {
  appWorkspaces: appWorkspacesType[] | [];
};

export type AppStoreActions = {
  addWorkspace: (workspace: appWorkspacesType) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Partial<appWorkspacesType>) => void;
  setWorkspaces: (workspaces: appWorkspacesType[] | []) => void;

  addFolder: (folder: appFoldersType, workspaceId: string) => void;
  deleteFolder: (folderId: string, workspaceId: string) => void;
  updateFolder: (
    folder: Partial<appFoldersType>,
    workspaceId: string,
    folderId: string
  ) => void;
  setFolders: (folders: appFoldersType[] | [], workspaceId: string) => void;
};

export type AppStore = AppState & AppStoreActions;

export const defaultInitState: AppStore = {
  appWorkspaces: [],

  addWorkspace: () => {},
  deleteWorkspace: () => {},
  updateWorkspace: () => {},
  setWorkspaces: () => {},

  addFolder: () => {},
  deleteFolder: () => {},
  updateFolder: () => {},
  setFolders: () => {},
};

export const createAppStore = (initState: AppStore = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    addWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        workspaces: [...state.appWorkspaces, workspace],
      })),
    deleteWorkspace: (workspaceId) =>
      set((state) => ({
        ...state,
        workspaces: state.appWorkspaces.filter(
          (workspace) => workspace.id !== workspaceId
        ),
      })),
    updateWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        workspaces: state.appWorkspaces.map((w) =>
          w.id === workspace.id ? { ...w, ...workspace } : w
        ),
      })),
    setWorkspaces: (workspaces) =>
      set((state) => ({
        ...state,
        workspaces,
      })),

    addFolder: (folder, workspaceId) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                folders: [...w.folders, folder].sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                ),
              }
            : w
        ),
      })),
    deleteFolder: (folderId) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((w) => ({
          ...w,
          folders: w.folders.filter((f) => f.id !== folderId),
        })),
      })),
    updateFolder: (folder, workspaceId, folderId) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                folders: w.folders.map((f) =>
                  f.id === folderId
                    ? {
                        ...f,
                        ...folder,
                      }
                    : f
                ),
              }
            : w
        ),
      })),
    setFolders: (folders, workspaceId) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                folders: folders.sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                ),
              }
            : w
        ),
      })),
  }));
};
