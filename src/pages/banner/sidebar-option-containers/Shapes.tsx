import { useState, useRef, useCallback } from "react";
import { useCanvas } from "@/hooks/use-canvas";
import api from "@/lib/api";
import { loadSVGFromString, util } from "fabric";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Search, Plus, Upload, Tag, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSVGString, resizeSvg } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

const Shapes = ({ userId = 1 }) => {
  // Assuming we have userId from context/props
  const { fabCanvas } = useCanvas() as any;
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null) as any;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    svg: "",
    categoryId: "",
    tags: [],
  }) as any;
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentTag, setCurrentTag] = useState("") as any;

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories?limit=100");
      return response.data;
    },
  });

  // Infinite query for shapes
  const {
    data: shapesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: shapesLoading,
  } = useInfiniteQuery({
    queryKey: ["shapes", searchTerm, selectedCategory],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "12",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("categoryId", selectedCategory);

      const response = await api.get(`/shapes?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  // Mutations
  const createShapeMutation = useMutation({
    mutationFn: async (shapeData) => {
      const response = await api.post("/shapes", shapeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  // const deleteShapeMutation = useMutation({
  //   mutationFn: async (shapeId) => {
  //     const response = await api.delete(`/shapes/${shapeId}`);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['shapes'] });
  //   }
  // });

  const createCategoryMutation: any = useMutation({
    mutationFn: async (categoryData) => {
      const response = await api.post("/categories", categoryData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData((prev) => ({ ...prev, categoryId: data.data.id.toString() }));
      setNewCategoryName("");
      setShowCategoryForm(false);
    },
  });

  // Handle SVG loading to canvas
  const handleSvgLoad = async (svg) => {
    try {
      const loadedSVG: any = await loadSVGFromString(svg);
      const svgGroup = util.groupSVGElements(
        loadedSVG.objects,
        loadedSVG.options
      );
      svgGroup.set({
        scaleY: 0.5,
        scaleX: 0.5,
        originX: "center",
        originY: "center",
        fill: 'blue',
        visible: true,
        centeredScaling: true,
        selectable: true,
      });
      fabCanvas.add(svgGroup);
      fabCanvas.centerObject(svgGroup);
      fabCanvas.setActiveObject(svgGroup)
      fabCanvas.renderAll();
    } catch (error) {
      console.error("Error loading SVG:", error);
      alert("Error loading SVG to canvas");
    }
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const svgString = e.target.result;
        setFormData((prev) => ({ ...prev, svg: svgString }));
      };
      reader.readAsText(file);
    } else {
      alert("Please select a valid SVG file");
    }
  };

  // Tag management
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: "",
      svg: "",
      categoryId: "",
      tags: [],
    });
    setCurrentTag("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.svg || !formData.categoryId) {
      alert("Please fill in all required fields");
      return;
    }

    createShapeMutation.mutate({
      ...formData,
      categoryId: parseInt(formData.categoryId),
      userId,
    });
  };

  // Search debouncing
  // const debouncedSearch = useMemo(() => {
  //   const timer = setTimeout(() => {
  //     refetchShapes();
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [searchTerm, refetchShapes]);

  // Infinite scroll
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (
        scrollHeight - scrollTop === clientHeight &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Flatten shapes data
  const allShapes = shapesData?.pages?.flatMap((page) => page.data) || [];
  const categories = categoriesData?.data || [];
  return (
    <div>
      {/* Sidebar */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Shapes Library</h2>
          <Button
          size={'icon'}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search shapes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              return value == "all"
                ? setSelectedCategory("")
                : setSelectedCategory(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Shapes Grid */}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {shapesLoading ? (
            <div className="flex justify-center items-center w-full overflow-hidden gap-2">
              <span className="animate-spin"> <Loader2  size={24} /></span>
              <span className="text-sm">Loading shapes...</span>
             
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {allShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="border rounded-lg p-3  hover:shadow-md transition-shadow cursor-pointer group hover:bg-muted"
                >
                  {/* SVG Preview */}
                  <div
                    className="h-8 flex items-center justify-center  rounded border-2 border-dashed border-transparent"
                    onClick={() => handleSvgLoad(shape.svg)}
                    dangerouslySetInnerHTML={{
                      __html: resizeSvg(shape.svg, 50, 50),
                    }}
                  />

                  {/* Delete Button */}
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this shape?')) {
                        deleteShapeMutation.mutate(shape.id);
                      }
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button> */}
                </div>
              ))}
            </div>
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Add Shape Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black bg-opacity-10 flex  justify-center z-50">
          <div className=" p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Shape</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <Label className="text-sm gap-0">
                  Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter shape title"
                />
              </div>

              {/* SVG Input */}
              <div>
                <Label className="block text-sm font-medium mb-1">
                  SVG <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {/* File Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 w-full p-2 border border-dashed rounded-lg hover:"
                    >
                      <Upload size={16} />
                      Upload SVG File
                    </button>
                  </div>

                  <div className="text-center text-gray-500 text-sm">or</div>

                  {/* Text Input */}
                  <Textarea
                    value={formData.svg}
                    onChange={(e) =>{
                      return isSVGString(e.target.value) ?
                         setFormData((prev) => ({ ...prev, svg: e.target.value })) : toast.error('svg is not valid!')
                    }
                     
                    }
                    placeholder="Paste SVG string here..."
                    className="w-full h-20"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className=" p-2 rounded-lg hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* New Category Form */}
                {showCategoryForm && (
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                    />
                    <Button
                      type="button"
                      size={'sm'}
                      variant={'outline'}
                      onClick={() =>
                        createCategoryMutation.mutate({ name: newCategoryName })
                      }
                      disabled={
                        !newCategoryName.trim() ||
                        createCategoryMutation.isPending
                      }
                    >
                      {createCategoryMutation.isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add tag"
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                  size={'icon'}
                  variant={'outline'}
                    type="button"
                    onClick={addTag}
                  >
                    <Tag size={16} />
                  </Button>
                </div>

                {/* Tag List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SVG Preview */}
              {formData.svg && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preview
                  </label>
                  <div
                    className="border rounded-lg p-4  flex items-center justify-center h-24"
                    dangerouslySetInnerHTML={{ __html: resizeSvg(formData.svg, 40, 40) }}
                  />
                </div>
              )}
<Separator/>
              {/* Submit Button */}
              <div className="flex gap-2 pt-4 justify-end">
                <Button
                  type="button"
                  variant={'destructive'}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createShapeMutation.isPending}
                  className=" bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createShapeMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Adding...
                    </>
                  ) : (
                    "Add Shape"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shapes;
