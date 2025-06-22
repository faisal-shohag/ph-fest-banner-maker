import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, ArrowRight } from "lucide-react";
import Heading from "@/components/common/Heading";
import { MdWidgets } from "react-icons/md";

const TemplateShowcase = () => {
  const navigate = useNavigate();

  // Fetch public templates with limit for showcase
  const { data, isLoading, error } = useQuery({
    queryKey: ["templates", "showcase"],
    queryFn: async () => {
      const response = await api.get("/templates/public/all", {
        params: {
          page: 1,
          limit: 6, // Show only 6 templates in showcase
        },
      });
      return response.data;
    },
  });

  const handleShowAll = () => {
    navigate("/templates");
  };




  if (error) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Showcase</h2>
          <p className="text-red-600">Failed to load templates. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <Heading Icon={MdWidgets} title={'Templates'} subtitle={'Find inspiration for your next project.'}/>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {isLoading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-gray-200">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))
          : // Actual templates
            data?.templates?.map((template) => (
              <div
                key={template.id}
                className="overflow-hidden border rounded hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate(`/template/${template.id}`)}
              >
                {/* Template Image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  {template.photoURL ? (
                    <img
                      src={template.photoURL}
                      alt={template.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Eye className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

               

                
              </div>
            ))}
      </div>

      {/* Show All Button */}
      <div className="text-center">
        <Button
          onClick={handleShowAll}
          size="lg"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Show All Templates
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateShowcase;