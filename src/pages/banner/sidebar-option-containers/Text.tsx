import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { TypeIcon } from "lucide-react";

const Text = () => {
    const { addText } = useCanvas()

    return (
        <div>
            <div>
                <Button className="w-full text-white bg-green-500 hover:bg-green-700 cursor-pointer" onClick={() => addText()}><TypeIcon/> Add a TextBox</Button>
            </div>
        </div>
    );
};

export default Text;