import { RiRectangleFill } from "react-icons/ri";
import { FaCircle, FaStar, FaDiamond } from "react-icons/fa6";
import { BsTriangleFill, BsFillHexagonFill } from "react-icons/bs";
import { MdArrowRightAlt } from "react-icons/md";
import { useCanvas } from "@/hooks/use-canvas";
import { TbLine, TbPentagonFilled, TbOctagonFilled  } from "react-icons/tb";
import { PiHeartFill } from "react-icons/pi";


const Shapes = () => {
  const { addShape } = useCanvas();
  const shapes = [
    {
      title: "Rectangle",
      icon: RiRectangleFill,
      name: "rect",
    },
    {
      title: "Circle",
      icon: FaCircle,
      name: "circle",
    },
    {
      title: "Triangle",
      icon: BsTriangleFill,
      name: "triangle",
    },
    {
      title: "Line",
      icon: TbLine,
      name: "line",
    },
    {
      title: "Arrow",
      icon: MdArrowRightAlt,
      name: "arrow",
    },
    {
      title: "Heart",
      icon: PiHeartFill,
      name: "heart",
    },
    {
      title: "Star",
      icon: FaStar,
      name: "star",
    },
    {
      title: "Diamond",
      icon: FaDiamond,
      name: "diamond",
    },
    {
      title: "Hexagon",
      icon: BsFillHexagonFill,
      name: "hexagon",
    },
    {
      title: "Pentagon",
      icon: TbPentagonFilled,
      name: "pentagon",
    },
    {
      title: "Octagon",
      icon: TbOctagonFilled,
      name: "octagon",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-3">
        {shapes.map((shape, index) => (
          <div
            onClick={() => addShape(shape.name)}
            key={index}
            className="flex flex-col items-center gap-1 relative cursor-pointer p-2 rounded-2xl hover:bg-orange-200 dark:hover:bg-zinc-700"
          >
            <div>
              <shape.icon size={50} />
            </div>
            <div className="text-xs font-bold">{shape.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shapes;
