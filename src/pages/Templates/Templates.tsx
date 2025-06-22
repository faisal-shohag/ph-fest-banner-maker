import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Grid3X3, 
  Grid2X2, 
  Loader2,
  Eye,
  X
} from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("") as any;
  const [selectedTags, setSelectedTags] = useState([]) as any;
  const [gridSize, setGridSize] = useState("4"); // 2, 3, or 4 columns
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Mock categories and tags (you can fetch these from your API)
//   const categories = [
//     { id: 1, name: "Business" },
//     { id: 2, name: "Creative" },
//     { id: 3, name: "Education" },
//     { id: 4, name: "Marketing" },
//     { id: 5, name: "Social Media" },
//   ];

//   const popularTags = ["modern", "minimalist", "colorful", "professional", "creative", "clean"];

  // Infinite query for templates
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["templates", debouncedSearch, selectedCategory, selectedTags],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: 20,
        search: debouncedSearch || undefined,
        categoryId: selectedCategory || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
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

  // Infinite scroll handler
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

  // Get all templates from pages
  const allTemplates = data?.pages?.flatMap((page) => page.templates) || [];

  // Handle tag selection
//   const handleTagSelect = (tag:any) => {
//     if (!selectedTags.includes(tag)) {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  const getGridClasses = () => {
    switch (gridSize) {
      case "2":
        return "grid-cols-1 sm:grid-cols-2 gap-4";
      case "4":
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Templates</h1>
          <p className="text-red-600">Failed to load templates. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col space-y-4">
            {/* Title and Grid Toggle */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Templates
              </h1>
              
              {/* Grid Size Toggle */}
              <div className="flex items-center space-x-2 rounded-lg p-1">
                <Button
                  variant={gridSize === "2" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("2")}
                  className="p-2"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === "3" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("3")}
                  className="p-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === "4" ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setGridSize("4")}
                  className="p-2"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-px">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

             

              {/* Clear Filters */}
              {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12 px-4 text-gray-600 hover:text-gray-900"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className={`grid ${getGridClasses()}`}>
          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: 20 }).map((_, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer">
                <div className="aspect-[4/3]">
                  <Skeleton className="w-full h-full" />
                </div>
              </Card>
            ))}

          {/* Template Cards */}
          {allTemplates.map((template, index) => (
            <div
              key={`${template.id}-${index}`}
              className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border rounded-md backdrop-blur-sm bg-muted"
              onClick={() => navigate(`/template/${template.id}`)}
            >
              <div className="aspect-video bg-gradient-to-br  overflow-hidden relative">
                {template.photoURL ? (
                  <img
                    src={template.photoURL}
                    alt={template.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                    <Eye className="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {template.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Loading */}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading more templates...</span>
          </div>
        )}

        {/* No More Templates */}
        {!hasNextPage && allTemplates.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">You've reached the end! 🎉</p>
          </div>
        )}

        {/* No Templates Found */}
        {!isLoading && allTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all templates.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;