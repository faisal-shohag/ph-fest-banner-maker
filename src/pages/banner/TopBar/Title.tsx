import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useState } from "react";

const Title = ({templateTitle}) => {
     const [editTitle, setEditTitle] = useState(false);
    const [title, setTitle] = useState(templateTitle);
    return (
        <div>
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
    );
};

export default Title;