import { CanvasContext } from "@/contexts-providers/canvas-context";
import { use } from "react";

export const useCanvas = () => {
  const context = use(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};