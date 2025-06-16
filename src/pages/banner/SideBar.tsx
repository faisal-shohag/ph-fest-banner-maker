import { ThemeToggle } from "@/components/ui/toggle-theme";
import { BiSolidWidget, BiText } from "react-icons/bi";
import { FaShapes } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { useState, useRef } from "react";
import Design from "./sidebar-option-containers/Design";
import Shapes from "./sidebar-option-containers/Shapes";
import Text from "./sidebar-option-containers/Text";
import ImageGallery from "./sidebar-option-containers/ImageGallery";
import { useCanvas } from "@/hooks/use-canvas";

const SideBar = () => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  const handleOptionClick = (option) => {
    // If clicking the same option that's already active
    if (activeOption === option) {
      // Toggle the container open/close
      if (isContainerOpen) {
        setIsContainerOpen(false);
        setActiveOption(null);
      } else {
        setIsContainerOpen(true);
      }
    } else {
      // If clicking a different option or no option was active
      setActiveOption(option);
      setIsContainerOpen(true);
    }
  };

  return (
    <div className="h-lvh flex">
      <FloatingContainer 
        isOpen={isContainerOpen} 
        activeOption={activeOption}
        onClose={() => {
          setIsContainerOpen(false);
          setActiveOption(null);
        }}
      />     
      <div className="z-[9999] dark:bg-zinc-800 bg-zinc-100 py-5 flex flex-col gap-5 min-w-[75px] max-w-[200px] justify-between">
        <div className="flex flex-col gap-10 pt-20">
          <div 
            className={`flex flex-col items-center gap-1 relative cursor-pointer p-2 rounded-2xl ${
              activeOption === 'Design' 
                ? 'bg-orange-200 dark:bg-zinc-600' 
                : 'hover:bg-orange-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Design')}
          >
            <div className={`${activeOption === "Design" ? "sidebar-active" : ""}`}>
              <BiSolidWidget size={20} />
            </div>
            <div className="text-xs font-bold">Design</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 relative cursor-pointer p-2 rounded-2xl ${
              activeOption === 'Shapes' 
                ? 'bg-orange-200 dark:bg-zinc-600' 
                : 'hover:bg-orange-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Shapes')}
          >
            <div className={`${activeOption === "Shapes" ? "sidebar-active" : ""}`}>
              <FaShapes size={20} />
            </div>
            <div className="text-xs font-bold">Shapes</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 relative cursor-pointer p-2 rounded-2xl ${
              activeOption === 'Text' 
                ? 'bg-orange-200 dark:bg-zinc-600' 
                : 'hover:bg-orange-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Text')}
          >
            <div className={`${activeOption === "Text" ? "sidebar-active" : ""}`}>
              <BiText size={20} />
            </div>
            <div className="text-xs font-bold">Text</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 relative cursor-pointer p-2 rounded-2xl ${
              activeOption === 'Images' 
                ? 'bg-orange-200 dark:bg-zinc-600' 
                : 'hover:bg-orange-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Images')}
          >
            <div className={`${activeOption === "Images" ? "sidebar-active" : ""}`}>
              <IoIosImages size={20} />
            </div>
            <div className="text-xs font-bold">Images</div>
          </div>
        </div>

        <div className="flex flex-col items-center pb-10">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

// props for Floating Container
interface FloatingContainerProps {
  isOpen: boolean;
  activeOption: string | null;
  onClose?: () => void;
}


const FloatingContainer = ({ isOpen, activeOption }: FloatingContainerProps) => {
  const containerRef = useRef(null);
  const { handleImageFromURL } = useCanvas();

  const renderContent = () => {
    switch (activeOption) {
      case 'Design':
        return <Design />;
      case 'Shapes':
        return <Shapes />;
      case 'Text':
        return <Text />;
      case 'Images':
        return <ImageGallery handleImageFromURL={handleImageFromURL}/>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="z-50">
      <div 
        ref={containerRef}
        className={`fixed top-15 overflow-y-auto  left-20 !z-[999999999999999] h-[90%] p-5 rounded-xl border dark:bg-zinc-900 bg-white
          transition-all duration-500 ease-in-out transform-gpu
          ${isOpen && activeOption
            ? 'w-[350px] opacity-100 translate-x-0' 
            : 'w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none'
          }`}
      >
        <div className={`transition-opacity duration-300 delay-100 ${isOpen && activeOption ? 'opacity-100' : 'opacity-0'}`}>
          {isOpen && activeOption && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SideBar;