import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineTimelapse } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { fromNow } from "@/lib/constants";
import CanvasListSkleton from "@/components/common/CanvasListSkleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Heading from "@/components/common/Heading";
import { useNavigate } from "react-router";

const RecentCanvas = () => {
    const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-templates'],
    queryFn: async () => {
      const response = await api.get('/template/user/1?page=1&limit=5');
      return response.data;
    },
  });

  const templates = data?.templates || [];

  if(isLoading) return <CanvasListSkleton/>
  if(error)  return <ErrorState/>
  if(templates.length === 0)  return <EmptyState/>

  return (
    <section className="py-10">
    <Heading Icon={MdOutlineTimelapse} title={'Recent Canvas'} subtitle={'Continue where you left off'}/>
      {/* Recent canvas content */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {
          // Templates list
          templates.map((template) => (
            <div
            onClick={()=> navigate(`/editor/${template.id}`)}
              key={template.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group custom-glass rounded-xl"
            >
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
                    {fromNow(template.createdAt)}
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
          ))
        }
      </div>
    </section>
  );
};

export default RecentCanvas;