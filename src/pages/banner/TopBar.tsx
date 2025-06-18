import AvatarDisplay from "@/components/common/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts-providers/auth-context";
import { Check, Save, Share2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { GrUndo } from "react-icons/gr";
import { GrRedo } from "react-icons/gr";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useCanvas } from "@/hooks/use-canvas";
import { PiFileSvgFill, PiFilePngFill, PiFileJpgFill } from "react-icons/pi";
import { FaFileExport } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { TbBackground } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import ColorPicker from "@/components/common/ColorPicker";

const TopBar = () => {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("Untitled Template");
  const { user } = use(AuthContext) as any;
  const { saveCanvas, isActive, opacity, handleObjectOpacity, fabCanvas } =
    useCanvas();
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
              onBlur={() => setEditTitle((prev) => !prev)}
              autoFocus
            />
            <div>
              {" "}
              <Button variant={"outline"} size={"sm"} className="bg-green-500">
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

        <div  className="pt-2">
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
          <ShareModal title={title} />

          <Button
            onClick={saveCanvas}
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

const ShareModal = ({ title }) => {
  const { exportCanvas } = useCanvas();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          className="bg-green-500 shimmer text-white hover:bg-green-400"
        >
          <Share2 /> Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm leading-none flex items-center gap-1">
              {" "}
              <FaFileExport /> Export
            </h4>
          </div>
          <div className="grid gap-2 grid-cols-3">
            <Button
              size={"sm"}
              className="dark:bg-pink-500 text-white"
              onClick={() => exportCanvas("jpg", title)}
            >
              <PiFileJpgFill /> JPG
            </Button>
            <Button size={"sm"} className="dark:bg-indigo-500 text-white">
              <PiFilePngFill /> PNG
            </Button>
            <Button size={"sm"} className="dark:bg-purple-500 text-white">
              <PiFileSvgFill /> SVG
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
