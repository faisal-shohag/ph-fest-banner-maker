import { useState, type ReactNode } from "react";
import {
  Canvas,
  FabricObject,
  FabricImage,
  ActiveSelection,
  Textbox,
} from "fabric";
import { CanvasContext } from "./canvas-context";

const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [fabCanvas, setFabCanvas] = useState<Canvas | null>(null);
  const [clipboard, setClipboard] = useState<FabricObject | null>(null);
  const [openTextOptions, setOpenTextOption] = useState(false);
  const [aspect, setAspect] = useState(1 / 1);

  const handleImageFromURL = async (imageUrl: string) => {
    if (!fabCanvas || !imageUrl) return;
    FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" })
      .then((img: FabricImage) => {
        img.set({ crossOrigin: "anonymous" });
        img.scaleToWidth(Math.min(img.width ?? 0, fabCanvas.width ?? 500));
        img.scaleToHeight(Math.min(img.height ?? 0, fabCanvas.height ?? 500));
        img.set({
          left: 100,
          top: 100,
          selectable: true,
        });
        fabCanvas.add(img);
        fabCanvas.setActiveObject(img);
        fabCanvas.renderAll();
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });
  };

  const addText = () => {
    if (!fabCanvas) return;
    const textBox = new Textbox(
      "ঈদের অনাবিল আনন্দে ভরে উঠুক প্রতিটি হৃদয়। আপনার জীবনের প্রতিটি দিন ছেয়ে যাক ঈদের খুশিতে।",
      {
        width: 200,
        fontSize: 20,
        fill: "#eeee",
        fontFamily: '"Inter", sans-serif',
        editable: true,
        left: fabCanvas.width / 2,
        top: fabCanvas.height / 2,
        originX: "center",
        originY: "center",
      }
    );

    // fabCanvas.add(text);
    fabCanvas.add(textBox);
    // fabCanvas.setActiveObject(text);
    fabCanvas.renderAll();
  };

const textOptionsApply = (
  option: string,
  fontFamily?: string,
  fontColor?: string
) => {
  if (!fabCanvas) return;
  const activeObject = fabCanvas.getActiveObject();
  if (!(activeObject instanceof Textbox)) return;

  const textBox = activeObject as Textbox;

  // Ensure the Textbox is fully active
  fabCanvas.setActiveObject(textBox);
  
  // Get selection or default to entire text
  let selectionStart = textBox.selectionStart ?? 0;
  let selectionEnd = textBox.selectionEnd ?? textBox.text?.length ?? 0;

  // If no selection, select all text
  if (selectionStart === selectionEnd) {
    selectionStart = 0;
    selectionEnd = textBox.text?.length ?? 0;
    textBox.setSelectionStart(selectionStart);
    textBox.setSelectionEnd(selectionEnd);
  }

  const currentStyles = textBox.getSelectionStyles(selectionStart, selectionEnd);
  const newStyle: any = {};

  // Helper function to check if all characters have a specific style
  // const hasStyle = (styleProp: string, value: any) => {
  //   if (currentStyles.length === 0) {
  //     // If no styles, check the textbox property
  //     return textBox[styleProp] === value;
  //   }
  //   return currentStyles.every((style) => style[styleProp] === value);
  // };

  // Helper function to get current style value
  const getCurrentStyleValue = (styleProp: string) => {
    if (currentStyles.length === 0) {
      return textBox[styleProp];
    }
    return currentStyles[0]?.[styleProp] || textBox[styleProp];
  };

  switch (option) {
    case "bold":
      newStyle.fontWeight = getCurrentStyleValue('fontWeight') === "bold" ? "normal" : "bold";
      break;
    case "italic":
      newStyle.fontStyle = getCurrentStyleValue('fontStyle') === "italic" ? "normal" : "italic";
      break;
    case "underline":

      newStyle.underline = !getCurrentStyleValue('underline');
      break;
    case "strike":

      newStyle.linethrough = !getCurrentStyleValue('linethrough');
      break;
    case "fontColor":
      if (fontColor) newStyle.fill = fontColor;
      break;
    case "fontFamily":
      if (fontFamily) newStyle.fontFamily = fontFamily;
      break;
    case "alignLeft":
      textBox.set("textAlign", "left");
      break;
    case "alignCenter":
      textBox.set("textAlign", "center");
      break;
    case "alignRight":
      textBox.set("textAlign", "right");
      break;
    case "alignJustify":
      textBox.set("textAlign", "justify");
      break;
    default:
      break;
  }

  if (Object.keys(newStyle).length > 0) {
    textBox.setSelectionStyles(newStyle, selectionStart, selectionEnd);
    textBox.initDimensions();
    textBox.setCoords();
    textBox._clearCache();
    textBox.dirty = true;
    fabCanvas.requestRenderAll();
  }

  fabCanvas.renderAll();
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

  const deleteObject = () => {
    if (!fabCanvas) return;
    const activeObjects = fabCanvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => fabCanvas.remove(obj));
      fabCanvas.discardActiveObject();
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

  const handleCanvasBgImage = () => {
    if (!fabCanvas) return;
    const activeObject: any = fabCanvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject.type == "image" && activeObject._element.currentSrc) {
      FabricImage.fromURL(activeObject._element.currentSrc, {
        crossOrigin: "anonymous",
      })
        .then((img: FabricImage) => {
          const canvasWidth = fabCanvas.getWidth();
          const canvasHeight = fabCanvas.getHeight();
          const imgAspect = img.width / img.height;
          const canvasAspect = canvasWidth / canvasHeight;

          let scale = 1;
          if (imgAspect > canvasAspect) {
            // Image is wider than canvas, scale to height
            scale = canvasHeight / img.height;
          } else {
            // Image is taller than canvas, scale to width
            scale = canvasWidth / img.width;
          }

          img.set({
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
            scaleX: scale,
            scaleY: scale,
            selectable: false,
          });

          fabCanvas.backgroundImage = img;
          deleteObject();
          fabCanvas.renderAll();
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    }
  };

  const handleRemoveBg = () => {
    if (!fabCanvas) return;

    fabCanvas.backgroundImage = undefined;
    fabCanvas.renderAll(); // or requestRenderAll()
  };

  const aspectRatioControl = (value: string) => {
    const [w, h] = value.split(":").map(Number);
    setAspect(w / h);
  };

  const exportCanvas = (format, title: string) => {
    try {
      // Try using Fabric.js toDataURL directly (sometimes works better)
      console.log(fabCanvas?.height);
      console.log(fabCanvas?.width);
      const dataURL = fabCanvas?.toDataURL({
        format,
        quality: 1,
        multiplier: 2,
      });
      const link: any = document.createElement("a");
      link.href = dataURL;
      link.download = `${title}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  const saveCanvas = () => {
    if (!fabCanvas) return;
    const dataJSON = fabCanvas.toJSON();
    localStorage.setItem("savedCanvas", JSON.stringify(dataJSON));
  };

  // useEffect(() => {
  //     if (!fabCanvas) return;

  //     const text = new IText("Hello World", {
  //       left: 100,
  //       top: 100,
  //       fill: "#eeee",
  //       fontSize: 20,
  //       selectable: true,
  //     });

  //     fabCanvas.add(text);
  //     // fabCanvas.backgroundColor="red"
  //     fabCanvas.renderAll();

  //     // Cleanup
  //     return () => {
  //       fabCanvas?.dispose();
  //     };
  //   }, [fabCanvas])

  const value = {
    fabCanvas,
    setFabCanvas,
    openTextOptions,
    setOpenTextOption,
    aspect,
    handleImageFromURL,
    textOptionsApply,
    copy,
    paste,
    duplicate,
    deleteObject,
    bringFront,
    sendBack,
    aspectRatioControl,
    handleCanvasBgImage,
    handleRemoveBg,
    addText,
    exportCanvas,
    saveCanvas,
  };

  return <CanvasContext value={value}>{children}</CanvasContext>;
};

export default CanvasProvider;
