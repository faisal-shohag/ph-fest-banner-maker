import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { IoDuplicateOutline } from "react-icons/io5";
import {
  Clipboard,
  Copy,
  Image,
  ImageMinus,
  Trash2,
} from "lucide-react";
import { useCanvas } from "@/hooks/use-canvas";
import { useEffect } from "react";

type CanvasContextMenuProps = {
  onResetZoom: () => void;
};

export const CanvasContextMenu = ({ onResetZoom }: CanvasContextMenuProps) => {
  const {
    copy,
    paste,
    duplicate,
    deleteObject,
    bringFront,
    sendBack,
    handleCanvasBgImage,
    handleRemoveBg,
  } = useCanvas();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
     if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        duplicate();
      }
      // Delete: Delete
      else if (event.key === 'Delete') {
        event.preventDefault();
        deleteObject();
      }
      // Bring Front: Ctrl+Shift+F or Cmd+Shift+F
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        bringFront();
      }
      // Send Back: Ctrl+Shift+B or Cmd+Shift+B
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault();
        sendBack();
      }
      // Reset Zoom: Ctrl+0 or Cmd+0
      else if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault();
        onResetZoom();
      }
      // Set as background: Ctrl+Shift+I or Cmd+Shift+I
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        handleCanvasBgImage();
      }
      // Remove background: Ctrl+Shift+R or Cmd+Shift+R
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        handleRemoveBg();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [copy, paste, duplicate, deleteObject, bringFront, sendBack, onResetZoom, handleCanvasBgImage, handleRemoveBg]);

  return (
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

      <ContextMenuItem onClick={onResetZoom}>
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
        </svg>
        Reset Zoom
        <ContextMenuShortcut>Ctrl+0</ContextMenuShortcut>
      </ContextMenuItem>
      
      <ContextMenuItem onClick={handleCanvasBgImage}>
        <Image className="w-4 h-4 mr-2" />
        Set as background
      </ContextMenuItem>

      <ContextMenuItem onClick={handleRemoveBg}>
        <ImageMinus className="w-4 h-4 mr-2" />
        Remove background
      </ContextMenuItem>
    </ContextMenuContent>
  );
};