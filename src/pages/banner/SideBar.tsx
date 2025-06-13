import { ThemeToggle } from "@/components/ui/toggle-theme";
import { BiSolidWidget, BiText } from "react-icons/bi";
import { FaShapes } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import Design from "./sidebar-option-containers/Design";
import Shapes from "./sidebar-option-containers/Shapes";
import Text from "./sidebar-option-containers/Text";
import ImageGallery from "./sidebar-option-containers/ImageGallery";
import { useCanvas } from "@/hooks/use-canvas";

const SideBar = () => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  const handleOptionClick = (option) => {
    setActiveOption(option);
    setIsContainerOpen(true);
  };

  return (
    <div className="h-lvh flex">
      <FloatingContainer 
        isOpen={isContainerOpen} 
        setIsOpen={setIsContainerOpen} 
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />
      
      <div className="z-[9999] dark:bg-zinc-800 bg-zinc-100 py-5 flex flex-col gap-5 min-w-[75px] max-w-[200px] justify-between">
        <div className="flex flex-col gap-10 pt-20">
          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded ${
              activeOption === 'Design' 
                ? 'bg-zinc-300 dark:bg-zinc-600' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Design')}
          >
            <div>
              <BiSolidWidget size={20} />
            </div>
            <div className="text-xs font-bold">Design</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded ${
              activeOption === 'Shapes' 
                ? 'bg-zinc-300 dark:bg-zinc-600' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Shapes')}
          >
            <div>
              <FaShapes size={20} />
            </div>
            <div className="text-xs font-bold">Shapes</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded ${
              activeOption === 'Text' 
                ? 'bg-zinc-300 dark:bg-zinc-600' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Text')}
          >
            <div>
              <BiText size={20} />
            </div>
            <div className="text-xs font-bold">Text</div>
          </div>

          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded ${
              activeOption === 'Images' 
                ? 'bg-zinc-300 dark:bg-zinc-600' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            onClick={() => handleOptionClick('Images')}
          >
            <div>
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



const FloatingContainer = ({ isOpen, setIsOpen, activeOption, setActiveOption }) => {
  const containerRef = useRef(null) as any;
const { handleImageFromURL } = useCanvas()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveOption(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, setActiveOption]);

  if (!isOpen) return null;

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
    <div className="z-[999]">
      <div 
        ref={containerRef}
        className="fixed animate__animated animate__fadeInLeft animate__faster top-10 left-20 !z-[999999999999999] h-[90%] p-5 rounded-xl border min-w-[250px] max-w-[350px] dark:bg-zinc-900 bg-white"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default SideBar;