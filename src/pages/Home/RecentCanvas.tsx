import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineTimelapse, MdDelete } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fromNow } from "@/lib/constants";
import CanvasListSkleton from "@/components/common/CanvasListSkleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Heading from "@/components/common/Heading";
import { useNavigate } from "react-router";
import { use, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/contexts-providers/auth-context";

const RecentCanvas = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient() as any;
  const {user} = use(AuthContext) as any
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null) as any;

  

  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-templates'],
    queryFn: async () => {
      const response = await api.get(`/template/user/${user.id}?page=1&limit=5`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (template:any) => {
      const response = await api.delete(`/template/${template.id}/${template.photoMeta?.fileId}`);
      return response.data;
    },
    onSuccess: () => {
      // Refetch the templates data
      queryClient.invalidateQueries(['recent-templates']);
      toast.success("Canvas deleted successfully");
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete canvas");
      console.error("Delete error:", error);
    },
  });

  const templates = data?.templates || [];

  const handleDeleteClick = (e, template) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      deleteMutation.mutate(templateToDelete);
    }
  };

  const handleCanvasClick = (template) => {
    navigate(`/editor/${template.id}`);
  };

  if(isLoading) return <CanvasListSkleton/>



  if(error)  return <div className="py-10">
    <Heading Icon={MdOutlineTimelapse} title={'Recent Canvas'} subtitle={'Continue where you left off'}/>
    <ErrorState/>
  </div>

  if((templates.length === 0)) return <div className="py-10">
    <Heading Icon={MdOutlineTimelapse} title={'Recent Canvas'} subtitle={'Continue where you left off'}/>
    <EmptyState/>
  </div>

  return (
    <>
      <section className="pt-3">
        <Heading Icon={MdOutlineTimelapse} title={'Recent Canvas'} subtitle={'Continue where you left off'}/>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {
            templates.map((template) => (
              <div
                key={template.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group custom-glass rounded-xl relative"
              >
                {/* Delete button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteClick(e, template)}
                >
                  <MdDelete className="h-4 w-4" />
                </Button>

                <div onClick={() => handleCanvasClick(template)}>
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                    {template.photoURL ? (
                      <img
                        src={template.photoURL}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdOutlineTimelapse 
                          size={32} 
                          className="text-gray-400 dark:text-gray-600"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm line-clamp-1">
                        {template.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {fromNow(template.updatedAt)}
                      </span>
                    </div>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecentCanvas;