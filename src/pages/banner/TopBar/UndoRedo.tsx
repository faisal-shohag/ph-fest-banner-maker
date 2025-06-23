import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useCallback, useEffect, useState } from "react";
import HistoryFeature from "@/utils/canvas-history";

const UndoRedo: React.FC = () => {
  const { fabCanvas } = useCanvas() as any;
  const [historyFeature, setHistoryFeature] = useState<HistoryFeature | null>(
    null
  );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (fabCanvas && !historyFeature) {
      const history = new HistoryFeature(fabCanvas);
      setHistoryFeature(history);

      const updateButtonStates = () => {
        setCanUndo(history.canUndo());
        setCanRedo(history.canRedo());
      };

      fabCanvas.on("object:added", updateButtonStates);
      fabCanvas.on("object:removed", updateButtonStates);
      fabCanvas.on("object:modified", updateButtonStates);
      fabCanvas.on("object:skewing", updateButtonStates);
      fabCanvas.on("path:created", updateButtonStates);

      setTimeout(() => {
        history.onHistory();
        updateButtonStates();
      }, 100);

      return () => {
        fabCanvas.off("history:append", updateButtonStates);
        fabCanvas.off("history:undo", updateButtonStates);
        fabCanvas.off("history:redo", updateButtonStates);
        fabCanvas.off("history:clear", updateButtonStates);
      };
    }
  }, [fabCanvas, historyFeature]);

  const handleUndo = useCallback(() => {
    if (historyFeature && canUndo) {
      historyFeature.undo();
    }
  }, [historyFeature, canUndo]);

  const handleRedo = useCallback(() => {
    if (historyFeature && canRedo) {
      historyFeature.redo();
    }
  }, [historyFeature, canRedo]);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        handleUndo();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        handleRedo();
      }
    });
  }, [handleRedo, handleUndo]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="relative"
          title="Undo"
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <GrUndo />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="relative"
          title="Redo"
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <GrRedo />
        </Button>
      </div>
    </div>
  );
};

export default UndoRedo;
