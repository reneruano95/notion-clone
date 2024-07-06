import { createStore } from "zustand/vanilla";
import { Tables } from "../supabase/supabase.types";

export type WorkspaceState = {
  workspaces: Tables<"workspaces">[] | [];
};

export type WorkspaceStoreActions = {
  addWorkspace: (workspace: Tables<"workspaces">) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspace: Tables<"workspaces">) => void;
  setWorkspaces: (workspaces: Tables<"workspaces">[]) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceStoreActions;

export const defaultInitState: WorkspaceStore = {
  workspaces: [],
  addWorkspace: () => {},
  deleteWorkspace: () => {},
  updateWorkspace: () => {},
  setWorkspaces: () => {},
};

export const createCounterStore = (
  initState: WorkspaceStore = defaultInitState
) => {
  return createStore<WorkspaceStore>()((set) => ({
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
  }));
};
