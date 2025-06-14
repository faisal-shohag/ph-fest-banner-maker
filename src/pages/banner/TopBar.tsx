import AvatarDisplay from "@/components/common/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts-providers/auth-context";
import { Check, Save, Share2 } from "lucide-react";
import { use, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useCanvas } from "@/hooks/use-canvas";

const TopBar = () => {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("Untitled Template");
  const { user } = use(AuthContext) as any

  return (
    <div className="fixed pl-20 dark:bg-zinc-800  py-2 px-7 z-[9] w-full flex justify-between">
      <div className="flex items-center text-center">
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
      </div>
      <div className="flex gap-3 items-center">
        <AvatarDisplay user={user}/>
        <div className="flex gap-2">
          <ShareModal title={title}/>

           <Button className="bg-orange-500 text-white">
           <Save/> Save
          </Button>
        </div>
      </div>
    </div>
  );
};


const ShareModal = ({title}) => {
  const { exportCanvas } = useCanvas()
  return (
    <Popover>
      <PopoverTrigger asChild>
         <Button className="bg-green-500 text-white">
           <Share2/> Share
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Download As</h4>
          </div>
          <div className="grid gap-2">
            <Button onClick={()=>exportCanvas('jpg', title)}>JPG</Button>
            <Button>PNG</Button>
            <Button>SVG</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TopBar;