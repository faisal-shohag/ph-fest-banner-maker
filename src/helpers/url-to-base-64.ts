import  { Canvas } from "fabric";

export const urlToBase64 = (url: string): Promise<string> => {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };


  export const cloneCanvasWithBase64Images = async (
    canvas: Canvas
  ): Promise<Canvas> => {
    const clonedCanvas = new Canvas(undefined);
    const json = canvas.toJSON();

    for (const obj of json.objects) {
      if (
        obj.type === "image" &&
        typeof obj.src === "string" &&
        !obj.src.startsWith("data:")
      ) {
        try {
          const base64 = await urlToBase64(obj.src);
          obj.src = base64;
        } catch (err) {
          console.warn(`Failed to convert ${obj.src} to base64`, err);
        }
      }
    }

    return new Promise((resolve) => {
      clonedCanvas.loadFromJSON(json, () => {
        clonedCanvas.renderAll();
        resolve(clonedCanvas);
      });
    });
  };