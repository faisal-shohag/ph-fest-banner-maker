import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/lib/api";
import { use, useState } from "react";
import { AuthContext } from "@/contexts-providers/auth-context";
import { newCanvas } from "@/lib/constants";
import { 
  FaWandMagicSparkles, 
  FaInstagram, 
  FaRegImage, 
  FaDesktop,
  FaPalette
} from "react-icons/fa6";
import { Loader2, Sparkles } from "lucide-react";
import { FaFileAlt } from "react-icons/fa";

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
  icon: React.ComponentType<any>;
  category: 'social' | 'document' | 'design' | 'presentation';
  popular?: boolean;
}

const canvasPresets: CanvasPreset[] = [

    {
    key: 'normal',
    name: 'Standard Canvas',
    width: 800,
    height: 600,
    description: 'Versatile canvas for any design',
    icon: FaPalette,
    category: 'design',
    popular: true
  },
  {
    key: 'instagramPost',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: 'Perfect square format for Instagram posts',
    icon: FaInstagram,
    category: 'social',
    popular: true
  },
  // {
  //   key: 'twitterPost',
  //   name: 'Twitter Header',
  //   width: 1200,
  //   height: 675,
  //   description: 'Optimized for Twitter posts and headers',
  //   icon: FaTwitter,
  //   category: 'social'
  // },
  {
    key: 'socialPost',
    name: 'Social Media',
    width: 1080,
    height: 1080,
    description: 'Universal social media format',
    icon: FaRegImage,
    category: 'social'
  },

  {
    key: 'logo',
    name: 'Logo Design',
    width: 500,
    height: 500,
    description: 'Perfect square for logo creation',
    icon: FaPalette,
    category: 'design'
  },
  {
    key: 'a4Portrait',
    name: 'A4 Portrait',
    width: 794,
    height: 1123,
    description: 'Standard document format',
    icon: FaFileAlt,
    category: 'document'
  },
  {
    key: 'a4Landscape',
    name: 'A4 Landscape',
    width: 1123,
    height: 794,
    description: 'Horizontal document layout',
    icon: FaFileAlt,
    category: 'document'
  },
  {
    key: 'presentation',
    name: 'Presentation',
    width: 1280,
    height: 720,
    description: 'HD presentation slides',
    icon: FaDesktop,
    category: 'presentation',
    popular: true
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
      toast.success("Canvas created successfully!", {
        description: "Your new canvas is ready to edit"
      });
      navigate(`/editor/${data.id}`);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creating template:", error);
      toast.error("Failed to create canvas", {
        description: error.response?.data?.message || "Please try again"
      });
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

  const getCategoryVariant = (category: string) => {
    const variants = {
      social: 'default',
      document: 'secondary',
      design: 'outline',
      presentation: 'destructive'
    };
    return variants[category] || 'default';
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      social: 'from-blue-500/10 to-purple-500/10',
      document: 'from-green-500/10 to-emerald-500/10',
      design: 'from-purple-500/10 to-pink-500/10',
      presentation: 'from-orange-500/10 to-red-500/10'
    };
    return gradients[category] || gradients.design;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={handleOpenModal}
          disabled={createTemplateMutation.isPending}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          <FaWandMagicSparkles className="mr-2" />
          Create New Canvas
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className=" max-h-[90vh] min-w-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="px-8 py-6 border-b">
          <DialogTitle className=" font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Choose Your Canvas
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Select the perfect size for your creative project
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {canvasPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = selectedPreset?.key === preset.key;
              const isLoading = createTemplateMutation.isPending && isSelected;

              return (
                <Card
                  key={preset.key}
                  className={`relative group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                      : 'hover:shadow-xl'
                  } ${isLoading ? 'opacity-75' : ''} overflow-hidden`}
                  onClick={() => !createTemplateMutation.isPending && handleCreateCanvas(preset)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(preset.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Popular Badge */}
                  {preset.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-20 rounded-lg">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                        <p className="text-sm font-medium">Creating...</p>
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6 relative z-10">
                    {/* Canvas Preview */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div 
                          className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-300"
                          style={{
                            width: Math.min(80, (preset.width / Math.max(preset.width, preset.height)) * 80),
                            height: Math.min(80, (preset.height / Math.max(preset.width, preset.height)) * 80)
                          }}
                        />
                        {/* Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {preset.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground">
                        {preset.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant={getCategoryVariant(preset.category)} className="capitalize">
                          {preset.category}
                        </Badge>
                        <div className="text-xs font-mono text-muted-foreground">
                          {preset.width} × {preset.height}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Ratio: {(preset.width / preset.height).toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-4 border-t bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm text-muted-foreground">
            
          </p>
          <Button
            variant="outline"
            onClick={closeModal}
            disabled={createTemplateMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandNewCanvas;