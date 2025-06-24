import { useState } from "react";
import { MdWidgets } from "react-icons/md";
import TemplateModal from "./TemplateModal";

const TemplateCard = ({ template, onClick }) => {
  return (
    <div>
      <div onClick={() => onClick(template)}  className="bg-gradient-to-br rounded-lg from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden cursor-pointer">
        {template.photoURL ? (
          <img
            src={template.photoURL}
            alt={template.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MdWidgets size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
        )}
         <span className="text-xs text-muted-foreground absolute bottom-0 left-1"> by {template.user.displayName}</span>
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ">
      {templates.map((template) => (
         <TemplateCard 
            key={template.id} 
            template={template} 
            onClick={handleTemplateClick}
          />
      ))}

 <TemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

    </div>
  );
};

export default TemplateGrid;