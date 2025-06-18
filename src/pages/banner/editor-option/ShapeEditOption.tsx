import { Input } from "@/components/ui/input";
import { useCanvas } from "@/hooks/use-canvas";
import { debounce } from "lodash";
import { 
  Eye,
  EyeOff
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const ShapeEditOptions = () => {
  const { fabCanvas, openShapeOptions, setOpenShapeOptions} = useCanvas();
  
  const [shapeOptions, setShapeOptions] = useState({
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 1,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    visible: true,
  });

  // Debounced state update to prevent excessive re-renders
  const debouncedUpdateState = useMemo(
    () =>
      debounce((styles) => {
        setShapeOptions((prev) => ({ ...prev, ...styles }));
      }, 50),
    []
  );

  // Shape options apply function
  const shapeOptionsApply = useCallback((option: string, value?: any) => {
    if (!fabCanvas) return;
    const activeObject = fabCanvas.getActiveObject();
    if (!activeObject) return;

    // Skip text objects
    if (activeObject.type === "textbox" || activeObject.type === "text") return;

    const shape = activeObject as any;
    const width = Math.max(0, parseInt(value) || 0);
const opacity = Math.max(0, Math.min(1, parseFloat(value) || 1));
const scaleX = Math.max(0.1, parseFloat(value) || 1);
const scaleY = Math.max(0.1, parseFloat(value) || 1);
const angle = parseFloat(value) || 0;
    switch (option) {
      case "fillColor":
        shape.set("fill", value);
        break;
      case "strokeColor":
        shape.set("stroke", value);
        break;
      case "strokeWidth":
        
        shape.set("strokeWidth", width);
        break;
      case "opacity":
        
        shape.set("opacity", opacity);
        break;
      case "scaleX":
        
        shape.set("scaleX", scaleX);
        break;
      case "scaleY":
        
        shape.set("scaleY", scaleY);
        break;
      case "angle":
        
        shape.set("angle", angle);
        break;
      case "visible":
        shape.set("visible", value);
        break;
      case "flipHorizontal":
        shape.set("flipX", !shape.flipX);
        break;
      case "flipVertical":
        shape.set("flipY", !shape.flipY);
        break;
      default:
        break;
    }

    shape.setCoords();
    fabCanvas.requestRenderAll();
  }, [fabCanvas]);
 const shapeTypes = ['rectangle', 'circle', 'triangle', 'line', 'polyline', 'polygon', 'path']
 
  // Get current shape styles
  const getCurrentShapeStyles = useCallback(() => {
    if (!fabCanvas) return null;

    const activeObject:any = fabCanvas.getActiveObject();
    if (!activeObject || !shapeTypes.includes(activeObject.type)) return;

    const shape = activeObject as any;

    return {
      fill: shape.fill || "#000000",
      stroke: shape.stroke || "#000000",
      strokeWidth: shape.strokeWidth || 0,
      opacity: shape.opacity || 1,
      scaleX: shape.scaleX || 1,
      scaleY: shape.scaleY || 1,
      angle: shape.angle || 0,
      visible: shape.visible !== false,
    };
  }, [fabCanvas]);

  // Update shape options state
  const updateShapeOptionsState = useCallback(() => {
    const styles = getCurrentShapeStyles();
    if (styles) {
      const hasChanged = Object.keys(styles).some(
        (key) => shapeOptions[key] !== styles[key]
      );

      if (hasChanged) {
        debouncedUpdateState(styles);
      }
    }
  }, [getCurrentShapeStyles, shapeOptions, debouncedUpdateState]);

  // Apply shape option with state sync
  const applyShapeOption = useCallback(
    (option, value?: any) => {
      shapeOptionsApply(option, value);

      // Update state immediately for UI responsiveness
      switch (option) {
        case "fillColor":
          setShapeOptions((prev) => ({ ...prev, fill: value }));
          break;
        case "corner-radius":
            setShapeOptions((prev) => ({ ...prev, cornerRadius: parseInt(value) || 0 }));
            break;
        case "strokeColor":
          setShapeOptions((prev) => ({ ...prev, stroke: value }));
          break;
        case "strokeWidth":
          setShapeOptions((prev) => ({ ...prev, strokeWidth: parseInt(value) || 0 }));
          break;
        case "opacity":
          setShapeOptions((prev) => ({ ...prev, opacity: parseFloat(value) || 1 }));
          break;
        case "scaleX":
          setShapeOptions((prev) => ({ ...prev, scaleX: parseFloat(value) || 1 }));
          break;
        case "scaleY":
          setShapeOptions((prev) => ({ ...prev, scaleY: parseFloat(value) || 1 }));
          break;
        case "angle":
          setShapeOptions((prev) => ({ ...prev, angle: parseFloat(value) || 0 }));
          break;
        case "visible":
          setShapeOptions((prev) => ({ ...prev, visible: value }));
          break;
      }

      // Verify state after fabric.js updates
      setTimeout(updateShapeOptionsState, 10);
    },
    [shapeOptionsApply, updateShapeOptionsState]
  );

  // Mouse down handler
  const handleMouseDown = useCallback(
    (e) => {
      const target = e.target;
      const isShape = target && 
        shapeTypes.includes(target.type);

      if (isShape) {
        if (!openShapeOptions) {
          setOpenShapeOptions(true);
        }
        requestAnimationFrame(() => {
          updateShapeOptionsState();
        });
      } else if (openShapeOptions) {
        setOpenShapeOptions(false);
      }
    },
    [openShapeOptions, updateShapeOptionsState, setOpenShapeOptions]
  );

  // Selection change handler
  const handleSelectionChanged = useCallback(() => {
    const activeObject = fabCanvas?.getActiveObject();
    if (activeObject && shapeTypes.includes(activeObject.type)) {
      if (openShapeOptions) {
        requestAnimationFrame(updateShapeOptionsState);
      }
    }
  }, [openShapeOptions, updateShapeOptionsState, fabCanvas]);

  // Event handlers
  const handleFillColorChange = useCallback(
    (e) => applyShapeOption("fillColor", e.target.value),
    [applyShapeOption]
  );

  const handleStrokeColorChange = useCallback(
    (e) => applyShapeOption("strokeColor", e.target.value),
    [applyShapeOption]
  );

  const handleStrokeWidthChange = useCallback(
    (e) => applyShapeOption("strokeWidth", e.target.value),
    [applyShapeOption]
  );

  const handleVisibilityToggle = useCallback(
    () => applyShapeOption("visible", !shapeOptions.visible),
    [applyShapeOption, shapeOptions.visible]
  );

  // Event listeners setup
  useEffect(() => {
    if (!fabCanvas) return;

    const events = [
      ["mouse:down", handleMouseDown],
      ["selection:changed", handleSelectionChanged],
      ["object:modified", handleSelectionChanged],
    ];

    events.forEach(([event, handler]: any) => {
      fabCanvas.on(event, handler);
    });

    return () => {
      events.forEach(([event, handler]: any) => {
        fabCanvas.off(event, handler);
      });
    };
  }, [fabCanvas, handleMouseDown, handleSelectionChanged]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedUpdateState.cancel();
    };
  }, [debouncedUpdateState]);

  const getButtonClass = useCallback(
    (isActive = false) =>
      `${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-600"} 
     border hover:bg-blue-600 dark:text-white px-3 rounded-lg 
     transition-colors duration-150 flex items-center justify-center py-2`,
    []
  );

  if (!openShapeOptions) return null;

  return (
    <div>
      <dialog
        className="z-[9] bg-transparent animate__animated animate__fadeInDown animate__faster dark:text-white p-3 w-full rounded-xl top-10"
        open={openShapeOptions}
      >
        <div className="dark:bg-zinc-800 max-w-sm mx-auto rounded-xl px-5 py-2 flex gap-2 justify-center shadow-2xl bg-white items-center flex-wrap">
          
          {/* Fill Color */}
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Fill:</label>
            <Input
              onChange={handleFillColorChange}
              className="rounded-lg w-16 h-9 color-input"
              type="color"
              value={shapeOptions.fill}
              title="Fill Color"
            />
          </div>

          {/* Stroke Color */}
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Stroke:</label>
            <Input
              onChange={handleStrokeColorChange}
              className="rounded-lg w-16 h-9 color-input"
              type="color"
              value={shapeOptions.stroke}
              title="Stroke Color"
            />
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Width:</label>
            <Input
              onChange={handleStrokeWidthChange}
              className="rounded-lg w-16 h-9"
              type="number"
              min="0"
              max="50"
              value={shapeOptions.strokeWidth}
              title="Stroke Width"
            />
          </div>

          {/* Opacity */}
          {/* <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Opacity:</label>
            <Input
              onChange={handleOpacityChange}
              className="rounded-lg w-16 h-9"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={shapeOptions.opacity}
              title="Opacity"
            />
          </div> */}

          {/* Rotation */}
          {/* <div className="flex items-center gap-1">
            <label className="text-sm font-medium">Rotate:</label>
            <Input
              onChange={handleAngleChange}
              className="rounded-lg w-16 h-9"
              type="number"
              min="-360"
              max="360"
              value={Math.round(shapeOptions.angle)}
              title="Rotation Angle"
            />
          </div> */}

          {/* Visibility Toggle */}
          <button
            className={getButtonClass(shapeOptions.visible)}
            onClick={handleVisibilityToggle}
            title="Toggle Visibility"
            type="button"
          >
            {shapeOptions.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          {/* Flip Buttons */}
          {/* <button
            className={getButtonClass()}
            onClick={() => applyShapeOption("flipHorizontal")}
            title="Flip Horizontal"
            type="button"
          >
            ↔
          </button>

          <button
            className={getButtonClass()}
            onClick={() => applyShapeOption("flipVertical")}
            title="Flip Vertical"
            type="button"
          >
            ↕
          </button> */}

        </div>
      </dialog>
    </div>
  );
};

export default ShapeEditOptions;