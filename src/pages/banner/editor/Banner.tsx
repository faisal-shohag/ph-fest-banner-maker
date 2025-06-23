import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Canvas } from "fabric";
import { Toaster } from "react-hot-toast";
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      imageSmoothingEnabled: true,
      enableRetinaScaling: true,
      preserveObjectStacking: true,
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
  }, [bgColor, setFabCanvas, isLoading, template]);

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
    <div className="w-full flex flex-col justify-center items-center h-full relative">
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
              width: canvasPresets[template.type].width,
              height: canvasPresets[template.type].height,
              cursor: "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <canvas
              className="mx-auto block"
              ref={canvasRef}
              width={canvasPresets[template.type].width}
              height={canvasPresets[template.type].height}
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
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
    </div>
  );
};

const Banner = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["editor-template"],
    staleTime: 0,
    queryFn: async () => {
      const response = await api.get(`/template/${id}`);
      return response.data;
    },
  });

  const template = data as Template | null;

  if (error) return <div>Error occurred!</div>;

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

      <Toaster />
    </div>
  );
};

export default Banner;
