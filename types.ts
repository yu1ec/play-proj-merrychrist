
export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface HandData {
  isOpen: boolean;
  x: number; // 0 to 1
  y: number; // 0 to 1
  confidence: number;
}

export interface TransformationData {
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  id: number;
  weight: number;
}
