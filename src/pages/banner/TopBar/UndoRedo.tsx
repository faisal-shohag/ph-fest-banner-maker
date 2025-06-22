import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { useEffect, useState } from "react";
import { GrRedo, GrUndo } from "react-icons/gr";

const UndoRedo: React.FC = () => {
  const { fabCanvas } = useCanvas();
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);

  // Save initial state
  useEffect(() => {
    if (fabCanvas) {
      // Save initial canvas state
      setUndoHistory([fabCanvas?.toJSON()]);

      // Listen for canvas changes
      const handleObjectModified = () => {
        setUndoHistory((prev) => [...prev, fabCanvas?.toJSON()]);
        setRedoHistory([]); // Clear redo history on new action
      };

      fabCanvas.on("object:modified", handleObjectModified);
      fabCanvas.on("object:added", handleObjectModified);
      fabCanvas.on("object:removed", handleObjectModified);

      // Cleanup event listeners
      return () => {
        fabCanvas.off("object:modified", handleObjectModified);
        fabCanvas.off("object:added", handleObjectModified);
        fabCanvas.off("object:removed", handleObjectModified);
      };
    }
  }, [fabCanvas]);

  const handleUndo = () => {
    if (undoHistory.length <= 1) return; // Keep at least one state

    const currentState = undoHistory[undoHistory.length - 1];
    const previousState = undoHistory[undoHistory.length - 2];

    setRedoHistory((prev) => [...prev, currentState]);
    setUndoHistory((prev) => prev.slice(0, -1));

    if (fabCanvas && previousState) {
      fabCanvas.loadFromJSON(previousState, () => {
        fabCanvas.renderAll();
      });
    }
    setTimeout(() => {
      fabCanvas?.renderAll();
    }, 500);
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;

    const nextState = redoHistory[redoHistory.length - 1];
    setUndoHistory((prev) => [...prev, nextState]);
    setRedoHistory((prev) => prev.slice(0, -1));

    if (fabCanvas && nextState) {
      fabCanvas.loadFromJSON(nextState, () => {
        fabCanvas.renderAll();
      });
    }
    setTimeout(() => {
      fabCanvas?.renderAll();
    }, 500);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          onClick={handleUndo}
          size="sm"
          variant="outline"
          className="relative"
          title="Undo"
          disabled={undoHistory.length <= 1}
        >
          <GrUndo />
        </Button>
        <Button
          onClick={handleRedo}
          size="sm"
          variant="outline"
          className="relative"
          title="Redo"
          disabled={redoHistory.length === 0}
        >
          <GrRedo />
        </Button>
      </div>
    </div>
  );
};

export default UndoRedo;
