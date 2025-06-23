import { useEffect, useRef, useState } from "react";

export const CANVAS_CONFIG = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  DEFAULT_BG_COLOR: "#fff",
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10,
  ZOOM_SENSITIVITY: 0.002,
  ZOOM_STEP: 0.1,
  ZOOM_THROTTLE_DELAY: 150,
} as const;

export const useZoomControls = (wrapperRef: React.RefObject<HTMLDivElement>) => {
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const throttledZoom = useRef<NodeJS.Timeout | null>(null);

  const resetZoom = () => {
    setZoom(1);
    if (wrapperRef.current) {
      wrapperRef.current.style.transformOrigin = "center center";
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.1, CANVAS_CONFIG.MAX_ZOOM);
    setZoom(newZoom);
    resetTransformOrigin();
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom * 0.9, CANVAS_CONFIG.MIN_ZOOM);
    setZoom(newZoom);
    resetTransformOrigin();
  };

  const resetTransformOrigin = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transformOrigin = "center center";
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
    resetTransformOrigin();
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();

      if (throttledZoom.current) {
        clearTimeout(throttledZoom.current);
      }

      setIsZooming(true);

      const delta = -e.deltaY;
      const zoomFactor = 1 + delta * CANVAS_CONFIG.ZOOM_SENSITIVITY;
      let newZoom = zoom * zoomFactor;

      newZoom = Math.min(Math.max(newZoom, CANVAS_CONFIG.MIN_ZOOM), CANVAS_CONFIG.MAX_ZOOM);

      const rect = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const originX = (mouseX / rect.width) * 100;
      const originY = (mouseY / rect.height) * 100;

      wrapper.style.transformOrigin = `${originX}% ${originY}%`;
      setZoom(newZoom);

      throttledZoom.current = setTimeout(() => {
        setIsZooming(false);
      }, CANVAS_CONFIG.ZOOM_THROTTLE_DELAY);
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        resetZoom();
      }
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    wrapper.addEventListener("dblclick", handleDoubleClick);

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("dblclick", handleDoubleClick);
      if (throttledZoom.current) {
        clearTimeout(throttledZoom.current);
      }
    };
  }, [zoom]);

  return {
    zoom,
    isZooming,
    zoomPercentage: Math.round(zoom * 100),
    zoomIn,
    zoomOut,
    resetZoom,
    handleZoomChange,
  };
};