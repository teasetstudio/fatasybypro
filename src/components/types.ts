import CanvasDraw from "react-canvas-draw";

export interface IFrame {
  id: string;
  description: string;
  image: string | null;
  canvas?: CanvasDraw | null;
  canvasData?: string;
}
