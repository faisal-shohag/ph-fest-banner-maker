import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Canvas } from "fabric";
import { Loader2 } from "lucide-react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useCanvas } from "@/hooks/use-canvas";
import api from "@/lib/api";
import { ZoomControls } from "./ZoomControls";
import { CanvasContextMenu } from "./ContextMenu";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar";
import TextEditOption from "../editor-option/TextEditOption";
import ShapeEditOptions from "../editor-option/ShapeEditOption";
import { CANVAS_CONFIG, useZoomControls } from "@/hooks/use-zoom-controlls";
import { useCanvasSelection } from "@/hooks/use-canvas-selection";
import { AlignGuidelines } from "fabric_guideline";
import { canvasPresets } from '@/lib/constants'
import '@/utils/canvas-history'

type Template = {
  id: string;
  title: string;
  tags: string[];
  isPublic: boolean;
  canvas: any;
  type: string,
};

type FabCanvasProps = {
  width?: number;
  height?: number;
  bgColor?: string;
  isLoading: boolean;
  template: Template;
};

const LoadingOverlay = () => (
  <div className="absolute z-50 left-0 top-0 w-full h-full gap-2 flex justify-center items-center">
    <Loader2 className="animate-spin" />
    Canvas being ready...
  </div>
);

const FabCanvas = ({
  bgColor = CANVAS_CONFIG.DEFAULT_BG_COLOR,
  isLoading,
  template,
}: FabCanvasProps) => {
  const { setFabCanvas, fabCanvas } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement | null>(null) as any;
  const wrapperRef = useRef<HTMLDivElement | null>(null) as any;
  const containerRef = useRef<HTMLDivElement | null>(null) as any;
  
  const [canvasDisplaySize, setCanvasDisplaySize] = useState({
    width: 0,
    height: 0,
    scale: 1
  });

  // Flag to track if canvas size has been calculated
  const [isSizeCalculated, setIsSizeCalculated] = useState(false);

  const {
    zoom,
    isZooming,
    zoomPercentage,
    zoomIn,
    zoomOut,
    resetZoom,
    handleZoomChange,
  } = useZoomControls(wrapperRef);

  useCanvasSelection(fabCanvas);

  // Calculate responsive canvas size (only once)
  const calculateCanvasSize = useCallback(() => {
    if (!containerRef.current || isSizeCalculated) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Get original canvas dimensions
    const originalWidth = canvasPresets[template.type].width;
    const originalHeight = canvasPresets[template.type].height;
    
    // Calculate available space (with some padding for zoom controls and UI)
    const availableWidth = containerRect.width - 190; // 50px padding on each side
    const availableHeight = containerRect.height - 200; // Space for zoom controls and padding
    
    // Calculate scale factors for both dimensions
    const widthScale = availableWidth / originalWidth;
    const heightScale = availableHeight / originalHeight;
    
    // Use the smaller scale to ensure the canvas fits in both dimensions
    const scale = Math.min(widthScale, heightScale, 1); // Don't scale up beyond original size
    
    // Calculate display dimensions
    const displayWidth = originalWidth * scale;
    const displayHeight = originalHeight * scale;
    
    setCanvasDisplaySize({
      width: displayWidth,
      height: displayHeight,
      scale: scale
    });

    // Mark size as calculated
    setIsSizeCalculated(true);
  }, [template, isSizeCalculated]);

  // Calculate size only once when component mounts or template changes
  useEffect(() => {
    // Reset the flag when template changes
    setIsSizeCalculated(false);
  }, [template.type]);

  useEffect(() => {
    if (!isSizeCalculated) {
      calculateCanvasSize();
    }
  }, [calculateCanvasSize, isSizeCalculated]);

  // Monitor container size changes only for initial calculation
  useEffect(() => {
    if (!containerRef.current || isSizeCalculated) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (!isSizeCalculated) {
        calculateCanvasSize();
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [template.type, calculateCanvasSize, isSizeCalculated]);

  useEffect(() => {
    if (!canvasRef.current || canvasDisplaySize.width === 0) return;

    const canvas = new Canvas(canvasRef.current, {
      imageSmoothingEnabled: true,
      enableRetinaScaling: true,
      preserveObjectStacking: true,
      // Use original dimensions for fabric.js canvas
      height: canvasPresets[template.type].height,
      width: canvasPresets[template.type].width,
    });

    const guideline = new AlignGuidelines({canvas});
    guideline.init();
    
    canvas.loadFromJSON(template.canvas).then(() => {
      canvas.renderAll();
    });

    setFabCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [bgColor, setFabCanvas, isLoading, template, canvasDisplaySize]);

  const handleMouseDown = (e: any) => {
    if (e.target === wrapperRef.current) {
      e.currentTarget.style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.cursor = "grab";
    }
  };


  return (
    <div 
      ref={containerRef}
      className="w-full flex flex-col justify-center items-center h-full relative"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={wrapperRef}
            className="relative rounded-sm overflow-hidden"
            style={{
              transform: `scale(${zoom})`,
              transition: isZooming
                ? "transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transformOrigin: "center center",
              // Use calculated display dimensions
              width: canvasDisplaySize.width,
              height: canvasDisplaySize.height,
              cursor: "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <canvas
              className="mx-auto block"
              ref={canvasRef}
              // Use calculated display dimensions for the HTML canvas element
              width={canvasDisplaySize.width}
              height={canvasDisplaySize.height}
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                // Scale the canvas content to fit the display size
                transform: `scale(${canvasDisplaySize.scale})`,
                transformOrigin: "top left",
                // Adjust the container to account for scaling
                width: canvasPresets[template.type].width * canvasDisplaySize.scale,
                height: canvasPresets[template.type].height * canvasDisplaySize.scale,
              }}
            />
          </div>
        </ContextMenuTrigger>

        <CanvasContextMenu onResetZoom={resetZoom} />
      </ContextMenu>

      <ZoomControls
        zoom={zoom}
        zoomPercentage={zoomPercentage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onZoomChange={handleZoomChange}
        minZoom={CANVAS_CONFIG.MIN_ZOOM}
        maxZoom={CANVAS_CONFIG.MAX_ZOOM}
      />
      
      {/* Optional: Display canvas info */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
        {canvasPresets[template.type].width} × {canvasPresets[template.type].height} 
        {canvasDisplaySize.scale < 1 && ` (${Math.round(canvasDisplaySize.scale * 100)}%)`}
      </div>
    </div>
  );
};

const Banner = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getTemplate(){
          const response = await api.get(`/template/${id}`);
          setIsLoading(false)
          setTemplate(response.data);
        }
        getTemplate()
  }, [id])

  return (
    <div className="flex">
      {template ? (
        <TopBar
          templateTitle={template.title}
          templateId={template.id}
          tags={template.tags}
          publish={template.isPublic}
        />
      ) : (
        <div className="fixed pl-20 dark:bg-zinc-900 bg-zinc-100 shadow-2xl py-2 px-7 z-[9] w-full h-14 flex justify-between" />
      )}

      <div>
        <SideBar />
      </div>

      <div className="flex-1">
        <TextEditOption />
        <ShapeEditOptions />
        {isLoading && <LoadingOverlay />}
        {template && <FabCanvas template={template} isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default Banner;
