import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner"; // or your preferred toast library
import api from "@/lib/api.ts";
import { use } from "react";
import { AuthContext } from "@/contexts-providers/auth-context";
import { newCanvas } from "@/lib/constants";
import { FaWandMagicSparkles } from "react-icons/fa6";

// Define the template creation payload type
interface CreateTemplatePayload {
  title: string;
  description?: string;
  photoURL?: string;
  canvas: object;
  isPublic?: boolean;
  tags?: string[];
  categoryId?: number;
  userId: number;
}

// Define the response type from the API
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

const CreateNewCanvas = ({
  func,
  template,
  btnText,
}: {
  func?: (boolean) => void;
  template?: any;
  btnText:string
}) => {
  const navigate = useNavigate();
  const { user } = use(AuthContext) as any;

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
      if (func) func(false);
      navigate(`/editor/${data.id}`);
      if (template) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onError: (error: any) => {
      console.error("Error creating template:", error);
      toast.error(error.response?.data?.message || "Failed to create canvas");
    },
  });

  const handleCreateCanvas = async () => {
    if (!user) {
      return navigate('/auth/login');
    }
    const userId = user.id;

    const newTemplateData: CreateTemplatePayload = {
      title: "Untitled Canvas",
      description: "A new canvas project",
      canvas: newCanvas,
      isPublic: false,
      photoURL: "https://ik.imagekit.io/anf/Others/new-canvas",
      userId: userId,
    };
    if (template) {
      return createTemplateMutation.mutate({ ...template, userId,  isPublic: false, photoMeta: null });
    }
    createTemplateMutation.mutate(newTemplateData);
  };

  return (
    <div>
      <Button
        className=" w-full g-card bg-gradient-to-l from-[#8b4eee] via-[#322fcf] to-[#db30db] px-10 cursor-pointer"
        onClick={handleCreateCanvas}
        disabled={createTemplateMutation.isPending}
      >
        <FaWandMagicSparkles />
        {createTemplateMutation.isPending ? "Creating..." : btnText}
      </Button>
    </div>
  );
};

export default CreateNewCanvas;
