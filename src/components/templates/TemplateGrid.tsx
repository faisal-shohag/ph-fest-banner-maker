import { useState } from "react";
import { MdWidgets } from "react-icons/md";
import TemplateModal from "./TemplateModal";
import { canvasPresets } from "@/lib/constants";

const TemplateCard = ({ template, onClick }) => {
  const height = canvasPresets[template.type].height;
  const width = canvasPresets[template.type].width;
  
  return (
    <div 
      onClick={() => onClick(template)}  
      className="bg-gradient-to-br rounded-lg from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] shadow-md item"
    >
      {template.photoURL ? (
        <img
          src={template.photoURL}
          alt={template.title}
          className="w-full h-auto max-w-full rounded-lg object-contain group-hover:scale-105 transition-transform duration-200"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <MdWidgets size={32} className="text-gray-400 dark:text-gray-600" />
        </div>
      )}
      
      <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent  group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-lg" />
      
      <div className="absolute z-10 bottom-0 left-0 right-0 p-3 text-white opacity-50 transition-opacity duration-200">
        <p className="text-sm font-medium truncate">{template.title || 'Untitled'}</p>
        <p className="text-xs opacity-90">by {template.user.displayName}</p>
      </div>
      
      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {width} × {height}
      </div>
    </div>
  );
};

const TemplateGrid = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };


  return (
    <div className="w-full">
      <div className=" mx-auto masonry">
 
            {templates.map((template) => (
              <div key={template.id}>
                <TemplateCard 
                  template={template} 
                  onClick={handleTemplateClick}
                />
              </div>
            ))}
    
      </div>

      <TemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TemplateGrid;