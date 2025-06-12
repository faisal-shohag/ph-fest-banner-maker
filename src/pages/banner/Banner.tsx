import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Canvas, FabricImage, IText, FabricObject } from "fabric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Clipboard, Copy, Trash } from "lucide-react";

const Banner = () => {
  const [fabCanvas, setFabCanvas] = useState<Canvas | null>(null);
  const [_clipboard, setClipboard] = useState<FabricObject | null>(null)

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!fabCanvas) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;
      FabricImage.fromURL(imageUrl)
        .then((img: FabricImage) => {
          console.log(img);
          img.scaleToWidth(200);
          img.set({
            left: 100,
            top: 100,
            selectable: true,
          });

          fabCanvas.add(img);
          fabCanvas.renderAll();
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    };

    reader.readAsDataURL(file);
  };

  const handleImageFromURL = (e: ChangeEvent<HTMLInputElement>) => {
    if (!fabCanvas) return;

    const imageUrl = e.target.value;
    if (!imageUrl) return;

    FabricImage.fromURL(imageUrl)
      .then((img: FabricImage) => {
        img.scaleToWidth(img.height);
        img.scaleToHeight(img.width);
        img.set({
          left: 100,
          top: 100,
          selectable: true,
        });

        fabCanvas.add(img);
        fabCanvas.renderAll();
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });
  };

  const handleAddText = () => {
    if (!fabCanvas) return;

    const text = new IText("Hello World", {
      left: 100,
      top: 100,
      fill: "#000000",
      fontSize: 20,
      selectable: true,
    });

    fabCanvas.add(text);
    fabCanvas.renderAll();
  };

  const textBold = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      const iText = activeObject as IText;

      // Get the current selection range
      const selectionStart = iText.selectionStart || 0;
      const selectionEnd = iText.selectionEnd || 0;

      if (selectionStart !== selectionEnd) {
        // Check if the selected text is already bold
        const currentStyles = iText.getSelectionStyles(
          selectionStart,
          selectionEnd
        );
        const isBold = currentStyles.every(
          (style) => style.fontWeight === "bold"
        );

        // Apply or remove bold style to the selected range
        iText.setSelectionStyles(
          {
            fontWeight: isBold ? "normal" : "bold",
          },
          selectionStart,
          selectionEnd
        );

        fabCanvas.renderAll();
      }
    }
  };

  const copy = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      activeObject.clone()
      .then((cloned) => {
        setClipboard(cloned)
      })
    }
  };
  

  const paste = async () => {
    const clonedObj = await _clipboard.clone();
    
  }

  const deleteObject = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      fabCanvas.remove(activeObject);
      fabCanvas.renderAll();
    }
  };

  const bringFront = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      fabCanvas.bringObjectToFront(activeObject);
      fabCanvas.renderAll();
    }
  };

  const sendBack = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      fabCanvas.sendObjectToBack(activeObject);
      fabCanvas.renderAll();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Input type="url" onChange={handleImageFromURL} placeholder="Image URL" />
      <button onClick={handleAddText}>Add Text</button>
      <button onClick={textBold}>Bold</button>
      <FabCanvas deleteObject={deleteObject} bringFront={bringFront} sendBack={sendBack} height={500} width={500} setFabCanvas={setFabCanvas} />
    </div>
  );
};

type FabCanvasProps = {
  width?: number;
  height?: number;
  bgColor?: string;
  setFabCanvas: (canvas: Canvas) => void;
  bringFront?: () => void;
  sendBack?: () => void;
  deleteObject?: () => void;
};

const FabCanvas = ({
  width = 600,
  height = 600,
  bgColor = "#ffff",
  setFabCanvas,
  bringFront,
  sendBack,
  deleteObject
}: FabCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: bgColor,
        preserveObjectStacking: true,
      });

      setFabCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [width, height, bgColor, setFabCanvas]);

  return (
    <div className="border">
      <ContextMenu>
        <ContextMenuTrigger>
          <canvas ref={canvasRef} width={width} height={height} />
        </ContextMenuTrigger>

         <ContextMenuContent className="w-60">
        <ContextMenuItem>
            <Copy/> Copy 
             <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
         <ContextMenuItem>
            <Clipboard/> Paste 
             <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>

          <ContextMenuItem onClick={deleteObject}>
            <Trash/> Delete 
             <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
         <ContextMenuSeparator />
        <ContextMenuItem onClick={bringFront}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path fill="currentColor" d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25M15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.79L9 10.48v1.67L4.4 14.41l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"></path>
</svg> Bring Front
          <ContextMenuShortcut>Ctrl+Shift+F</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={sendBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path fill="currentColor" d="M 12.75 18.12 V 9.75 a 0.75 0.75 0 1 0 -1.5 0 v 8.37 l -2.26 -2.25 a 0.75 0.75 0 0 0 -1.06 1.06 l 2.83 2.82 c 0.68 0.69 1.79 0.69 2.47 0 l 2.83 -2.82 A 0.75 0.75 0 0 0 15 15.87 l -2.25 2.25 Z M 15 11.85 v 1.67 l 6.18 -3.04 a 1 1 0 0 0 0 -1.79 l -7.86 -3.86 a 3 3 0 0 0 -2.64 0 L 2.82 8.69 a 1 1 0 0 0 0 1.8 L 9 13.51 v -1.67 L 4.4 9.6 l 6.94 -3.42 c 0.42 -0.2 0.9 -0.2 1.32 0 L 19.6 9.6 L 15 11.85 Z"></path>
</svg> Send Back
          <ContextMenuShortcut>Ctrl+Shift+B</ContextMenuShortcut>
        </ContextMenuItem>
        
        {/* <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem> */}
        {/* <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Save Page...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub> */}
        {/* <ContextMenuSeparator />
        <ContextMenuCheckboxItem>
          Show Bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator /> */}
        {/* <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup> */}
      </ContextMenuContent>

      </ContextMenu>
    </div>
  );
};



export default Banner;
