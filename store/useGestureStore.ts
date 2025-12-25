
import { create } from 'zustand';
import { TreeState, HandData } from '../types';

interface GestureStore {
  treeState: TreeState;
  handData: HandData;
  hasCamera: boolean;
  cameraError: string | null;
  setHandData: (data: HandData) => void;
  setTreeState: (state: TreeState) => void;
  setCameraStatus: (hasCamera: boolean, error?: string | null) => void;
  toggleTreeState: () => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  treeState: TreeState.FORMED,
  handData: { isOpen: false, x: 0.5, y: 0.5, confidence: 0 },
  hasCamera: true,
  cameraError: null,
  setHandData: (data) => set((state) => ({ 
    handData: data,
    treeState: data.confidence > 0.5 ? (data.isOpen ? TreeState.CHAOS : TreeState.FORMED) : state.treeState
  })),
  setTreeState: (treeState) => set({ treeState }),
  setCameraStatus: (hasCamera, error = null) => set({ hasCamera, cameraError: error }),
  toggleTreeState: () => set((state) => ({ 
    treeState: state.treeState === TreeState.FORMED ? TreeState.CHAOS : TreeState.FORMED 
  })),
}));
