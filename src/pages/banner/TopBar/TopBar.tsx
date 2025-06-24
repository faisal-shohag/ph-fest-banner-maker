import AvatarDisplay from "@/components/common/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts-providers/auth-context";
import { Check, Download, InfoIcon, Loader2, Save } from "lucide-react";
import { use, useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvas } from "@/hooks/use-canvas";
import { Slider } from "@/components/ui/slider";
import { TbBackground } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import ColorPicker from "@/components/common/ColorPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TiExportOutline } from "react-icons/ti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  canvasToBlob,
  createThumbnailFromCanvas,
  imageKit,
} from "@/lib/constants";
import { TagsInput } from "@/components/ui/TagsInput";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import UndoRedo from "./UndoRedo";


const TopBar = ({ templateTitle, templateId , tags, publish}) => {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(templateTitle);
  const { user } = use(AuthContext) as any;
  const { isActive, opacity, handleObjectOpacity, fabCanvas } = useCanvas();
  const [isSaving, setIsSaving] = useState(false);

  const [pickedColor, setPickedColor] = useState("#000000") as any;
  const queryClient = useQueryClient();
  useEffect(() => {
    if (fabCanvas) {
      setTimeout(() => {
        setPickedColor(fabCanvas?.backgroundColor);
      }, 1100);
    }
  }, [fabCanvas]);

  const handleColorPicker = (color) => {
    fabCanvas!.backgroundColor = color.hex;
    fabCanvas!.requestRenderAll();
    fabCanvas!.renderAll();
    setPickedColor(color.hex);
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/template/${templateId}`, { ...data });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Updated template...");
      if (data.title.trim() != templateTitle.trim()) {
        queryClient.invalidateQueries({ queryKey: ["recent-templates"] });
        setIsSaving(false);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["editor-template"] });
      setIsSaving(false);

      toast.success('Template saved!')
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to save template.");
      setIsSaving(false)
    }
  });

  const handleSaveTitle = (newTitle) => {
    setEditTitle((prev) => !prev);
    if (newTitle.length < 3) {
      return;
    }
    if (templateTitle.trim() === newTitle.trim()) return;
    mutation.mutate({ title: newTitle.trim() });
  };

  return (
    <div className="fixed pl-20 dark:bg-zinc-900 bg-zinc-100 shadow-2xl py-2 px-7 z-[9] w-full max-h-14 flex justify-between">
      <div className="flex items-center text-center gap-5">
        {editTitle ? (
          <div className="flex  items-center gap-2">
            <Input
              size={10}
              type="text"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold text-center"
              onBlur={() => handleSaveTitle(title)}
              autoFocus
            />
            <div>
              {" "}
              <Button
                onClick={() => handleSaveTitle(title)}
                variant={"outline"}
                size={"sm"}
                className="bg-green-500"
              >
                <Check />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setEditTitle((prev) => !prev)}
            className="font-semibold"
          >
            {title}
          </div>
        )}

        <UndoRedo/>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-2">
          <TbBackground size={24} />
          <Slider
            value={[opacity]}
            onValueChange={(value) => handleObjectOpacity(value[0])}
            disabled={!isActive}
            max={1}
            min={0.1}
            step={0.1}
            title="Tansparency"
            className="w-[150px]"
          />
        </div>
        <Separator orientation="vertical" />

        <div className="pt-2">
          <Popover>
            <PopoverTrigger>
              <div
                style={{ backgroundColor: pickedColor }}
                className="border h-8 w-8  rounded-full"
              ></div>
            </PopoverTrigger>
            <PopoverContent>
              <ColorPicker handleColorPicker={handleColorPicker} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <AvatarDisplay user={user} />
        <div className="flex gap-2">
          <ExportModal title={title} />

          <SaveModal
            mutation={mutation}
            title={title}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            templateTags={tags}
            publish={publish}
          />
        </div>
      </div>
    </div>
  );
};

const ExportModal = ({ title }) => {
  const { exportCanvas } = useCanvas();
  const [quality, setQuality] = useState(0.5);
  const [resolution, setResolution] = useState(1);
  const [format, setFormat] = useState("png");
  const [dataURL, setDataURL] = useState(null) as any;
  const { fabCanvas } = useCanvas();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {
            setDataURL(createThumbnailFromCanvas(fabCanvas));
          }}
          variant={"outline"}
          size={"sm"}
          className="bg-green-500 shimmer text-white hover:bg-green-400"
        >
          <TiExportOutline /> Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="">
          <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none flex items-center gap-1">
              <Download size={16} /> Download
            </h4>
          </div>
          <div className=" space-y-5 mt-3">
            {dataURL && (
              <div className="flex justify-center">
                <img
                  className="h-[80px] rounded-md"
                  src={dataURL}
                  alt="template-image"
                />
              </div>
            )}
            <div className="space-y-2 flex justify-between items-center">
              <div className="text-xs flex-1/2">File Type:</div>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value)}
              >
                <SelectTrigger size="sm" className=" flex-1/3">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  {/* <SelectItem value="svg">SVG</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {format !== "svg" && (
              <div>
                <div className="text-xs space-y-2  flex items-center justify-between">
                  <span>Quality</span>
                  <span>{quality * 100}%</span>
                </div>
                <Slider
                  onValueChange={(value) => setQuality(value[0])}
                  max={1}
                  step={0.1}
                  value={[quality]}
                />
              </div>
            )}

            <div>
              <div className="text-xs flex  space-y-2 items-center justify-between">
                <span>Resolution</span>
                <span>{resolution}x</span>
              </div>
              <Slider
                onValueChange={(value) => setResolution(value[0])}
                max={4}
                step={1}
                value={[resolution]}
              />
            </div>
            <Button
              onClick={() => exportCanvas(format, title, quality, resolution)}
              variant={"outline"}
              className="w-full mt-2"
            >
              {" "}
              <Download /> Download
            </Button>
          </div>

          {/* <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none flex items-center gap-1"><Share2 size={15} />Share</h4>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const SaveModal = ({ mutation, title, isSaving, setIsSaving, templateTags, publish }) => {
  const { fabCanvas } = useCanvas();
  const [isPublish, setIsPublish] = useState(publish);
  const [dataURL, setDataURL] = useState(null) as any;
  const [tags, setTags] = useState(templateTags);
  // const [uploadStatus, setUploadStatus] = useState("");

  const handleSaveCanvas = async () => {
    setIsSaving(true);
    if (!fabCanvas) return;
    if (isPublish && tags.length === 0){
      toast.error("Please add at least one tag to publish your template.")
      setIsSaving(false);
      return
    };

    const blob: any = await canvasToBlob(fabCanvas);
    const fileName = `${title}.jpg`;
    const file: any = new File([blob], fileName, {
      type: "image/jpeg",
    });

    const result = await imageKit.upload({
      file,
      fileName,
      folder: "/templates",
    });

    const data = {
      photoURL: result.url,
      photoMeta: result,
      tags
    };
    
    const canvas = fabCanvas.toJSON()
    mutation.mutate({ ...data, canvas, isPublic: isPublish });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {
            setDataURL(createThumbnailFromCanvas(fabCanvas));
          }}
          variant={"outline"}
          size={"sm"}
        >
          <Save /> Save
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="">
          <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none flex items-center gap-1">
              <Save size={16} /> Save/Publish
            </h4>
          </div>
          <div className=" space-y-4 mt-3">
            {dataURL && (
              <div className="flex justify-center">
                <img
                  className="h-[80px] rounded-md"
                  src={dataURL}
                  alt="template-image"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-xs flex gap-1">
                Publish?
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <InfoIcon size={15} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your template will be visible to all users!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch checked={isPublish} onCheckedChange={setIsPublish} />
            </div>

            {isPublish && (
              <div className="space-y-2">
                <label className="text-xs flex items-center gap-1">
                  <span> Tags</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <InfoIcon size={15} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Tags helps to find your template quickly, easily and
                        efficiently!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>

                <TagsInput
                  value={tags}
                  onChange={setTags as any}
                  placeholder="Add tags"
                />
                <p className="text-xs text-muted-foreground">
                  Current tags: {JSON.stringify(tags)}
                </p>
              </div>
            )}

            <Button onClick={handleSaveCanvas} variant={"outline"} className="w-full mt-2">
            {isSaving ? <span className="animate-spin"><Loader2/> Saving...</span> : <Check /> } Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TopBar;
