import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";

import { 
  Search, 

  Loader2,
  Eye,
} from "lucide-react";
import GallerySkeleton from "@/components/skeletons/gallery-skeleton";
import TemplateGrid from "@/components/templates/TemplateGrid";
import ErrorState from "@/components/common/ErrorState";
import { Separator } from "@/components/ui/separator";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["templates", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: 20,
        search: debouncedSearch || undefined,
      };

      const response = await api.get("/templates/public/all", { params });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });


  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const allTemplates = data?.pages?.flatMap((page) => page.templates) || [];




  if (isError) {
    return <ErrorState/>
  }

  return (
    <div className="">
      <div className="sticky top-0 z-10 mt-5">
        <div className="">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                Templates
              </h1>
           
            </div>
         
            <div className="flex justify-between   gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

   <Separator className="my-5"/>

      <div>
        <div>
          {isLoading &&<GallerySkeleton/>}
            <TemplateGrid templates={allTemplates}/>
        </div>
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading more templates...</span>
          </div>
        )}

        {!hasNextPage && allTemplates.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">You've reached the end! 🎉</p>
          </div>
        )}
        {!isLoading && allTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all templates.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;