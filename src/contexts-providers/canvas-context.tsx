import type { Canvas } from "fabric";
import { createContext } from "react";

export interface CanvasContextType {
  fabCanvas: Canvas | null;
  setFabCanvas: (canvas: Canvas | null) => void;
  openTextOptions: boolean;
  isActive: boolean;
  setOpenTextOption: (isOpen: boolean) => void;
  aspect: number;
  handleImageFromURL: (imageUrl: string) => void;
  textOptionsApply: (
    option: string,
    fontFamily?: string,
    fontColor?: string
  ) => void;
  copy: () => void;
  paste: () => void;
  duplicate: () => void;
  deleteObject: () => void;
  bringFront: () => void;
  sendBack: () => void;
  aspectRatioControl: (value: string) => void;
  handleCanvasBgImage: () => void;
  handleRemoveBg: () => void;
  addText: () => void;
  exportCanvas: (format:any, title:string) => void;
  saveCanvas: () => void;
  opacity: number;
  setOpacity:(opacity: number) => void;
  handleObjectOpacity: (opacity: number) => void;
  addShape: (shape: string, options?:any) => void;
  openShapeOptions: boolean;
  setOpenShapeOptions: (openShapeOption:boolean) => void;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);