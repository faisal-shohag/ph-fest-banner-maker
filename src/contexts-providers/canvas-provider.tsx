import { useState, type ReactNode } from "react";
import {
  Canvas,
  FabricObject,
  FabricImage,
  ActiveSelection,
  Textbox,
  Rect,
  Circle,
  Triangle,
  Line,
  Group,
  Ellipse,
  Polygon,
  Path,
} from "fabric";
import { CanvasContext } from "./canvas-context";

const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [fabCanvas, setFabCanvas] = useState<Canvas | null>(null);
  const [clipboard, setClipboard] = useState<FabricObject | null>(null);
  const [openTextOptions, setOpenTextOption] = useState(false);
  const [openShapeOptions, setOpenShapeOptions] = useState(false);
  const [aspect, setAspect] = useState(1 / 1);
  const [isActive, setIsActive] = useState(false);
  const [opacity, setOpacity] = useState(1);

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
        setIsActive(true);
        setOpacity(1);
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

  const textOptionsApply = (option: string, value?: string) => {
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

    const currentStyles = textBox.getSelectionStyles(
      selectionStart,
      selectionEnd
    );
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
        newStyle.fontWeight =
          getCurrentStyleValue("fontWeight") === "bold" ? "normal" : "bold";
        break;
      case "italic":
        newStyle.fontStyle =
          getCurrentStyleValue("fontStyle") === "italic" ? "normal" : "italic";
        break;
      case "underline":
        newStyle.underline = !getCurrentStyleValue("underline");
        break;
      case "strike":
        newStyle.linethrough = !getCurrentStyleValue("linethrough");
        break;
      case "fontColor":
        newStyle.fill = value;
        break;
      case "fontFamily":
        newStyle.fontFamily = value;
        break;
      case "fontSize":
        newStyle.fontSize = parseInt(value!);
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

 const addShape = (shapeType, options = {}) => {
  if (!fabCanvas) return;

  // Default options
  const defaultOptions = {
    left: fabCanvas.width / 2,
    top: fabCanvas.height / 2,
    fill: "#3f9fff", // Fixed hex color
    stroke: "#3f9fff",
    strokeWidth: 2,
    rx: 10,
    ry: 10,
    selectable: true,
    evented: true,
  };

  // Merge provided options with defaults
  const shapeOptions:any = { ...defaultOptions, ...options };
  let shape;

   
      

  switch (shapeType.toLowerCase()) {
    case "rect":
    case "rectangle":
      shape = new Rect({
        width: shapeOptions.width || 100,
        height: shapeOptions.height || 100,
        ...shapeOptions,
      });
      break;

    case "circle":
      shape = new Circle({
        radius: shapeOptions.radius || 50,
        ...shapeOptions,
      });
      break;

    case "triangle":
      shape = new Triangle({
        width: shapeOptions.width || 100,
        height: shapeOptions.height || 100,
        ...shapeOptions,
      });
      break;

    case "line":
      shape = new Line(
        [
          shapeOptions.x1 || 0,
          shapeOptions.y1 || 0,
          shapeOptions.x2 || 100,
          shapeOptions.y2 || 100,
        ],
        {
          stroke: shapeOptions.stroke,
          strokeWidth: shapeOptions.strokeWidth,
          ...shapeOptions,
          fill: null, // Lines don't have fill
        }
      );
      break;

    case "arrow":{

     const arrowLength = shapeOptions.length || 100;
      const arrowHeadSize = shapeOptions.arrowHeadSize || 15;
      const strokeWidth = shapeOptions.strokeWidth || 2;
      
      // Create arrow shaft (line)
      const shaft = new Line([0, 8, arrowLength - arrowHeadSize, 8], {
        stroke: shapeOptions.stroke,
        strokeWidth: strokeWidth,
        originX: 'left',
        originY: 'center'
      });
      
      // Create arrowhead (triangle)
      const arrowHead = new Triangle({
        width: arrowHeadSize,
        height: arrowHeadSize,
        fill: shapeOptions.stroke,
        left: arrowLength - arrowHeadSize,
        top: 0,
        originX: 'left',
        originY: 'center',
        angle: 90
      });
    
      // Group shaft and arrowhead
      shape = new Group([shaft, arrowHead], {
        ...shapeOptions,
        fill: null // Group fill handled by individual objects
      });
      break;
    }
      

    case "ellipse":
    case "oval":
      shape = new Ellipse({
        rx: shapeOptions.rx || shapeOptions.width / 2 || 60,
        ry: shapeOptions.ry || shapeOptions.height / 2 || 40,
        ...shapeOptions,
      });
      break;

    case "polygon":
    case "hexagon": {
      const sides = shapeOptions.sides || 6;
      const radius = shapeOptions.radius || 50;
      const polygonPoints:any = [];
      
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        polygonPoints.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
      
      shape = new Polygon(polygonPoints, {
        ...shapeOptions,
      });
    }
      break;

    case "star": {
      const outerRadius = shapeOptions.outerRadius || 50;
      const innerRadius = shapeOptions.innerRadius || 25;
      const points = shapeOptions.points || 5;
      const starPoints:any = [];
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        starPoints.push({
          x: radius * Math.cos(angle - Math.PI / 2),
          y: radius * Math.sin(angle - Math.PI / 2)
        });
      }
      
      shape = new Polygon(starPoints, {
        ...shapeOptions,
      });
      break;
    }

    case "diamond":
    case "rhombus": {
      const size = shapeOptions.size || 50;
      const diamondPoints = [
        { x: 0, y: -size },      // top
        { x: size, y: 0 },       // right
        { x: 0, y: size },       // bottom
        { x: -size, y: 0 }       // left
      ];
      
      shape = new Polygon(diamondPoints, {
        ...shapeOptions,
      });
    }
      break;

    case "pentagon":
      shape = addShape("polygon", { ...shapeOptions, sides: 5 });
      return; // Early return to avoid duplicate processing

    case "octagon":
      shape = addShape("polygon", { ...shapeOptions, sides: 8 });
      return; // Early return to avoid duplicate processing

    case "heart": {
      const heartSize = shapeOptions.size || 50;
      const heartPath = `M ${heartSize},${heartSize * 0.3} 
        C ${heartSize},${heartSize * 0.1} ${heartSize * 0.7},${-heartSize * 0.1} ${heartSize * 0.5},${heartSize * 0.1}
        C ${heartSize * 0.3},${-heartSize * 0.1} 0,${heartSize * 0.1} 0,${heartSize * 0.3}
        C 0,${heartSize * 0.5} ${heartSize * 0.5},${heartSize * 0.9} ${heartSize * 0.5},${heartSize * 0.9}
        C ${heartSize * 0.5},${heartSize * 0.9} ${heartSize},${heartSize * 0.5} ${heartSize},${heartSize * 0.3} Z`;
      
      shape = new Path(heartPath, {
        ...shapeOptions,
        scaleX: 1,
        scaleY: 1
      });
      break;
    }
    default:
      console.warn(`Unsupported shape type: ${shapeType}`);
      return;
  }

  if (!shape) return;

  // Add shape to canvas
  fabCanvas.add(shape);

  // Set as active object
  fabCanvas.setActiveObject(shape);

  // Update canvas
  shape.setCoords();
  fabCanvas.requestRenderAll();

  return shape;
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
    setOpenTextOption(false);
    setOpenShapeOptions(false)
    if (activeObjects.length) {
      activeObjects.forEach((obj) => fabCanvas.remove(obj));
      setIsActive(false);
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

const exportCanvas = (format: "png" | "jpeg" | "svg", title: string, quality: number = 0.8, resolution:number=1) => {
  try {
    // console.log(`Exporting canvas as ${format}`);
    // console.log(`Canvas dimensions: ${fabCanvas?.width}x${fabCanvas?.height}`);
    console.log(quality)

    if (!fabCanvas) {
      throw new Error("Canvas is not initialized");
    }

    let url: string;
    let extension: string;

    if (format === "svg") {
      // Clean text objects before export to avoid invalid properties
      fabCanvas.getObjects().forEach((obj:any) => {
        if (obj.type === "text" || obj.type === "i-text" || obj.type === "textbox") {
          if (obj.textDecorationThickness) {
            obj.set("textDecorationThickness", undefined); // Remove invalid property
          }
        }
      });
      fabCanvas.renderAll();

      let svgString = fabCanvas.toSVG({
        suppressPreamble: false,
        encoding: "UTF-8",
      });

      if (!svgString) {
        throw new Error("Failed to generate SVG");
      }

      // Sanitize SVG to remove invalid text-decoration-thickness
      svgString = svgString = svgString
        .replace(/text-decoration-thickness:[^;]+;/g, "")
        .replace(/white-space:\s*pre;/g, "");

      // Log SVG for debugging
      console.log("Generated SVG:", svgString);

      // Validate SVG string
      if (!svgString.includes("<svg")) {
        throw new Error("Invalid SVG output: Missing <svg> tag");
      }

      // Create a Blob from the SVG string
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      url = URL.createObjectURL(blob);
      extension = "svg";
    } else {
      url = fabCanvas.toDataURL({
        format,
        quality,
        multiplier: resolution,
      });
      if (!url || url === "data:,") {
        throw new Error(`Failed to generate ${format.toUpperCase()} image`);
      }
      extension = format;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (format === "svg") {
      URL.revokeObjectURL(url);
    }
  } catch (e) {
    console.error("Export failed:", e);
    throw e; // Rethrow for UI feedback
  }
};

  fabCanvas?.on("mouse:down", (e) => {
    const target = e.target;
    if (!target) {
      setIsActive(false);
      setOpacity(1);
      return;
    }
    setIsActive(true);
    setOpacity(target.opacity);
    const activeObject = fabCanvas.getActiveObject();
    if (target.type == "image") {
      activeObject?.on("scaling", (e: any) => {
        const obj = e.target;
        obj.set({
          opacity: 1,
        });
        fabCanvas.renderAll();
      });
    }
  });

  const handleObjectOpacity = (value) => {
    setOpacity(value);
    if (!fabCanvas) return;
    const activeObject = fabCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("opacity", value);
      fabCanvas.renderAll();
    }
  };

  const saveCanvasToLocalStorage = () => {
    if (!fabCanvas) return;
    const dataJSON = fabCanvas.toJSON();
    console.log(dataJSON)
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
    saveCanvasToLocalStorage,
    isActive,
    opacity,
    setOpacity,
    handleObjectOpacity,
    addShape,
    openShapeOptions,
    setOpenShapeOptions,
  };

  return <CanvasContext value={value}>{children}</CanvasContext>;
};

export default CanvasProvider;
