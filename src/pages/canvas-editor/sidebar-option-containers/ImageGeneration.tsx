import { useState, use } from "react";
// import { Client } from "@gradio/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { AuthContext } from "@/contexts-providers/auth-context";
import api from "@/lib/api";
import { imageKit } from "@/lib/constants";
import { GoogleGenAI, Modality } from '@google/genai'
import {
  Sparkles,
  Download,
  Wand2,
  Image as ImageIcon,
  Palette,
  Zap,
  // Loader2Icon,
} from "lucide-react";
import { BiImageAdd } from "react-icons/bi";
import toast from "react-hot-toast";
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });


const FluxImageGenerator = () => {
  const [prompt, setPrompt] = useState(
    "a cute cat holding a sign written, 'Hero Canvas.'"
  );
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [isRemoving, setIsRemoving] = useState(false);
  const [selectedSize, setSelectedSize] = useState({
    name: "Logo", width: 500, height: 500
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const { fabCanvas, handleImageFromURL } = useCanvas();
  const { user } = use(AuthContext) as any;
  const queryClient = useQueryClient();

  const predefinedSizes = [
    { name: "Square", width: 1024, height: 1024, icon: "⬜" },
    { name: "Portrait", width: 768, height: 1024, icon: "📱" },
    { name: "Landscape", width: 1024, height: 768, icon: "🖥️" },
    { name: "Logo", width: 500, height: 500, icon: "🔥" },
  ];

  // Add canvas size if available
  const allSizes = fabCanvas
    ? [
        {
          name: "Canvas",
          width: fabCanvas.width,
          height: fabCanvas.height,
          icon: "🎨",
        },
        ...predefinedSizes,
      ]
    : predefinedSizes;

  // Mutation to save image to database
  const saveImageMutation = useMutation({
    mutationFn: async (imageData: {
      title: string;
      url: string;
      userId: string;
      meta: any;
      type: string;
    }) => {
      const response = await api.post("/image", imageData);
      return response.data;
    },
    onSuccess: (data) => {
      handleImageFromURL(data.url);
      setUploadStatus("Upload and save successful!");

      // Invalidate and refetch images query if you have one
      queryClient.invalidateQueries({ queryKey: ["images"] });

      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    },
    onError: (error: any) => {
      console.error("Database save error:", error);
      setUploadStatus(
        `Save failed: ${error.response?.data?.error || error.message}`
      );
      setTimeout(() => setUploadStatus(""), 5000);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const resizeImage = (file, maxWidth = 1920, maxHeight = 1080) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale dimensions proportionally
        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= scale;
        height *= scale;

        canvas.width = width;
        canvas.height = height;

        const ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject("Canvas toBlob failed");
          }
        }, file.type || "image/jpeg");
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadToImageKit = async (imageBlob: Blob, fileName: string) => {
    setIsUploading(true);
    setUploadStatus("Uploading to ImageKit...");

    try {
      const resizedBlob: any = await resizeImage(imageBlob, 1920, 1080);
      const resizedFile = new File([resizedBlob], fileName, {
        type: "image/png",
      });

      // Upload to ImageKit
      const result = await imageKit.upload({
        file: resizedFile as any,
        fileName: fileName,
        folder: "/banner-images",
      });

      console.log("ImageKit upload result:", result);
      setUploadStatus("Saving to database...");

      const imageData = {
        title: result.name,
        url: result.url,
        userId: user?.id,
        meta: result,
        type: "ai",
      };

      saveImageMutation.mutate(imageData);
    } catch (error: any) {
      console.error("ImageKit upload error:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setTimeout(() => setUploadStatus(""), 5000);
      setIsUploading(false);
    }
  };

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   setImageUrl(null);

  //   try {
  //     const client = await Client.connect("gokaygokay/Chroma");
  //     const result = await client.predict("/generate_image", {
  //       prompt,
  //       seed: 4,
  //       negative_prompt: 'low quality, ugly, unfinished, out of focus, deformed, disfigure, blurry, smudged, restricted palette, flat colors',
  //       // randomize_seed: true,
  //       width: selectedSize.width,
  //       height: selectedSize.height,
  //       steps: 26,
  //       cfg: 4,
  //     });

  //     if (result.data && result.data[0]) {
  //       setImageUrl(result.data[0].url);
  //     }
  //   } catch (error:any) {
  //     toast.error(error.message)
  //     console.error("Error generating image:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const handleGenerate = async () => {
  //   setLoading(true);
  //   setImageUrl(null);

  //   try {
  //     const client = await Client.connect("black-forest-labs/FLUX.1-dev");
  //     const result = await client.predict("/infer", {
  //       prompt,
  //       seed: 0,
  //       randomize_seed: true,
  //       width: selectedSize.width,
  //       height: selectedSize.height,
  //       guidance_scale: 7.5,
  //       num_inference_steps: 25,
  //     });

  //     if (result.data && result.data[0]) {
  //       setImageUrl(result.data[0].url);
  //     }
  //   } catch (error:any) {
  //     toast.error(error.message)
  //     console.error("Error generating image:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

      const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);

    console.log(import.meta.env.VITE_GEMINI_API_KEY)

    try {
     const result:any = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = result.candidates[0].content.parts;
    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart){ toast.error('image-generation error'); return}

    const dataimage:any = `data:image/png;base64,${imagePart.inlineData.data}` ;
    


        setImageUrl(dataimage);

    } catch (error:any) {
      toast.error(error.message)
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };


  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.setAttribute("target", "_blank");
      link.download = `generated-image-${Date.now()}.png`;
      link.click();
    }
  };

  const handleAddToDatabaseAndCanvas = async () => {
    setIsUploading(true)
    if (!imageUrl || !user?.id) {
      setUploadStatus(
        "Please ensure you're logged in and have an image generated"
      );
         setIsUploading(false)
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    try {
      // Convert image URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Generate filename
      const fileName = `flux-generated-${Date.now()}.png`;

      // Upload to ImageKit and save to database
      await uploadToImageKit(blob, fileName);
    } catch (error) {
         setIsUploading(false)
      console.error("Error adding image to database:", error);
      setUploadStatus("Failed to add image to database");
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  // const handleRemoveBg = async () => {
  //   setIsRemoving(true);
  //   const url = await fetch(imageUrl as any);
  //   const image = await url.blob();
  //   const client = await Client.connect("not-lain/background-removal");
  //   try {
  //     const result = await client.predict("/image", {
  //       image: image,
  //     });
  //     if (result.data && result.data[0]) {
  //       setImageUrl(result.data[0][0].url);
  //     }
  //     setIsRemoving(false);
  //   } catch (error) {
  //     setIsRemoving(false);
  //     console.log(error);
  //   }
  // };

  const isProcessing = isUploading || saveImageMutation.isPending;

  return (
    <div className=" min-w-[300px]  from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="">
        <div className="grid gap-3 ">
          <div className="space-y-3">
            <div className=" backdrop-blur-xl rounded-xl p-2 shadow-xl border">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Creative Prompt
                </h3>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className=""
                placeholder="Describe your vision in detail..."
              />
            </div>

            {/* Size Selection */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Select size
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg px-2 py-1 border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedSize.name === size.name
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                        : "border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 hover:border-blue-300 dark:hover:border-blue-400"
                    }`}
                  >
                    <div className="flex flex-col justify-center text-center items-center gap-2">
                      <span className="text-2xl">{size.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-slate-800 dark:text-slate-200">
                          {size.name}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">
                          {size.width} × {size.height}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group "
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-medium">Generating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                  <Wand2 className="w-5 h-5" />
                  <span className=" font-medium">Generate Image</span>
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                </div>
              )}
            </Button>
          </div>

          {/* Image Display */}
          <div className="space-y-3">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="relative">
                {loading && (
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative flex justify-center">
                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
                          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <div className="">
                        <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                          Crafting your vision...
                        </div>
                        <span className="text-xs">
                          It can take a bit longer...
                        </span>
                        <div className="flex justify-center mt-5">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {imageUrl && !loading && (
                  <div className="relative group">
                       <Button onClick={downloadImage} variant={'outline'} size={'icon'} className="absolute right-1 z-40"><Download size={17}/></Button>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={imageUrl}
                      alt="Generated artwork"
                      className="w-full rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                      style={{
                        aspectRatio: `${selectedSize.width}/${selectedSize.height}`,
                        objectFit: "cover",
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl shadow-inner opacity-30"></div>
                  </div>
                )}

                <div className="flex items-center justify-center mt-4 gap-2">
                  {imageUrl && (
                    <>
                 
                      {/* <Button
                        onClick={handleRemoveBg}
                        variant="outline"
                        size="sm"
                        className="rounded-xl hover:scale-105 transition-transform"
                      >
                        {isRemoving ? (
                          <div className="flex items-center gap-1">
                            <span className="animate-spin">
                              <Loader2Icon className="w-4 h-4" />
                            </span>
                            <span>Removing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span>
                              <Download className="w-4 h-4" />
                            </span>
                            <span>Remove bg</span>
                          </div>
                        )}
                      </Button> */}

                      <Button
                        onClick={handleAddToDatabaseAndCanvas}
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                        className={`rounded-xl hover:scale-105 transition-transform ${
                          isProcessing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <BiImageAdd className="w-4 h-4" />
                            Add to canvas
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>

                {/* Upload Status Message */}
                {uploadStatus && (
                  <div
                    className={`mt-4 p-3 rounded-md text-center text-sm ${
                      uploadStatus.includes("failed") ||
                      uploadStatus.includes("Failed") ||
                      uploadStatus.includes("Save failed")
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                        : uploadStatus.includes("successful")
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {uploadStatus}
                  </div>
                )}

                {!imageUrl && !loading && (
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <div className="text-center space-y-4 px-2">
                      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto w-fit">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          Your masterpiece will appear here
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Enter a prompt and click generate to begin
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-200/30 dark:border-blue-700/30">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium text-sm">
                  Selected: {selectedSize.name} ({selectedSize.width}×
                  {selectedSize.height})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxImageGenerator;
