import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  ActiveSelection,
  Canvas,
  FabricImage,
  FabricObject,
  IText,
} from "fabric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
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
} from "@/components/ui/select"
import { IoDuplicateOutline } from "react-icons/io5";
import { Clipboard, Copy, Italic, Strikethrough, Trash2, Underline } from "lucide-react";
import { ImBold } from "react-icons/im";

const Banner = () => {
  const [fabCanvas, setFabCanvas] = useState<Canvas | null>(null);
  const [clipboard, setClipboard] = useState<FabricObject | null>(null);
  const [openTextOptions, setOpenTextOption] = useState(false)


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!fabCanvas) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;
      FabricImage.fromURL(imageUrl)
        .then((img: FabricImage) => {
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

 const textOptionsApply = (option: string, fontFamily?:string, fontColor?:string) => {
  if (!fabCanvas) return;

  const activeObject = fabCanvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    const iText = activeObject as IText;

    // Get the current selection range
    const selectionStart = iText.selectionStart || 0;
    let selectionEnd = iText.selectionEnd || 0;
    if (selectionStart === 0 && selectionEnd === 0) {
      selectionEnd = iText.text.length;
    }

    const currentStyles = iText.getSelectionStyles(selectionStart, selectionEnd);

    switch (option) {
      case 'bold':

        iText.setSelectionStyles(
          { fontWeight: currentStyles.every((style) => style.fontWeight === 'bold') ? 'normal' : 'bold' },
          selectionStart,
          selectionEnd
        );
        break;
      case 'italic':
        iText.setSelectionStyles(
          { fontStyle: currentStyles.every((style) => style.fontStyle === 'italic') ? 'normal' : 'italic' },
          selectionStart,
          selectionEnd
        );
        break;
      case 'underline':
        iText.setSelectionStyles(
          { underline: currentStyles.every((style) => style.underline === true) ? false : true },
          selectionStart,
          selectionEnd
        );
        break;
      case 'strike':
        iText.setSelectionStyles(
          { linethrough:  currentStyles.every((style) => style.linethrough === true) ? false : true },
          selectionStart,
          selectionEnd
        );
        break;
      case 'fontColor':
        if (fontColor) {
          iText.setSelectionStyles({ fill: fontColor }, selectionStart, selectionEnd);
        }
        break;
      case 'fontFamily':
          iText.setSelectionStyles({fontFamily}, selectionStart, selectionEnd);
        break;
    }

    fabCanvas.renderAll();
  }
};
  const copy = () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      activeObject.clone().then((cloned) => {
        setClipboard(cloned);
      });
    }
  };

  const paste = async () => {
    if (!fabCanvas || !clipboard) return;

    try {
      const clonedObj = await clipboard.clone();
      fabCanvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left! + 10, // Offset to avoid overlapping
        top: clonedObj.top! + 10,
        selectable: true,
      });

      if (clonedObj instanceof ActiveSelection) {
        clonedObj.canvas = fabCanvas;
        clonedObj.forEachObject((obj) => {
          fabCanvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        fabCanvas.add(clonedObj);
      }

      clipboard.top += 10;
      clipboard.left += 10;
      fabCanvas.setActiveObject(clonedObj);
      fabCanvas.requestRenderAll();
    } catch (error) {
      console.error("Paste failed:", error);
    }
  };

  const duplicate = async () => {
    if (!fabCanvas) return;

    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      const clonedObj = await activeObject.clone();
      clonedObj.set({
        left: clonedObj.left! + 10, // Offset to avoid overlapping
        top: clonedObj.top! + 10,
        selectable: true,
      });

      if (clonedObj instanceof ActiveSelection) {
        clonedObj.canvas = fabCanvas;
        clonedObj.forEachObject((obj) => {
          fabCanvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        fabCanvas.add(clonedObj);
      }

      fabCanvas.setActiveObject(clonedObj);
      fabCanvas.requestRenderAll();
    }
  };
  
 fabCanvas?.on('mouse:down', (options) => {
  const target = options.target;
  if (target && target.type === 'i-text') {
    if(!openTextOptions) setOpenTextOption(true)
  } else{
    if(openTextOptions) setOpenTextOption(false)
  }
});

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

  const fontFamily = [
 {
  title: 'Lora',
  family: '"Lora", serif'
 },
 {
  title: 'Roboto',
  family: '"Roboto", sans-serif'
 },
 {
  title: 'Inter',
  family: '"Inter", sans-serif'
 },
  ]


  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Input type="url" onChange={handleImageFromURL} placeholder="Image URL" />
      <button onClick={handleAddText}>Add Text</button>
      <dialog className="z-50 bg-transparent animate__animated animate__fadeInDown animate__faster  dark:text-white p-3 w-full rounded-xl top-0" open={openTextOptions}>
      <div className="dark:bg-zinc-800 max-w-lg mx-auto rounded-xl px-5 py-2 flex gap-2 justify-center shadow-2xl bg-white">

      <Select onValueChange={(value) => textOptionsApply('fontFamily', value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Font Family" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Font Family</SelectLabel>
          {
            fontFamily.map((font, index) => (
              <SelectItem style={{fontFamily: font.family}} key={index+122334} value={font.family}>{font.title}</SelectItem>
            ))
          }
          
        </SelectGroup>
      </SelectContent>
    </Select>

      <Button size={'sm'} variant={'outline'} onClick={() => textOptionsApply('bold')}><ImBold/></Button>
      <Button size={'sm'} variant={'outline'} onClick={() => textOptionsApply('italic')}><Italic/></Button>
      <Button size={'sm'} variant={'outline'} onClick={() => textOptionsApply('underline')}><Underline/></Button>
      <Button size={'sm'} variant={'outline'} onClick={() => textOptionsApply('strike')}><Strikethrough/></Button>
      <Input onChange={(e) => {textOptionsApply('fontColor', '', e.target.value)}} className="rounded-lg w-20" type="color" defaultValue={'#000'}/>
        </div>
      </dialog>
      <FabCanvas
        duplicate={duplicate}
        copy={copy}
        paste={paste}
        deleteObject={deleteObject}
        bringFront={bringFront}
        sendBack={sendBack}
        setFabCanvas={setFabCanvas}
      />
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
  copy?: () => void;
  paste?: () => void;
  duplicate?: () => void;
  handleObjectClick?: () => void;
};

const FabCanvas = ({
  width = 800,
  height = 500,
  bgColor = "#ffff",
  setFabCanvas,
  bringFront,
  sendBack,
  deleteObject,
  copy,
  paste,
  duplicate,
  handleObjectClick
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
    <div className="w-full flex justify-center">
      <ContextMenu>
        <ContextMenuTrigger>
          <canvas className=" mx-auto" onClick={handleObjectClick} ref={canvasRef} width={width} height={height} />
        </ContextMenuTrigger>

        <ContextMenuContent className="w-60">
          <ContextMenuItem onClick={copy}>
            <Copy /> Copy
            <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={paste}>
            <Clipboard /> Paste
            <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={duplicate}>
            <IoDuplicateOutline /> Duplicate
                <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onClick={deleteObject}>
            <Trash2 /> Delete
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={bringFront}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25M15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.79L9 10.48v1.67L4.4 14.41l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"
              ></path>
            </svg>{" "}
            Bring Front
            <ContextMenuShortcut>Ctrl+Shift+F</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={sendBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M 12.75 18.12 V 9.75 a 0.75 0.75 0 1 0 -1.5 0 v 8.37 l -2.26 -2.25 a 0.75 0.75 0 0 0 -1.06 1.06 l 2.83 2.82 c 0.68 0.69 1.79 0.69 2.47 0 l 2.83 -2.82 A 0.75 0.75 0 0 0 15 15.87 l -2.25 2.25 Z M 15 11.85 v 1.67 l 6.18 -3.04 a 1 1 0 0 0 0 -1.79 l -7.86 -3.86 a 3 3 0 0 0 -2.64 0 L 2.82 8.69 a 1 1 0 0 0 0 1.8 L 9 13.51 v -1.67 L 4.4 9.6 l 6.94 -3.42 c 0.42 -0.2 0.9 -0.2 1.32 0 L 19.6 9.6 L 15 11.85 Z"
              ></path>
            </svg>{" "}
            Send Back
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
