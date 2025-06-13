import { use, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageKit from "imagekit";
import { AuthContext } from "@/contexts-providers/auth-context";
import api from "@/lib/api";
import Images from "./Images";

const ImageGallery = ({handleImageFromURL}) => {
  const fileInputRef = useRef(null) as any;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { user } = use(AuthContext) as any;
  const queryClient = useQueryClient();

  const imageKit: any = new ImageKit({
    publicKey: "public_E1kM7KJqAME5gAI9Is7mxzYgt9A=",
    privateKey: "private_EBzs2Uj2ygbrHYy7+/yDjZhUcIs=",
    urlEndpoint: "https://ik.imagekit.io/anf",
  });

  // Mutation to save image to database
  const saveImageMutation = useMutation({
    mutationFn: async (imageData: {
      title: string;
      url: string;
      userId: string;
      meta: any;
    }) => {
      const response = await api.post("/image", imageData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Image saved to database:", data);
      setUploadStatus("Upload and save successful!");
      
      // Invalidate and refetch images query if you have one
      queryClient.invalidateQueries({ queryKey: ["images"] });
      
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    },
    onError: (error: any) => {
      console.error("Database save error:", error);
      setUploadStatus(`Save failed: ${error.response?.data?.error || error.message}`);
      setTimeout(() => setUploadStatus(""), 5000);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadToImageKit = async (file: any) => {
    setIsUploading(true);
    setUploadStatus("Uploading to ImageKit...");

    try {
      // Read file as data URL for ImageKit upload
      const reader = new FileReader();
      const filePromise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const fileData: any = await filePromise;

      // Upload to ImageKit
      const result = await imageKit.upload({
        file: fileData,
        fileName: file.name,
        folder: "/banner-images",
      });
      
      console.log("ImageKit upload result:", result);
      setUploadStatus("Saving to database...");

      // Save to database using TanStack Query mutation
      const imageData = {
        title: result.name,
        url: result.url,
        userId: user?.id,
        meta: result,
      };

      saveImageMutation.mutate(imageData);

    } catch (error: any) {
      console.error("ImageKit upload error:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setTimeout(() => setUploadStatus(""), 5000);
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadStatus("Please select a valid image file");
        setTimeout(() => setUploadStatus(""), 3000);
        return;
      }

      // Validate file size (e.g., max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadStatus("File size too large. Please select an image under 10MB");
        setTimeout(() => setUploadStatus(""), 3000);
        return;
      }

      uploadToImageKit(file);
    }
  };

  const isProcessing = isUploading || saveImageMutation.isPending;

  return (
    <div className="mx-auto">
      <div className="mb-8">
        {/* Upload Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <button
              onClick={handleButtonClick}
              disabled={isProcessing}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 mx-auto ${
                isProcessing 
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isProcessing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isProcessing ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                )}
              </svg>
              {isProcessing ? "Processing..." : "Upload Image"}
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={isProcessing}
            />
            
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
          
          {/* Status Message */}
          {uploadStatus && (
            <div
              className={`mt-4 p-3 rounded-md text-center ${
                uploadStatus.includes("failed") ||
                uploadStatus.includes("Please select") ||
                uploadStatus.includes("too large") ||
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
        </div>
      </div>

      <div>

        <Images handleImageFromURL={handleImageFromURL}/>
      </div>
    </div>
  );
};

export default ImageGallery;