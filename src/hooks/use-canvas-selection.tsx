import { Canvas } from "fabric";
import { useEffect } from "react";

const SELECTION_STYLES = {
  SELECTED: {
    borderColor: "#3B82F6",
    cornerColor: "#FFF",
    cornerSize: 8,
    cornerStyle: "circle" as const,
    transparentCorners: false,
    hasControls: true,
    borderScaleFactor: 2,
    cornerStrokeColor: "#FFFFFF",
    cornerStrokeWidth: 1,
    shadow: {
      color: "rgba(0, 0, 0, 0.3)",
      blur: 5,
      offsetX: 2,
      offsetY: 2,
    },
    hoverCursor: "grab",
  },
  DESELECTED: {
    borderColor: null,
    cornerColor: null,
    cornerSize: 6,
    cornerStyle: "rect" as const,
    transparentCorners: true,
    borderScaleFactor: 1,
    cornerStrokeColor: null,
    cornerStrokeWidth: 0,
    shadow: null,
    hoverCursor: "move",
  },
} as const;


export const useCanvasSelection = (fabCanvas: Canvas | null) => {
  useEffect(() => {
    if (!fabCanvas) return;

    const applySelectionStyles = (objects: any[], styles: any) => {
      objects.forEach((obj) => obj.set(styles));
      fabCanvas.renderAll();
    };

    const handleSelectionCreated = (e: any) => {
      applySelectionStyles(e.selected, SELECTION_STYLES.SELECTED);
    };

    const handleSelectionUpdated = (e: any) => {
      applySelectionStyles(e.selected, SELECTION_STYLES.SELECTED);
    };

    const handleSelectionCleared = (e: any) => {
      const deselectedObjects = e.deselected || [];
      applySelectionStyles(deselectedObjects, SELECTION_STYLES.DESELECTED);
    };

    fabCanvas.on("selection:created", handleSelectionCreated);
    fabCanvas.on("selection:updated", handleSelectionUpdated);
    fabCanvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      fabCanvas.off("selection:created", handleSelectionCreated);
      fabCanvas.off("selection:updated", handleSelectionUpdated);
      fabCanvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [fabCanvas]);
};