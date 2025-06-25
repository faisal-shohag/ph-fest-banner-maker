import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Heading from "@/components/common/Heading";
import { MdWidgets } from "react-icons/md";
import TemplateGrid from "@/components/templates/TemplateGrid";
import  GallerySkeleton from "@/components/skeletons/gallery-skeleton";
import ErrorState from "@/components/common/ErrorState";

const TemplateShowcase = () => {
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

  const templates = data?.templates || []

  if (error) return <>
  <Heading Icon={MdWidgets} title={'Templates'} subtitle={'Find inspiration for your next project.'}/>
  <ErrorState/>
  </>

  return (
    <div className="w-full py-10">
      <Heading Icon={MdWidgets} title={'Templates'} subtitle={'Find inspiration for your next project.'}/>
      <div>
        {isLoading
          ? <GallerySkeleton/>
          : <TemplateGrid templates={templates}/> }
      </div>
    </div>
  );
};

export default TemplateShowcase;