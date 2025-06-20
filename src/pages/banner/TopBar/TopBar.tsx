import AvatarDisplay from "@/components/common/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts-providers/auth-context";
import { Check, Download, Save } from "lucide-react";
import { use, useEffect, useState } from "react";
import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

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
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { TiExportOutline } from "react-icons/ti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TopBar = ({ templateTitle, templateId }) => {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(templateTitle);
  const { user } = use(AuthContext) as any;
  const { isActive, opacity, handleObjectOpacity, fabCanvas } = useCanvas();
  const [pickedColor, setPickedColor] = useState("#000000") as any;

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
    onSuccess: () => {
      console.log("Updated template...");
    },
  });

  const handleSaveTitle = (newTitle) => {
    setEditTitle((prev) => !prev);
    if (title.trim() === newTitle.trim()) return;
    mutation.mutate({ title: newTitle.trim() });
  };

  const handleSaveCanvas = () => {
    if (fabCanvas) {
      const dataJSON = fabCanvas.toJSON();
      mutation.mutate({ canvas: dataJSON });
    }
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

        <Separator orientation="vertical" />

        <div className="flex items-center gap-5 text-2xl ">
          <Button disabled size={"sm"} variant={"outline"}>
            <GrUndo />
          </Button>
          <Button disabled size={"sm"} variant={"outline"}>
            <GrRedo />
          </Button>
        </div>

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

          <Button
            onClick={handleSaveCanvas}
            size={"sm"}
            className="bg-orange-500 text-white"
          >
            <Save /> Save
          </Button>
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
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
          <div className=" space-y-3 mt-3">
            <div className="text-xs">File Type:</div>
            <Select value={format} onValueChange={(value) => setFormat(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Slect file type" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                {/* <SelectItem value="svg">SVG</SelectItem> */}
              </SelectContent>
            </Select>

            {format !== "svg" && (
              <div>
                <div className="text-xs flex items-center justify-between">
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
              <div className="text-xs flex items-center justify-between">
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

export default TopBar;
