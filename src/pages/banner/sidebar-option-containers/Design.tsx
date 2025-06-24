import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { SearchIcon, Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
// import { debounce } from "lodash";
import { MdWidgets } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCanvas } from "@/hooks/use-canvas";
import CreateNewCanvas from "@/components/common/CreateNewCanvas";
import SidebarGallerView from "@/components/skeletons/SidebarGallerView";

const fetchTemplates = async ({ pageParam = 1, queryKey }) => {
  const [, search] = queryKey;
  const response = await api.get("/templates/public/all", {
    params: {
      page: pageParam,
      limit: 10,
      search: search || undefined,
    },
  });
  return response.data;
};

const TemplateCard = ({ template, handleDialogOpen }) => {
  return (
    <div className="">
      <div onClick={()=>handleDialogOpen(template)} className="bg-gradient-to-br rounded-lg from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {template.photoURL ? (
          <img
            src={template.photoURL}
            alt={template.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MdWidgets size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
        )}
         <span className="text-xs text-muted-foreground absolute bottom-0 left-1"> by {template.user.displayName}</span>
      </div>
     
    </div>
  );
};

const TemplateGrid = ({ templates, handleDialogOpen }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {templates.map((template) => (
        <TemplateCard handleDialogOpen={handleDialogOpen} key={template.id} template={template} />
      ))}
    </div>
  );
};

const Design = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { ref, inView } = useInView();
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null) as any;
  const {fabCanvas} = useCanvas()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["templates", debouncedSearchTerm],
    queryFn: fetchTemplates,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Trigger fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearchTerm(searchTerm);
  };

  // Flatten all templates from all pages
  const allTemplates = data?.pages?.flatMap((page) => page.templates) || [];



  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading templates</p>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
        </div>
      </div>
    );
  }

const handleDialogOpen = (template) => {
  setSelectedTemplate(template)
  setOpen(true)
}

const handleOverride = () => {
  setOpen(false)
      if(selectedTemplate && fabCanvas) {
      fabCanvas?.loadFromJSON( selectedTemplate?.canvas, () => {
        console.log("Canvas loaded and rendered.");
        fabCanvas.renderAll();
    });

    setTimeout(() => {
      fabCanvas.renderAll()
    }, 1000)
    }
}


  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div>
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 items-center mb-5"
        >
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e)=>  setSearchTerm(e.target.value)}
          />
          <Button  size="icon" variant="outline" type="submit">
            <SearchIcon />
          </Button>
        </form>
        <Separator />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          {debouncedSearchTerm ? (
            <p className="text-sm text-muted-foreground">
              Search results for "{debouncedSearchTerm}"
              {data?.pages?.[0]?.pagination?.total !== undefined && (
                <span> ({data.pages[0].pagination.total} found)</span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {data?.pages?.[0]?.pagination?.total !== undefined && (
                <span>
                  {data.pages[0].pagination.total} templates available
                </span>
              )}
            </p>
          )}
        </div>
        {isFetching && !isFetchingNextPage && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Searching...
          </div>
        )}
      </div>
  
{ !isLoading ?  <div>
   {/* Templates Grid */}
      {allTemplates.length > 0 ? (
        <>
          <TemplateGrid handleDialogOpen={handleDialogOpen} templates={allTemplates} />

          {/* Load More Trigger */}
          <div ref={ref} className="flex justify-center py-4">
            {isFetchingNextPage ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading more templates...
              </div>
            ) : hasNextPage ? (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                Load More
              </Button>
            ) : (
              allTemplates.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  No more templates to load
                </p>
              )
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-2">
          <p className="text-lg font-medium">No templates found</p>
          {debouncedSearchTerm ? (
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No public templates are available at the moment
            </p>
          )}
        </div>
      )}
  </div> : <SidebarGallerView/>}
      


      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Do you want to override this canvas?</DialogTitle>
      <DialogDescription>
        If you select 'Yes', the current canvas state will be cleared. However, it will not be saved to the database unless you manually save it from the top bar.
      </DialogDescription>
    </DialogHeader>

     <DialogFooter className="sm:justify-start">
      <Button onClick={handleOverride}>Yes</Button>
      <CreateNewCanvas btnText="No, Create new with this template" func={setOpen} template={selectedTemplate}/>
        </DialogFooter>
  </DialogContent>
</Dialog>


    </div>
  );
};

export default Design;
