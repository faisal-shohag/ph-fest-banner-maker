import AvatarDisplay from "@/components/common/AvatarDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts-providers/auth-context";
import { Check } from "lucide-react";
import { use, useState } from "react";

const TopBar = () => {
  const [editTitle, setEditTitle] = useState(false);
  const { user } = use(AuthContext) as any

  return (
    <div className="fixed pl-20  py-2 px-7 z-[99] w-full flex justify-between">
      <div className="flex items-center text-center">
        {editTitle ? (
          <div className="flex  items-center gap-2">
            <Input
              size={10}
              type="text"
              defaultValue="Untitled Template"
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
            Untitled Template
          </div>
        )}
      </div>
      <div>
        <AvatarDisplay user={user}/>
      </div>
    </div>
  );
};

export default TopBar;