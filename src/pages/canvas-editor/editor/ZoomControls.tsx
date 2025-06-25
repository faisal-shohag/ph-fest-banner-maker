import { Slider } from "@/components/ui/slider";

type ZoomControlsProps = {
  zoom: number;
  zoomPercentage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onZoomChange: (value: number[]) => void;
  minZoom: number;
  maxZoom: number;
};

export const ZoomControls = ({
  zoom,
  zoomPercentage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onZoomChange,
  minZoom,
  maxZoom,
}: ZoomControlsProps) => {
  const minPercentage = Math.round(minZoom * 100);
  const maxPercentage = Math.round(maxZoom * 100);

  return (
    <div className="mt-4 z-40 flex items-center gap-3 bg-white border dark:bg-zinc-900 rounded-lg px-4 py-2 shadow-sm fixed bottom-4 ">
      {/* Zoom Out Button */}
      <button
        onClick={onZoomOut}
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
          {minPercentage}%
        </span>
        <Slider
          value={[zoom]}
          onValueChange={onZoomChange}
          min={minZoom}
          max={maxZoom}
          step={0.1}
          className="flex-1"
        />
        <span className="text-xs dark:text-white text-gray-500 font-mono w-12">
          {maxPercentage}%
        </span>
      </div>

      {/* Zoom In Button */}
      <button
        onClick={onZoomIn}
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
        onClick={onResetZoom}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Reset Zoom (100%)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
      </button>
    </div>
  );
};