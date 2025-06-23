import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/lib/api.ts";
import { use, useState } from "react";
import { AuthContext } from "@/contexts-providers/auth-context";
import { newCanvas } from "@/lib/constants";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { 
  FaInstagram, 
  FaTwitter, 
  FaRegImage, 
  FaFileAlt, 
  FaDesktop,
  FaPalette,
  FaTimes
} from "react-icons/fa";

interface CreateTemplatePayload {
  title: string;
  description?: string;
  photoURL?: string;
  canvas: object;
  isPublic?: boolean;
  tags?: string[];
  categoryId?: number;
  userId: number;
  type: string;
}

interface TemplateResponse {
  id: number;
  title: string;
  description?: string;
  photoURL: string;
  canvas: object;
  isPublic: boolean;
  tags: string[];
  categoryId?: number;
  userId: number;
  createdAt: string;
  type: string;
  user: {
    id: number;
    username: string;
    displayName: string;
    photoURL?: string;
  };
  category?: {
    id: number;
    name: string;
    description?: string;
  };
}

interface CanvasPreset {
  key: string;
  name: string;
  width: number;
  height: number;
  description: string;
  icon: React.ComponentType;
  category: 'social' | 'document' | 'design' | 'presentation';
}

const canvasPresets: CanvasPreset[] = [
  {
    key: 'instagramPost',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: 'Square format for Instagram posts',
    icon: FaInstagram,
    category: 'social'
  },
  {
    key: 'twitterPost',
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    description: 'Optimized for Twitter posts and headers',
    icon: FaTwitter,
    category: 'social'
  },
  {
    key: 'socialPost',
    name: 'Social Media Post',
    width: 1080,
    height: 1080,
    description: 'General social media square format',
    icon: FaRegImage,
    category: 'social'
  },
  {
    key: 'normal',
    name: 'Standard Canvas',
    width: 800,
    height: 600,
    description: 'Default canvas size for general design',
    icon: FaPalette,
    category: 'design'
  },
  {
    key: 'logo',
    name: 'Logo Design',
    width: 500,
    height: 500,
    description: 'Square format ideal for logo creation',
    icon: FaPalette,
    category: 'design'
  },
  {
    key: 'a4Portrait',
    name: 'A4 Portrait',
    width: 794,
    height: 1123,
    description: 'Standard A4 paper in portrait orientation',
    icon: FaFileAlt,
    category: 'document'
  },
  {
    key: 'a4Landscape',
    name: 'A4 Landscape',
    width: 1123,
    height: 794,
    description: 'Standard A4 paper in landscape orientation',
    icon: FaFileAlt,
    category: 'document'
  },
  {
    key: 'presentation',
    name: 'Presentation Slide',
    width: 1280,
    height: 720,
    description: '16:9 aspect ratio for presentations',
    icon: FaDesktop,
    category: 'presentation'
  }
];

const CreateBrandNewCanvas = () => {
  const navigate = useNavigate();
  const { user } = use(AuthContext) as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset | null>(null);

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (
      templateData: CreateTemplatePayload
    ): Promise<TemplateResponse> => {
      const response = await api.post("/template", templateData);
      return response.data;
    },
    onSuccess: (data: TemplateResponse) => {
      toast.success("Canvas created successfully!");
      navigate(`/editor/${data.id}`);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creating template:", error);
      toast.error(error.response?.data?.message || "Failed to create canvas");
    },
  });

  const handleOpenModal = () => {
    if (!user) {
      return <Navigate state={{ from: location.pathname }} to="/auth/login" />;
    }
    setIsModalOpen(true);
  };

  const handleCreateCanvas = async (preset: CanvasPreset) => {
    const userId = user.id;

    // Create canvas object with selected dimensions
    const canvasWithDimensions = {
      ...newCanvas,
      width: preset.width,
      height: preset.height
    };

    const newTemplateData: CreateTemplatePayload = {
      title: "Untitled Canvas",
      description: `A new ${preset.name.toLowerCase()} project`,
      canvas: canvasWithDimensions,
      isPublic: false,
      photoURL: "https://ik.imagekit.io/anf/Others/new-canvas",
      userId: userId,
      type: preset.key
    };
    
    setSelectedPreset(preset);
    createTemplateMutation.mutate(newTemplateData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPreset(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      social: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      document: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      design: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      presentation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[category] || colors.design;
  };

  return (
    <div>
      <Button
        className="custom-glass text-black dark:text-white px-10 cursor-pointer"
        onClick={handleOpenModal}
        disabled={createTemplateMutation.isPending}
      >
        <FaWandMagicSparkles />
        Create New Canvas
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose Canvas Size
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {canvasPresets.map((preset) => {
                  const IconComponent:any = preset.icon;
                  const isSelected = selectedPreset?.key === preset.key;
                  const isLoading = createTemplateMutation.isPending && isSelected;

                  return (
                    <div
                      key={preset.key}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${isLoading ? 'opacity-75' : ''}`}
                      onClick={() => !createTemplateMutation.isPending && handleCreateCanvas(preset)}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {preset.name}
                          </h3>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(preset.category)}`}>
                            {preset.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {preset.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          {preset.width} × {preset.height}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {(preset.width / preset.height).toFixed(2)} ratio
                        </div>
                      </div>

                      {/* Visual representation */}
                      <div className="mt-3 flex justify-center">
                        <div 
                          className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                          style={{
                            width: Math.min(60, (preset.width / Math.max(preset.width, preset.height)) * 60),
                            height: Math.min(60, (preset.height / Math.max(preset.width, preset.height)) * 60)
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={createTemplateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBrandNewCanvas;