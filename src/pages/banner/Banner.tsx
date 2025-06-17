import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "fabric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoDuplicateOutline } from "react-icons/io5";
import {
  Clipboard,
  Copy,
  Image,
  ImageMinus,
  Italic,
  Strikethrough,
  Trash2,
  Underline,
} from "lucide-react";
import { ImBold } from "react-icons/im";
import { Slider } from "@/components/ui/slider";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { useCanvas } from "@/hooks/use-canvas";
import {fontFamily, textAlignOptions } from "@/lib/constants";
import { debounce } from "lodash";

const Banner = () => {
  const { fabCanvas } =
    useCanvas();


  useEffect(() => {
    if (!fabCanvas) return;
    const savedLocalCanvas: any = localStorage.getItem("savedCanvas");
    if (!savedLocalCanvas) return;

    fabCanvas.loadFromJSON(JSON.parse(savedLocalCanvas), () => {
      fabCanvas.renderAll();
      console.log("Canvas loaded and rendered.");
    });

    setTimeout(() => {
      fabCanvas.renderAll();
    }, 1000);
  }, [fabCanvas]);

 

  fabCanvas?.on("selection:created", (e) => {
    const selectedObjects = e.selected; // Get all selected objects
    selectedObjects.forEach((obj) => {
      obj.set({
        borderColor: "#3B82F6", // Blue border for selection
        cornerColor: "#FFF", // White corner handles
        cornerSize: 8, // Larger corner size for easier grabbing
        cornerStyle: "circle", // Circular corner handles
        transparentCorners: false, // Solid corner fills
        hasControls: true, // Enable resizing/rotating controls
        borderScaleFactor: 2, // Thicker selection border
        cornerStrokeColor: "#FFFFFF", // White outline for corners
        cornerStrokeWidth: 1, // Stroke width for corner outlines
        shadow: {
          color: "rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
          blur: 5,
          offsetX: 2,
          offsetY: 2,
        },
        hoverCursor: "grab", // Hand cursor on hover
      });
    });
    fabCanvas.renderAll(); // Ensure changes are rendered
  });

 
  // Update styling when selection is updated
  fabCanvas?.on("selection:updated", (e) => {
    const selectedObjects = e.selected; // Get all selected objects
    selectedObjects.forEach((obj) => {
      obj.set({
        borderColor: "#3B82F6", // Blue border for selection
        cornerColor: "#FFF", // White corner handles
        cornerSize: 8, // Larger corner size for easier grabbing
        cornerStyle: "circle", // Circular corner handles
        transparentCorners: false, // Solid corner fills
        hasControls: true, // Enable resizing/rotating controls
        borderScaleFactor: 2, // Thicker selection border
        cornerStrokeColor: "#FFFFFF", // White outline for corners
        cornerStrokeWidth: 1, // Stroke width for corner outlines
        shadow: {
          color: "rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
          blur: 5,
          offsetX: 2,
          offsetY: 2,
        },
        hoverCursor: "grab", // Hand cursor on hover
      });
    });
    fabCanvas.renderAll(); // Ensure changes are rendered
  });

  // Clear styling when selection is cleared
  fabCanvas?.on("selection:cleared", (e) => {
    const deselectedObjects = e.deselected || [];
    deselectedObjects.forEach((obj) => {
      obj.set({
        borderColor: null, // Reset border color
        cornerColor: null, // Reset corner color
        cornerSize: 6, // Default corner size
        cornerStyle: "rect", // Default corner style
        transparentCorners: true, // Default corner transparency
        borderScaleFactor: 1, // Default border thickness
        cornerStrokeColor: null, // Reset corner stroke
        cornerStrokeWidth: 0, // Reset corner stroke width
        shadow: null, // Remove shadow
        hoverCursor: "move", // Default cursor
      });
    });
    fabCanvas.renderAll(); // Ensure changes are rendered
  });


  // fabCanvas?.on("mouse:wheel", (opt) => {
  //   if (!fabCanvas) return;

  //   const delta = opt.e.deltaY;
  //   const ctrlKey = opt.e.ctrlKey;

  //   if (ctrlKey) {
  //     opt.e.preventDefault();
  //     opt.e.stopPropagation();

  //     // Get the pointer position relative to the canvas
  //     const pointer = fabCanvas.getPointer(opt.e);

  //     // Current zoom level
  //     let zoom = fabCanvas.getZoom();

  //     // Calculate zoom factor (positive delta = zoom out, negative = zoom in)
  //     const zoomFactor = delta > 0 ? 0.9 : 1.1;
  //     zoom *= zoomFactor;

  //     // Apply zoom limits
  //     if (zoom > 20) zoom = 20; // Max zoom
  //     if (zoom < 0.1) zoom = 0.1; // Min zoom

  //     // Zoom to the mouse pointer position instead of canvas center
  //     fabCanvas.zoomToPoint(new Point(pointer.x, pointer.y), zoom);
  //     fabCanvas.renderAll();
  //   }
  // });

  return (
    <div className="flex">
      <TopBar />
      <div>
        <SideBar /> 
      </div>

  

      <div className="flex-1">
            <TextEditOption/>
        <FabCanvas />
      </div>
    </div>
  );
};

const TextEditOption = () => {
  const { textOptionsApply, fabCanvas, openTextOptions, setOpenTextOption } = useCanvas();
  const [textAlignIndex, setTextAlignIndex] = useState(0); 
  const [textAlign, setTextAlign] = useState(textAlignOptions[0]);
  const [textOptions, setTextOptions] = useState({
    fontFamily: '',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
    linethrough: false,
    fill: '#000000',
    textAlign: 'left'
  });

  // Debounced state update to prevent excessive re-renders
  const debouncedUpdateState = useMemo(
    () => debounce((styles) => {
      setTextOptions(prev => ({ ...prev, ...styles }));
    }, 50),
    []
  );

  // Memoized function to get current text styles
  const getCurrentTextStyles = useCallback(() => {
    if (!fabCanvas) return null;
    
    const activeObject = fabCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== "textbox") return null;
    
    const textBox:any = activeObject;
    let selectionStart = textBox.selectionStart ?? 0;
    let selectionEnd = textBox.selectionEnd ?? textBox.text?.length ?? 0;
    
    // If no selection, get styles from first character or textbox defaults
    if (selectionStart === selectionEnd) {
      selectionStart = 0;
      selectionEnd = Math.min(1, textBox.text?.length ?? 0);
    }
    
    const selectionStyles = textBox.getSelectionStyles(selectionStart, selectionEnd);
    const firstCharStyle = selectionStyles[0] || {};
    
    return {
      fontFamily: firstCharStyle.fontFamily || textBox.fontFamily || '',
      fontWeight: firstCharStyle.fontWeight || textBox.fontWeight || 'normal',
      fontStyle: firstCharStyle.fontStyle || textBox.fontStyle || 'normal',
      underline: Boolean(firstCharStyle.underline || textBox.underline),
      linethrough: Boolean(firstCharStyle.linethrough || textBox.linethrough),
      fill: firstCharStyle.fill || textBox.fill || '#000000',
      textAlign: textBox.textAlign || 'left'
    };
  }, [fabCanvas]);

  // Optimized function to update text options state
  const updateTextOptionsState = useCallback(() => {
    const styles = getCurrentTextStyles();
    if (styles) {
      // Only update if styles have actually changed
      const hasChanged = Object.keys(styles).some(key => 
        textOptions[key] !== styles[key]
      );
      
      if (hasChanged) {
        debouncedUpdateState(styles);
      }
    }
  }, [getCurrentTextStyles, textOptions, debouncedUpdateState]);

  // Enhanced text option application with state sync
  const applyTextOption = useCallback((option, value?:any) => {
    textOptionsApply(option, value);
    
    // Update state immediately for UI responsiveness
    switch (option) {
      case 'bold':
        setTextOptions(prev => ({
          ...prev,
          fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold'
        }));
        break;
      case 'italic':
        setTextOptions(prev => ({
          ...prev,
          fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic'
        }));
        break;
      case 'underline':
        setTextOptions(prev => ({
          ...prev,
          underline: !prev.underline
        }));
        break;
      case 'strike':
        setTextOptions(prev => ({
          ...prev,
          linethrough: !prev.linethrough
        }));
        break;
      case 'fontFamily':
        setTextOptions(prev => ({
          ...prev,
          fontFamily: value
        }));
        break;
      case 'fontColor':
        setTextOptions(prev => ({
          ...prev,
          fill: value
        }));
        break;
    }
    
    // Verify state after fabric.js updates
    setTimeout(updateTextOptionsState, 10);
  }, [textOptionsApply, updateTextOptionsState]);

  // Keyboard shortcuts with preventDefault
  const handleKeyDown = useCallback((e) => {
    if (!openTextOptions || !e.ctrlKey) return;
    
    const shortcuts = {
      'b': 'bold',
      'i': 'italic', 
      'u': 'underline',
      's': 'strike'
    };
    
    const action = shortcuts[e.key.toLowerCase()];
    if (action) {
      e.preventDefault();
      e.stopPropagation();
      applyTextOption(action);
    }
  }, [openTextOptions, applyTextOption]);

  // Optimized mouse down handler
  const handleMouseDown = useCallback((e) => {
    const target = e.target;
    const isTextbox = target && target.type === "textbox";
    
    if (isTextbox) {
      if (!openTextOptions) {
        setOpenTextOption(true);
      }
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        updateTextOptionsState();
      });
    } else if (openTextOptions) {
      setOpenTextOption(false);
    }
  }, [openTextOptions, setOpenTextOption, updateTextOptionsState]);

  // Selection change handler
  const handleSelectionChanged = useCallback(() => {
    if (openTextOptions) {
      requestAnimationFrame(updateTextOptionsState);
    }
  }, [openTextOptions, updateTextOptionsState]);

  // Text alignment toggle
  const handleTextAlignToggle = useCallback(() => {
    const newIndex = (textAlignIndex + 1) % textAlignOptions.length;
    const newAlign = textAlignOptions[newIndex];
    
    setTextAlignIndex(newIndex);
    setTextAlign(newAlign);
    
    textOptionsApply(newAlign.align);
    setTextOptions(prev => ({ ...prev, textAlign: newAlign.align }));
  }, [textAlignIndex, textOptionsApply]);

  // Font family change handler
  const handleFontFamilyChange = useCallback((value) => {
    applyTextOption("fontFamily", value);
  }, [applyTextOption]);

  // Color change handler
  const handleColorChange = useCallback((e) => {
    const color = e.target.value;
    applyTextOption("fontColor", color);
  }, [applyTextOption]);

  // Event listeners setup
  useEffect(() => {
    if (!fabCanvas) return;
    
    const events = [
      ['mouse:down', handleMouseDown],
      ['selection:changed', handleSelectionChanged],
      ['text:selection:changed', handleSelectionChanged],
      ['text:changed', handleSelectionChanged]
    ];
    
    events.forEach(([event, handler] : any) => {
      fabCanvas.on(event, handler);
    });
    
    return () => {
      events.forEach(([event, handler] : any) => {
        fabCanvas.off(event, handler);
      });
    };
  }, [fabCanvas, handleMouseDown, handleSelectionChanged]);

  // Keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedUpdateState.cancel();
    };
  }, [debouncedUpdateState]);

  // Memoized button classes for performance
  const getButtonClass = useCallback((isActive) => 
    `${isActive ? 'bg-pink-600 text-white' : 'hover:bg-pink-600'} 
     border hover:bg-pink-600 dark:text-white px-3 rounded-lg 
     transition-colors duration-150 flex items-center justify-center`,
    []
  );

  if (!openTextOptions) return null;

  return (
    <div>
      <dialog
        className="z-[9] bg-transparent animate__animated animate__fadeInDown animate__faster dark:text-white p-3 w-full rounded-xl top-10"
        open={openTextOptions}
      >
        <div className="dark:bg-zinc-800 max-w-lg mx-auto rounded-xl px-5 py-2 flex gap-2 justify-center shadow-2xl bg-white">
          
          {/* Font Family Selector */}
          <Select
            value={textOptions.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Family</SelectLabel>
                {fontFamily.map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    <div
                      className="flex gap-10 justify-between w-full items-center"
                      style={{ fontFamily: font.family }}
                    >
                      {font.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Bold Button */}
          <button 
            className={getButtonClass(textOptions.fontWeight === 'bold')}
            onClick={() => applyTextOption("bold")}
            title="Bold (Ctrl+B)"
            type="button"
          >
            <ImBold />
          </button>
          
          {/* Italic Button */}
          <button 
            className={getButtonClass(textOptions.fontStyle === 'italic')}
            onClick={() => applyTextOption("italic")}
            title="Italic (Ctrl+I)"
            type="button"
          >
            <Italic size={18} />
          </button>
          
          {/* Underline Button */}
          <button 
            className={getButtonClass(textOptions.underline)}
            onClick={() => applyTextOption("underline")}
            title="Underline (Ctrl+U)"
            type="button"
          >
            <Underline />
          </button>
          
          {/* Strikethrough Button */}
          <button 
            className={getButtonClass(textOptions.linethrough)}
            onClick={() => applyTextOption("strike")}
            title="Strikethrough (Ctrl+S)"
            type="button"
          >
            <Strikethrough />
          </button>
          
          {/* Text Alignment Button */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleTextAlignToggle}
            title="Text Alignment"
            type="button"
          >
            <textAlign.Icon />
          </Button>
          
          {/* Color Picker */}
          <Input
            onChange={handleColorChange}
            className="rounded-lg w-20 h-9"
            type="color"
            value={textOptions.fill}
            title="Text Color"
          />
        </div>
      </dialog>
    </div>
  );
};


type FabCanvasProps = {
  width?: number;
  height?: number;
  bgColor?: string;
};

const FabCanvas = ({
  width = 800,
  height = 600,
  bgColor = "#2222",
}: FabCanvasProps) => {
  const {
    setFabCanvas,
    aspect,
    copy,
    paste,
    duplicate,
    deleteObject,
    bringFront,
    sendBack,
    handleCanvasBgImage,
    handleRemoveBg,
  } = useCanvas();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);

  // Throttle zoom updates for better performance
  const throttledZoom = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // const newWidth = Math.min(canvasRef.current.offsetWidth, width);
      const canvas = new Canvas(canvasRef.current, {
        width: width,
        height: height,
        backgroundColor: bgColor,
        preserveObjectStacking: true,
      });

      setFabCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [width, height, bgColor, setFabCanvas, aspect]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      // Only zoom when Ctrl/Cmd is held
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();

      // Clear any existing throttle
      if (throttledZoom.current) {
        clearTimeout(throttledZoom.current);
      }

      // Set zooming state for smoother transitions
      setIsZooming(true);

      // Calculate zoom delta with better sensitivity
      const delta = -e.deltaY;
      const zoomSensitivity = 0.002; // More granular control
      const zoomFactor = 1 + delta * zoomSensitivity;

      // Calculate new zoom with exponential scaling for natural feel
      let newZoom = zoom * zoomFactor;

      // Professional zoom levels (similar to Figma/Sketch)
      const minZoom = 0.1;
      const maxZoom = 10;
      newZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

      // Get mouse position relative to wrapper
      const rect = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Set transform origin to mouse position
      const originX = (mouseX / rect.width) * 100;
      const originY = (mouseY / rect.height) * 100;

      wrapper.style.transformOrigin = `${originX}% ${originY}%`;

      setZoom(newZoom);

      // Reset zooming state after a delay
      throttledZoom.current = setTimeout(() => {
        setIsZooming(false);
      }, 150);
    };

    // Handle zoom reset on double-click
    const handleDoubleClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(1);
        wrapper.style.transformOrigin = "center center";
      }
    };

    // Add event listeners with proper options
    wrapper.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    wrapper.addEventListener("dblclick", handleDoubleClick);

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("dblclick", handleDoubleClick);
      if (throttledZoom.current) {
        clearTimeout(throttledZoom.current);
      }
    };
  }, [zoom]);

  // Format zoom percentage for display
  const zoomPercentage = Math.round(zoom * 100);

  // const aspectFormat = {
  //   "1.78": "16:9",
  //   "1.00": "1:1",
  // };

  return (
    <div className="w-full flex flex-col justify-center items-center h-full relative">
      {/* <div className="my-2 pt-5">
        <Select
          onValueChange={(value) => {
            aspectRatioControl(value);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue
              placeholder={aspectFormat[aspect.toFixed(2).toString()]}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="16:9">16:9</SelectItem>

            
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={wrapperRef}
            className="relative"
            style={{
              transform: `scale(${zoom})`,
              transition: isZooming
                ? "transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transformOrigin: "center center",
              width,
              height,
              cursor: "grab",
            }}
            onMouseDown={(e) => {
              if (e.target === wrapperRef.current) {
                e.currentTarget.style.cursor = "grabbing";
              }
            }}
            onMouseUp={() => {
              if (wrapperRef.current) {
                wrapperRef.current.style.cursor = "grab";
              }
            }}
          >
            <canvas
              className="mx-auto block"
              ref={canvasRef}
              width={width}
              height={height}
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-60">
          <ContextMenuItem onClick={copy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
            <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={paste}>
            <Clipboard className="w-4 h-4 mr-2" />
            Paste
            <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={duplicate}>
            <IoDuplicateOutline className="w-4 h-4 mr-2" />
            Duplicate
            <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onClick={deleteObject}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
            <ContextMenuShortcut>Del</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={bringFront}>
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25M15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.79L9 10.48v1.67L4.4 14.41l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z" />
            </svg>
            Bring Front
            <ContextMenuShortcut>Ctrl+Shift+F</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onClick={sendBack}>
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M 12.75 18.12 V 9.75 a 0.75 0.75 0 1 0 -1.5 0 v 8.37 l -2.26 -2.25 a 0.75 0.75 0 0 0 -1.06 1.06 l 2.83 2.82 c 0.68 0.69 1.79 0.69 2.47 0 l 2.83 -2.82 A 0.75 0.75 0 0 0 15 15.87 l -2.25 2.25 Z M 15 11.85 v 1.67 l 6.18 -3.04 a 1 1 0 0 0 0 -1.79 l -7.86 -3.86 a 3 3 0 0 0 -2.64 0 L 2.82 8.69 a 1 1 0 0 0 0 1.8 L 9 13.51 v -1.67 L 4.4 9.6 l 6.94 -3.42 c 0.42 -0.2 0.9 -0.2 1.32 0 L 19.6 9.6 L 15 11.85 Z" />
            </svg>
            Send Back
            <ContextMenuShortcut>Ctrl+Shift+B</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() => {
              setZoom(1);
              if (wrapperRef.current) {
                wrapperRef.current.style.transformOrigin = "center center";
              }
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
            </svg>
            Reset Zoom
            <ContextMenuShortcut>Ctrl+0</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCanvasBgImage}>
            <Image className="w-4 h-4 mr-2" />
            Set as backgound
          </ContextMenuItem>

          <ContextMenuItem onClick={handleRemoveBg}>
            <ImageMinus className="w-4 h-4 mr-2" />
            Remove backgound
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Zoom Controls */}
      <div className="mt-4  z-40 flex items-center gap-3 bg-white border dark:bg-zinc-900  rounded-lg px-4 py-2 shadow-sm">
        {/* Zoom Out Button */}
        <button
          onClick={() => {
            const newZoom = Math.max(zoom * 0.9, 0.1);
            setZoom(newZoom);
            if (wrapperRef.current) {
              wrapperRef.current.style.transformOrigin = "center center";
            }
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            <path d="M7 9v1h5V9H7z" />
          </svg>
        </button>

        {/* Zoom Slider */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-xs text-gray-500 dark:text-white font-mono w-8">
            10%
          </span>
          <Slider
            value={[zoom]}
            onValueChange={(value) => {
              setZoom(value[0]);
              if (wrapperRef.current) {
                wrapperRef.current.style.transformOrigin = "center center";
              }
            }}
            min={0.1}
            max={10}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs dark:text-white text-gray-500 font-mono w-12">
            1000%
          </span>
        </div>

        {/* Zoom In Button */}
        <button
          onClick={() => {
            const newZoom = Math.min(zoom * 1.1, 10);
            setZoom(newZoom);
            if (wrapperRef.current) {
              wrapperRef.current.style.transformOrigin = "center center";
            }
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            <path d="M10 7H9v2H7v1h2v2h1v-2h2V9h-2V7z" />
          </svg>
        </button>

        {/* Current Zoom Display */}
        <div className="text-sm font-mono text-gray-700 dark:bg-zinc-900 dark:text-white bg-gray-50 px-2 py-1 rounded border min-w-[50px] text-center">
          {zoomPercentage}%
        </div>

        {/* Reset Zoom Button */}
        <button
          onClick={() => {
            setZoom(1);
            if (wrapperRef.current) {
              wrapperRef.current.style.transformOrigin = "center center";
            }
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Reset Zoom (100%)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Banner;
