import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Board } from "@/server/db/schema";

export interface State {
  currentBoard: Board | null;
  setCurrentBoard: (board: Board) => void;
  clearStore: () => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    currentBoard: null,
    setCurrentBoard: (board) => set({ currentBoard: board }),
    clearStore: () =>
      set({
        currentBoard: null,
      }),
  }),
  {
    name: "kanban-board-store",
    storage: createJSONStorage(() => localStorage),
  },
) as StateCreator<State>;

const useStore = create<State>(store);

export default useStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("kanban-board-store", useStore);
}
