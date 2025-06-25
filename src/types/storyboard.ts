import CanvasDraw from "react-canvas-draw";

export enum AspectRatio {
  RATIO_16_9 = 'RATIO_16_9',
  RATIO_1_1 = 'RATIO_1_1',
  RATIO_4_3 = 'RATIO_4_3',
}

export interface IShotStatus {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface IShot {
  id: string;
  description: string;
  image: string | null;
  canvas?: CanvasDraw | null;
  canvasData?: string;
  order: number;
  name?: string;
  duration?: number;
  aspectRatio?: AspectRatio;

  status?: IShotStatus;
}

export interface IStoryboard {
  id: string;
  name: string;
  description: string;

  projectId: string;

  createdAt: Date;
  updatedAt: Date;
}