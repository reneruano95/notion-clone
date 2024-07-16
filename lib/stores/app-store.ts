import { createStore } from "zustand/vanilla";
import { Tables } from "../supabase/supabase.types";

type appFoldersType = Tables<"folders"> & { files: Tables<"files">[] | [] };
type appWorkspacesType = Tables<"workspaces"> & {
  folders: appFoldersType[] | [];
};
export type AppState = {
  appWorkspaces: appWorkspacesType[] | [];
};

export type AppStoreActions = {
  // workspaces
  addWorkspace: (workspace: appWorkspacesType) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Partial<appWorkspacesType>) => void;
  setWorkspaces: (workspaces: appWorkspacesType[] | []) => void;

  // folders
  addFolder: (workspaceId: string, folder: appFoldersType) => void;
  deleteFolder: (folderId: string, workspaceId: string) => void;
  updateFolder: (
    workspaceId: string,
    folderId: string,
    folder: Partial<appFoldersType>
  ) => void;
  setFolders: (workspaceId: string, folders: appFoldersType[] | []) => void;

  // files
  addFile: (
    workspaceId: string,
    folderId: string,
    file: Tables<"files">
  ) => void;
  deleteFile: (workspaceId: string, folderId: string, fileId: string) => void;
  setFile: (
    workspaceId: string,
    folderId: string,
    file: Tables<"files">[]
  ) => void;
  updateFile: (
    workspaceId: string,
    folderId: string,
    fileId: string,
    files: Partial<Tables<"files">[]> | []
  ) => void;
};

export type AppStore = AppState & AppStoreActions;

export const defaultInitState: AppState = {
  appWorkspaces: [],
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    addWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        appWorkspaces: [...state.appWorkspaces, workspace],
      })),
    deleteWorkspace: (workspaceId) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.filter(
          (workspace) => workspace.id !== workspaceId
        ),
      })),
    updateWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        appWorkspaces: state.appWorkspaces.map((w) =>
          w.id === workspace.id ? { ...w, ...workspace } : w
        ),
      })),
    setWorkspaces: (workspaces) =>
      set((state) => ({
        ...state,
        appWorkspaces: workspaces,
      })),

    addFolder: (workspaceId, folder) =>
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
    updateFolder: (workspaceId, folderId, folder) =>
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
    setFolders: (workspaceId, folders) =>
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

    addFile: (workspaceId, folderId, file) =>
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
                        files: [...f.files, file].sort(
                          (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        ),
                      }
                    : f
                ),
              }
            : w
        ),
      })),

    setFile: (workspaceId, folderId, files) =>
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
                        files: files.sort(
                          (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        ),
                      }
                    : f
                ),
              }
            : w
        ),
      })),

    deleteFile: (workspaceId, folderId, fileId) =>
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
                        files: f.files.filter((file) => file.id !== fileId),
                      }
                    : f
                ),
              }
            : w
        ),
      })),

    updateFile: (workspaceId, folderId, fileId, files) =>
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
                        files: f.files.map((file) =>
                          file.id === fileId
                            ? {
                                ...file,
                                ...files,
                              }
                            : file
                        ),
                      }
                    : f
                ),
              }
            : w
        ),
      })),
  }));
};
