import { createStore } from "zustand/vanilla";
import { Tables } from "../supabase/supabase.types";

export type AppState = {
  workspaces: Tables<"workspaces">[] | [];
  folders: Tables<"folders">[] | [];
};

export type AppStoreActions = {
  addWorkspace: (workspace: Tables<"workspaces">) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Partial<Tables<"workspaces">>) => void;
  setWorkspaces: (workspaces: Tables<"workspaces">[]) => void;

  addFolder: (folder: Tables<"folders">, workspaceId: string) => void;
  deleteFolder: (folderId: string, workspaceId: string) => void;
  updateFolder: (
    folder: Partial<Tables<"folders">>,
    workspaceId: string
  ) => void;
  setFolders: (folders: Tables<"folders">[], workspaceId: string) => void;
};

export type AppStore = AppState & AppStoreActions;

export const defaultInitState: AppStore = {
  workspaces: [],
  folders: [],

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
        workspaces: [...state.workspaces, workspace],
      })),
    deleteWorkspace: (workspaceId) =>
      set((state) => ({
        ...state,
        workspaces: state.workspaces.filter(
          (workspace) => workspace.id !== workspaceId
        ),
      })),
    updateWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === workspace.id ? { ...w, ...workspace } : w
        ),
      })),
    setWorkspaces: (workspaces) => set((state) => ({ ...state, workspaces })),

    addFolder: (folder, workspaceId) =>
      set((state) => ({
        ...state,
        folders: [...state.folders, { ...folder, workspace_id: workspaceId }],
      })),
    deleteFolder: (folderId) =>
      set((state) => ({
        ...state,
        folders: state.folders.filter((folder) => folder.id !== folderId),
      })),
    updateFolder: (folder, workspaceId) =>
      set((state) => ({
        ...state,
        folders: state.folders.map((f) =>
          f.workspace_id === workspaceId && f.id === folder.id
            ? { ...f, ...folder }
            : f
        ),
      })),
    setFolders: (folders, workspaceId) =>
      set((state) => ({
        ...state,
        folders: folders
          .filter((folder) => folder.workspace_id === workspaceId)
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          ),
      })),
  }));
};
